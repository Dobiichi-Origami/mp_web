<template>
	<div class="content window_select" :id="'win'+list.user.user._id" :style="not_open">
		<div class="add_juqing" v-show="jq_switch">
			<div class="juqing_container">
				<p class="con_text1">添加剧情</p>
				<p class="con_text2">添加一段剧情，让后续的剧情更精彩</p>
				<textarea v-model="juqingval" :placeholder="juqing_tishi"></textarea>
				<p class="juqing_sure"><span @click="close_juqing">取消</span><span @click="sureadd_juqing">确定</span></p>
			</div>
		</div>
		<div @mousedown="down($event)" class="windowheader">{{list.user.name}}{{linshi==1?'(临时会话)':''}}
			<p @click.stop.conce="change($event)" @mousedown.stop><img src="~assets/chat/smallest.png" alt=""></p>
			<p @click.stop="closewindow" @mousedown.stop><img src="~assets/chat/close1.png" alt=""></p>
		</div>
		<div class="window_hidden">
			<div class="window_box">
				<div class="windowcontent">
					<div class="messageshow" v-for="(slist,sindex) in $store.state.chat.conversation[list.index].msg">
					{{chat()}}
						<div v-if="slist.chat_type=='DESCRIPTION'">
							<div class="type_description">
								<p>{{slist.content}}</p>
							</div>
							<p class="juqing_name"><span>{{slist.me?$store.state.chat.conversation[list.index].me.name:$store.state.chat.conversation[list.index].other.name}}添加了剧情</span></p>
						</div>
						<div v-else>
							<div v-if="slist.me" class="me_word">
								<div v-if='slist.revoke' class="revoke">你撤回了一条消息</div>
								<div v-else>
									<img :src="$store.state.chat.conversation[list.index].me.headimg" alt="" class="headimg">
									<div :class="{wordcontent:true,self:slist.chat_type=='SELF',active:slist.content_type=='IMAGE' || slist.content_type=='MAGIC_PIC'}" @click="show_chehui(sindex)" >
										<span  v-if="slist.content_type=='TXT'" v-html="emoji(slist.content)" class="slist_content"></span>
										<div v-if="slist.content_type=='MAGIC_PIC'" class="magic_pic">
											<img :src="slist.content.animatedPicUrl" alt="" >
										</div>
										<div v-if="slist.content_type=='IMAGE'" class="img_show">
											<div v-if="slist.send_success" class="otherurl">
												<img :src="slist.url" alt="" @dblclick="seeimg(slist.url)" @click.stop="show_chehui(sindex,true)">
											</div>
											<div  v-else class="localurl" @click.stop>
												<div class="ajax-loader-container"><div class="ajax-loader"></div></div>
												<img :src="slist.url" alt="">
											</div>
										</div>
										<span class="me_selfsay" v-show="slist.chat_type=='SELF'">本人说</span>
										<span :id="'chehui'+list.user.user._id+sindex" class="chehui" data-show="false" :style="{left:slist.chat_type=='SELF'?'-70px':'-30px'}" @click="revoke(list.index,sindex,slist.time)">撤回</span>
										<span :id="'del'+list.user.user._id+sindex" class="chehui" data-show="false" :style="{left:slist.chat_type=='SELF'?'-100px':'-60px'}" @click="del_msg(list.index,sindex)">删除</span>
									</div>
								</div>
							</div>
							<div v-else class="other_word">
								<div v-if='slist.revoke' class="other_revoke">{{$store.state.chat.conversation[list.index].other.name}}撤回了一条消息</div>
								<div v-else>
									<img :src="$store.state.chat.conversation[list.index].other.headimg" alt="" class="headimg">
									<div class="other_info">
										<p class="other_name">{{$store.state.chat.conversation[list.index].other.name}}<span>NO.{{$store.state.chat.conversation[list.index].other.no}}</span></p>
										<div :class="{wordcontent:true,self:slist.chat_type=='SELF',active:slist.content_type=='IMAGE' || slist.content_type=='MAGIC_PIC'}" @click="show_chehui(sindex)">
											<span  v-if="slist.content_type=='TXT'" v-html="emoji(slist.content)" class="slist_content"></span>
											<div v-if="slist.content_type=='MAGIC_PIC'" class="magic_pic">
												<img :src="slist.content.animatedPicUrl" alt="">
											</div>
											<div v-if="slist.content_type=='IMAGE'" class="img_show">
												<img :src="slist.url" alt="" @dblclick="seeimg(slist.url)" @click.stop="show_chehui(sindex,true)">
											</div>
											<span class="other_selfsay" v-show="slist.chat_type=='SELF'">本人说</span>
											<span :id="'del'+list.user.user._id+sindex" class="chehui" data-show="false" :style="{right:slist.chat_type=='SELF'?'-70px':'-30px'}" @click="del_msg(list.index,sindex)">删除</span>
										</div>
									</div>	
								</div>
							</div>
						</div>
					</div>
				</div>
				{{scroll_top()}}
			</div>
		</div>
		<div class="windowfooter">
			<div class="emoji_box" v-show="emoji_swi">
				<div class="emoji_type">
					<span :class="{active:emojitype==0}" @click="check_emojitype(0)"><img src="~assets/chat/face1.png" alt=""></span>
					<span :class="{active:emojitype==1}" @click="check_emojitype(1)"><img src="~assets/chat/face2.png" alt=""></span>
					<span :class="{active:emojitype==2}" @click="check_emojitype(2)"><img src="~assets/chat/face3.png" alt=""></span>
					<span :class="{active:emojitype==3}" @click="check_emojitype(3)"><img src="~assets/chat/face4.png" alt=""></span>
					<span @click="close_emoji"></span>
				</div>
				<div class="emoji_container">
					<div class="emoji_content">
						<div class="emoji_tu" v-show="emojitype==0">
							<img v-for="emo in $store.state.chat.emojis" @click="f_check_emoji($event)" :src="emo.ImageName" :data-name="emo.Word" class="emojis">
						</div>
						<div class="emoji_yan" v-show="emojitype==1">
							<span v-for="emo in $store.state.chat.emoji.yan_emoji" @click="add_yan_emoji($event)">{{emo}}</span>
						</div>
						<div class="emoji_wen" v-show="emojitype==2">
							<span v-for="emo in $store.state.chat.emoji.wen_emoji" @click="add_yan_emoji($event)">{{emo}}</span>
						</div>
						<div class="emoji_mo" v-show="emojitype==3">	
							<p @click="send_magicimg(list.index,1)" class="magic_img"><img src="~assets/chat/shitou.png" alt=""></p>
							<p @click="send_magicimg(list.index,0)" class="magic_img"><img src="~assets/chat/saizi.png" alt="" class="small"></p>
						</div>
					</div>
				</div>
			</div>
			<div class="windowfooter_func">
				<div :class="{wordsay:true,border_left:true,active:!myself_say_act}" @click="f_me_say($event)">角色说</div>
				<div :class="{wordsay:true,border_right:true,active:myself_say_act}" @click="f_me_say($event)">本人说</div>
				<p class="addjuqing_switch" @click="start_juqing">添加剧情</p>
				<p class="select_img" :id="'container'+list.index"><input type="file" accept="image/jpeg,image/jpg,image/png"  :id="'pickfiles'+list.index"><img src="~assets/chat/add_img.png" alt=""></p>
				<p class="face" @click="show_emoji"><img src="~assets/chat/add_face.png" alt=""></p>
			</div>
			<div class="messageval">
				<textarea v-model="val" @input="jianting($event)" :placeholder="tishi" :id="'emoji'+list.user.user._id"></textarea>
				<div class="sendmessage" @click="sendmessage">发送</div>
			</div> 
		</div>
	</div>
</template>
<script>
	import chat from "src/chat/index.js"
	export default ({
		props: ['index', 'list'],
		data() {
			return {
				myself_say_act: 0,
				juqing: 0,
				val: '',
				juqingval: '',
				//剧情显示开关
				jq_switch: false,
				tishi: '',
				juqing_tishi: '',
				emojitype: 0,
				emoji_swi: false,
				length: 0,
				chehui_switch: true,
				not_open: this.list.not_open ? 'transition:width 1s,height 1s,top 1s,left 1s,border-radius 1s,opacity 1s;height:0;width:0;border-radius:50%;' + 'opacity:0' : '',
				linshi: this.$store.state.chat.conversation[this.list.index].msg.length ? this.$store.state.chat.conversation[this.list.index].msg[0].temp : 0
			}
		},
		mounted: function() {
			console.log(this.$store.state.chat.emojis)
			document.querySelector('#win' + this.list.user.user._id).style.left = parseInt(document.body.clientWidth) / 2 - 250 + 'px';
			var me = this;
			console.log(this.$store.state.chat.conversation[this.index]);
			document.onmouseup = function() {
				document.onmousemove = null;
				var dom = document.querySelector('#window_container');
			}
			console.log(this.list);
			this.not_open = this.list.not_open ? 'transition:width 1s,height 1s,top 1s,left 1s,border-radius 1s,opacity 1s;height:0;width:0;border-radius:50%;top:' + (this.$store.state.pageY + 40) + 'px;' + 'left:' + (this.$store.state.pageX + 40) + 'px;' + 'opacity:0' : '';
			//引入Plupload 、qiniu.js后
			chat.uploaderimg(this.list.index);
		},
		methods: {
			del_msg: function(lindex, sindex) {
				this.$store.state.chat.conversation[lindex].msg.splice(sindex, 1);
			},
			chat: function() {
				console.log(1)
			},
			//转换表情
			emoji:function(content){
				for(var i=0;i<this.$store.state.chat.emojis.length;i++){
					if(content.match(this.$store.state.chat.emojis[i].Word)){
						var ex=new RegExp('\\['+this.$store.state.chat.emojis[i].Word+'\\]');
						content=content.replace(ex,'<image style="display: inline-block;position:relative;top:-3px;height: 20px;width: 20px;vertical-align: middle;" src="'+this.$store.state.chat.emojis[i].ImageName+'"/>')
					}
				}
				return content
			},
			scroll_top: function() {
				this.chehui_switch = false;
				var me = this;
				setTimeout(function() {
					if (me.length != me.$store.state.chat.conversation[me.list.index].msg.length) {
						document.querySelector('#win' + me.list.user.user._id + ' .window_box').scrollTop = parseInt(window.getComputedStyle(document.querySelector('#win' + me.list.user.user._id + ' .windowcontent')).height) + 1000;
						console.log(window.getComputedStyle(document.querySelector('#win' + me.list.user.user._id + ' .windowcontent')).height)
						me.length = me.$store.state.chat.conversation[me.list.index].msg.length;
					}
				}, 10)
			},
			seeimg: function(url) {
				var photos = [],
					index = 0;
				for (var i = 0; i < this.$store.state.chat.conversation[this.list.index].msg.length; i++) {
					if (this.$store.state.chat.conversation[this.list.index].msg[i].content_type == 'IMAGE') {
						photos.push({
							large: this.$store.state.chat.conversation[this.list.index].msg[i].url
						})
					}
				}
				for (var j = 0; j < photos.length; j++) {
					if (url == photos[j].large) {
						index = j;
						break;
					}
				}
				console.log(index);

				this.$store.state.see_img(this.$store.state, index, photos);

			},
			check_emojitype: function(type) {
				this.emojitype = type;
			},
			add_yan_emoji: function(event) {
				var emoji = event.target.innerHTML,
					d = document.querySelector('#emoji' + this.list.user.user._id);
				if (d) {
					d.focus();
				}
				if (typeof document.selection != "undefined") {
					document.selection.createRange().text = emoji;
				} else {
					this.val = d.value.substr(0, d.selectionStart) + emoji + d.value.substring(d.selectionStart, d.value.length);
				}
				this.emoji_swi = false;
			},
			show_emoji: function() {
				this.emoji_swi = true;
				console.log(this.emoji_swi)
			},
			close_emoji: function() {
				this.emoji_swi = false;
			},
			f_check_emoji: function(event) {
				var emoji = '['+event.target.dataset.name+']',
					d = document.querySelector('#emoji' + this.list.user.user._id);
				if (d) {
					d.focus();
				}
				if (typeof document.selection != "undefined") {
					document.selection.createRange().text = emoji;
				} else {
					this.val = d.value.substr(0, d.selectionStart) + emoji + d.value.substring(d.selectionStart, d.value.length);
				}
				this.emoji_swi = false;
			},
			show_chehui: function(sindex, is_img) {
				var me = this,
					t = 0;
				this.chehui_switch = true;
				if (is_img) {
					t = 350;
				}
				setTimeout(function() {
					if (me.chehui_switch) {
						var id = me.list.user.user._id + sindex;
						console.log(id)
						var dom1 = document.querySelector('#chehui' + id),
							dom2 = document.querySelector('#del' + id);
						if (dom1) {
							if (dom1.dataset.show == 'true') {
								dom1.style.display = 'none';
								dom1.dataset.show = 'false';
							} else {
								dom1.style.display = 'block';
								dom1.dataset.show = 'true';
							}
						}
						if (dom2) {
							if (dom2.dataset.show == 'true') {
								dom2.style.display = 'none';
								dom2.dataset.show = 'false';
							} else {
								dom2.style.display = 'block';
								dom2.dataset.show = 'true';
							}
						}
					}
				}, t)
			},
			revoke: function(conversation_index, msg_index, time) {
				var t = new Date().getTime();
				// console.log(t-(time*1000))
				if (t - time * 1000 <= 1800000) {
					chat.cmd_sender("msg_revoke", conversation_index, msg_index, "")
				} else {
					this.$store.state.f_error(this.$store.state, "该消息发送时间已超过三分钟，不能撤回");
				}
			},
			//取消剧情
			close_juqing: function() {
				this.jq_switch = false;
				this.juqingval = '';
			},
			jianting: function(event) {

			},
			//确认添加剧情
			sureadd_juqing: function() {
				if (this.juqingval == '') {
					this.juqing_tishi = '请输入内容！'
				} else {
					var me = this;
					chat.send(me.list.index, 0, me.juqingval, 3, 0);
					this.jq_switch = false;
					this.juqingval = '';
					this.juqing_tishi = '';
				}

			},
			//开始剧情
			start_juqing: function() {
				this.jq_switch = true;
			},
			closewindow: function() {
				var dom = document.querySelectorAll('.window_select')[this.index];
				dom.style.transition = "width 1s,height 1s,top 1s,left 1s,border-radius 1s,opacity 1s";
				dom.style.height = '0';
				dom.style.width = '0';
				dom.style.borderRadius = "50%";
				dom.style.top = this.$store.state.pageY + 40 + 'px';
				dom.style.left = this.$store.state.pageX + 40 + 'px';
				console.log(this.$store.state.pageX)
				dom.style.opacity = '0';
				var a = this.$store.state.message_window[this.index];
				a.show = 0;
				this.$store.state.message_window.splice(this.index, 1, a);
			},
			f_me_say: function(event) {
				var val = event.target.innerHTML;
				if (val == '角色说') {
					this.myself_say_act = 0;
				} else {
					this.myself_say_act = 1;
				}

			},
			change: function(event) {
				var dom = document.querySelectorAll('.window_select')[this.index];
				dom.style.transition = "width 1s,height 1s,top 1s,left 1s,border-radius 1s,opacity 1s";
				dom.style.height = '0';
				dom.style.width = '0';
				dom.style.borderRadius = "50%";
				dom.style.top = this.$store.state.pageY + 40 + 'px';
				dom.style.left = this.$store.state.pageX + 40 + 'px';
				console.log(this.$store.state.pageX)
				dom.style.opacity = '0';
			},
			down: function(event) {
				var dom = event.target.parentNode,
					box = document.querySelectorAll('.window_select')[this.index],
					x = parseInt(window.getComputedStyle(dom).left),
					y = parseInt(window.getComputedStyle(dom).top),
					x1 = event.clientX,
					y1 = event.clientY;
				box.style.transition = "none";
				dom.style.zIndex = ++this.$store.state.message_window_index;
				document.onmousemove = function(event) {
					console.log(1)
					var evt = window.event || event,
						x2 = evt.clientX,
						y2 = evt.clientY;
					var a = x2 - (x1 - x),
						b = y2 - (y1 - y);
					evt.preventDefault();
					if (a < -200) {
						a = -200;
					} else if (a > parseInt(window.innerWidth) - 200) {
						a = parseInt(window.innerWidth) - 200
					}
					if (b < 0) {
						b = 0;
					} else if (b > parseInt(window.innerHeight) - 200) {
						b = parseInt(window.innerHeight) - 200
					}
					dom.style.left = a + 'px';
					dom.style.top = b + 'px';
				}
			},
			sendmessage: function() {
				// 	chat.send(index, type, content_url, chat_type, temp)
				// index 发送目标序号
				// type 发送类型，0为文本，1为图片，2为魔法表情，3为红包，4为礼物。
				// content_url 发送内容，文本或url
				// chat_type 聊天类型 0为角色说，1为本人说，2为剧情
				// temp 0 普通消息 1 临时消息
				if (this.val == '') {
					this.tishi = "请输入内容！";
				} else {
					var me = this;
					chat.send(me.list.index, 0, me.val, me.myself_say_act, 0);
					this.val = '';
					this.tishi = '';
					console.log(this.$store.state.chat.conversation[this.list.index])
				}
			},
			send_magicimg(index, type) {
				chat.send_magicimg(index, type);
				this.emoji_swi = false;
			},
		},
	})

</script>
<style scoped>
	.magic_img {
		cursor: pointer;
		float: left;
		padding: 10px;
	}
	
	.magic_img:hover {
		background: #ccc;
	}
	
	.magic_img:nth-child(2) {
		padding: 20px;
	}
	
	.magic_img>img {
		display: block;
		width: 60px;
	}
	
	.magic_img>img.small {
		width: 40px;
	}
	
	.other_revoke {
		display: table;
		font-size: 12px;
		background: #ddd;
		text-align: center;
		border-radius: 3px;
		padding: 0 10px;
		margin: 0 auto;
	}
	
	.revoke {
		display: table;
		background: #ddd;
		border-radius: 3px;
		text-align: center;
		font-size: 12px;
		padding: 0 10px;
		margin: 0 auto;
	}
	
	.magic_pic>img {
		display: block;
		width: 70px;
	}
	.ajax-loader-container {
		position: absolute;
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, .3);
	}
	
	.ajax-loader {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -.75em;
		margin-left: -.75em;
	}
	
	.localurl>img {
		display: block;
		width: 80px;
		border-radius: 5px;
	}
	
	.localurl {
		position: relative;
	}
	
	.otherurl>img,
	.img_show>img {
		display: block;
		width: 150px;
		border-radius: 5px;
	}
	
	.select_img {
		float: right;
		width: 26px;
		height: 22px;
		overflow: hidden;
		position: relative;
		margin: 8px 15px 0 0;
	}
	
	.select_img>img {
		display: block;
		height: 22px;
	}
	
	.select_img>input {
		font-size: 0;
		position: absolute;
		top: 0;
		left: 0;
		display: block;
		opacity: 0;
		height: 100%;
		width: 100%;
		cursor: pointer;
	}
	
	.emoji_box {
		width: 500px;
		height: 150px;
		overflow: hidden;
		position: absolute;
		top: -150px;
		left: 0;
		background: #ddd;
		border-top: 1px solid #bbb;
		border-bottom: 1px solid #bbb;
	}
	
	.emoji_container {
		width: 530px;
		height: 120px;
		overflow: auto;
		border-top: 1px solid #bbb;
	}
	
	.emoji_content {
		width: 480px;
		padding: 0 10px;
	}
	
	.emojis{
		margin: 5px;
		float: left;
		cursor: pointer;
		width: 30px;
		height: 30px;
	}
	
	.emoji_type {
		overflow: hidden;
	}
	
	.emoji_type>span {
		float: left;
		width: 50px;
		height: 30px;
		line-height: 30px;
		border-right: 1px solid #bbb;
		text-align: center;
		background: #ccc;
		cursor: pointer;
	}
	
	.emoji_type>span.active {
		background: #aaa;
	}
	
	.emoji_type>span:nth-child(5) {
		float: right;
		border-right: none;
		border-left: 1px solid #bbb;
		background: url(~assets/chat/close_emoji.png) center center no-repeat;
		border: none;
	}
	
	.emoji_yan>span,
	.emoji_wen>span {
		float: left;
		width: 160px;
		height: 50px;
		text-align: center;
		cursor: pointer;
		line-height: 50px;
	}
	
	.emoji_yan>span:hover,
	.emoji_wen>span:hover {
		background: #bbb;
	}
	
	.content {
		position: fixed;
		top: 100px;
		z-index: 999;
		width: 500px;
		overflow: hidden;
		background: #f8f6f7;
		color: #333;
		border-radius: 8px;
		box-shadow: 1px 1px 6px #333;
		height: 611px;
	}
	
	.windowheader {
		background: #333;
		height: 55px;
		font-size: 16px;
		text-align: center;
		color: #fff;
		line-height: 55px;
		position: relative;
	}
	
	.windowheader>p {
		position: absolute;
		color: #fff;
		height: 100%;
		right: 12px;
		top: 0;
		cursor: pointer;
	}
	
	.windowheader>p>img {
		display: block;
		width: 16px;
	}
	
	.windowheader>p:nth-child(1) {
		right: 40px;
	}
	
	.windowheader>p:nth-child(1)>img {
		margin-top: 25px;
	}
	
	.windowheader>p:nth-child(2)>img {
		margin-top: 20px;
		width: 12px;
	}
	
	.window_box {
		width: 530px;
		height: 430px;
		overflow: auto;
	}
	
	.window_hidden {
		width: 500px;
		height: 430px;
		overflow: hidden;
	}
	
	.windowcontent {
		width: 470px;
		padding: 15px;
	}
	
	.windowfooter {
		border-top: 1px solid #ccc;
		background: #fff;
		padding-bottom: 15px;
		position: relative;
	}
	
	.windowfooter_func {
		height: 40px;
	}
	
	.wordsay {
		height: 22px;
		color: #333;
		width: 54px;
		background: #fff;
		border: 1px solid #333;
		float: left;
		line-height: 22px;
		font-size: 12px;
		margin-top: 8px;
		text-align: center;
		cursor: pointer;
	}
	
	.wordsay.active {
		color: #fff;
		background: #333;
	}
	
	.wordsay.active:hover {
		background: #333;
	}
	
	.wordsay:hover {
		background: #ededed;
	}
	
	.border_left {
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
		margin-left: 15px;
	}
	
	.border_right {
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}
	
	.messageval>textarea {
		float: left;
		width: 360px;
		border: 1px solid #ccc;
		font-size: 12px;
		margin-left: 15px;
		border-radius: 5px;
		background: #ededed;
		padding: 5px;
		line-height: 18px;
		height: 58px;
	}
	
	.get_height {
		white-space: pre-wrap;
		width: 370px;
		padding: 0 10px;
		font-size: 12px;
	}
	
	.messageval {
		overflow: hidden;
		position: relative;
		width: 100%;
	}
	
	.messageval .sendmessage {
		width: 80px;
		height: 32px;
		background: #333;
		color: #fff;
		border-radius: 5px;
		position: absolute;
		right: 17px;
		bottom: 0;
		line-height: 32px;
		font-size: 14px;
		text-align: center;
		cursor: pointer;
	}
	
	.messageval .sendmessage:hover {
		background: #454545;
	}
	
	.gugai {
		position: absolute;
	}
	
	.me_word,
	.other_word {
		width: 100%;
		overflow: hidden;
		margin-bottom: 12px;
	}
	
	.me_word .headimg {
		width: 40px;
		height: 40px;
		float: right;
		border-radius: 50%;
	}
	
	.chehui {
		width: 24px;
		line-height: 33px;
		cursor: pointer;
		position: absolute;
		top: 0;
		color: #df7e7e;
		display: none;
		font-size: 12px;
	}
	
	.wordcontent {
		float: right;
		border-radius: 5px;
		border: 1px solid #cde3ee;
		background: #e4f3fa;
		padding: 3px 10px;
		line-height: 20px;
		font-size: 12px;
		margin: 5px 15px 0 0;
		max-width: 300px;
		text-align: left;
		position: relative;
		/*white-space: pre-wrap;*/
		word-break: break-word;
		cursor: pointer;
	}
	
	div.wordcontent.active {
		padding: 0;
		white-space: normal;
		border: none;
	}
	
	.wordcontent.self,
	.other_word .wordcontent.self {
		background: #ddd;
		border: 1px solid #ccc;
	}
	
	.add_juqing {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		z-index: 99;
		overflow: hidden;
	}
	
	.con_text1 {
		font-size: 14px;
		color: #777;
		text-align: center;
		line-height: 35px;
	}
	
	.con_text2 {
		font-size: 12px;
		text-align: center;
	}
	
	.juqing_container {
		margin: 0 auto;
		margin-top: 200px;
		width: 300px;
		background: #ededed;
		padding-top: 5px;
		border-radius: 5px;
		border: 1px solid #fff;
	}
	
	.juqing_container>textarea {
		display: block;
		border-radius: 5px;
		border: 1px solid #ccc;
		margin: 0 auto;
		margin-top: 8px;
		width: 240px;
		height: 80px;
		font-size: 12px;
		overflow: auto;
		background: #fff;
		line-height: 20px;
		white-space: pre-wrap;
		word-break: break-word;
		padding: 5px;
	}
	
	.type_description {
		margin: 0 auto;
		position: relative;
		width: 400px;
		border: 1px solid #ccc;
		border-radius: 5px;
		cursor: pointer;
	}
	
	.type_description>p:nth-child(1) {
		text-align: center;
		font-size: 12px;
		color: #333;
		padding: 10px 0 15px 0;
		line-height: 20px;
		white-space: pre-wrap;
	}
	
	p.juqing_name {
		padding: 0 10px;
		margin: 0 auto;
		display: table;
		position: relative;
		height: 20px;
		line-height: 20px;
		font-size: 12px;
		top: -10px;
		background: #f8f6f7;
	}
	
	p.juqing_name>span {
		display: block;
		border: 1px solid #ccc;
		border-radius: 3px;
		line-height: 20px;
		padding: 0 5px;
		background: #ddd;
		color: #999;
	}
	
	p.juqing_sure {
		border-top: 1px solid #ccc;
		margin-top: 10px;
		overflow: hidden;
	}
	
	p.juqing_sure>span {
		text-align: center;
		float: left;
		line-height: 40px;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		width: 50%;
		color: #999;
		font-size: 14px;
		cursor: pointer;
		background: -webkit-linear-gradient(top left, #eee, #ccc, #fff);
		background: -o-linear-gradient(top left, #eee, #ccc, #fff);
		background: linear-gradient(to bottom right, #eee, #ccc, #fff);
	}
	
	p.juqing_sure>span:hover {
		background: #fff;
	}
	
	p.juqing_sure>span:nth-child(1) {
		border-right: 1px solid #ccc;
	}
	
	p.juqing_sure>span:nth-child(2) {
		color: #f09a9a;
	}
	
	p.addjuqing_switch {
		float: right;
		line-height: 40px;
		margin-right: 30px;
		cursor: pointer;
		background: url(~assets/chat/add_juqing.png) left center no-repeat;
		padding-left: 16px;
		background-size: 12px;
	}
	
	p.face {
		float: right;
		line-height: 40px;
		cursor: pointer;
		margin: 8px 15px 0 0;
	}
	
	p.face>img {
		display: block;
		width: 22px;
	}
	
	.me_selfsay {
		position: absolute;
		font-size: 12px;
		color: #999;
		display: block;
		width: 45px;
		bottom: 0;
		left: -45px;
		line-height: 20px;
		text-align: center;
	}
	
	.other_selfsay {
		position: absolute;
		font-size: 12px;
		color: #999;
		display: block;
		width: 45px;
		bottom: 0;
		right: -45px;
		line-height: 20px;
		text-align: center;
	}
	
	.other_word .headimg {
		width: 40px;
		height: 40px;
		float: left;
		border-radius: 50%;
		margin-top: 5px;
	}
	
	.other_info {
		overflow: hidden;
		float: left;
		width: 400px;
		margin-left: 15px;
	}
	
	.other_word .wordcontent {
		float: left;
		background: #fff;
		border: #ccc 1px solid;
		margin: 2px 0 0 0;
	}
	
	.other_name {
		font-size: 14px;
		margin: 0;
	}
	
	.other_name>span {
		font-size: 12px;
		color: #999;
		margin-left: 5px;
	}
	
	.messageshow {
		position: relative;
	}

</style>
