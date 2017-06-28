<template>
	<div class="content window_select" :id="'win'+list.group._id" :style="not_open">
		<div class="add_juqing" v-show="jq_switch">
			<div class="juqing_container">
				<p class="con_text1">添加剧情</p>
				<p class="con_text2">添加一段剧情，让后续的剧情更精彩</p>
				<textarea v-model="juqingval" :placeholder="juqing_tishi"></textarea>
				<p class="juqing_sure"><span @click="close_juqing">取消</span><span @click="sureadd_juqing">确定</span></p>
			</div>
		</div>
		<div @mousedown="down($event)" class="windowheader">{{list.group.name}}（{{list.group.stat.member}}）
			<p @click.stop="getgroupinfo" @mousedown.stop><img src="~assets/chat/group_info.png" alt=""></p>
			<p @click.stop.conce="change($event)" @mousedown.stop><img src="~assets/chat/smallest.png" alt=""></p>
			<p @click.stop="closewindow" @mousedown.stop><img src="~assets/chat/close1.png" alt=""></p>
		</div>
		<div class="window_hidden">
			<div class="window_box">
				<div class="windowcontent">
					<div class="messageshow" v-for="(slist,sindex) in $store.state.chat.conversation[list.index].msg">
					<div v-if="slist.chat_type=='SYSTEM'" class="system_message">
						<div class="other_revoke">{{slist.content}}</div>
					</div>
					<div v-else>
						<div v-if="slist.chat_type=='DESCRIPTION'">
							<div class="type_description">
								<p v-html="slist.content"></p>
							</div>
							<p class="juqing_name"><span>{{slist.me?$store.state.chat.conversation[list.index].me.name:slist.speaker.speakerName}}添加了剧情</span></p>
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
										<span :id="'chehui'+list.group._id+sindex" class="chehui" data-show="false" :style="{left:slist.chat_type=='SELF'?'-70px':'-30px'}" @click="revoke(list.index,sindex,slist.time)">撤回</span>
										<span :id="'del'+list.group._id+sindex" class="chehui" data-show="false" :style="{left:slist.chat_type=='SELF'?'-100px':'-60px'}" @click="del_msg(list.index,sindex)">删除</span>
									</div>
								</div>
							</div>
							<div v-else class="other_word">
								<div v-if='slist.revoke' class="other_revoke">{{slist.speaker.speakerName}}撤回了一条消息</div>
								<div v-else>
									<img :src="slist.speaker.speakerHeadimg" alt="" class="headimg">
									<div class="other_info">
										<p class="other_name"><span v-if="slist.speaker.speakerTitle" class="group_member_title" :style="{background:title_bg(slist.speaker.memberType)}">{{slist.speaker.speakerTitle}}</span>{{slist.speaker.speakerName}}<span v-show="show_userno_switch">NO.{{slist.speaker.speakerNo}}</span></p>
										
										<div :class="{wordcontent:true,self:slist.chat_type=='SELF',active:slist.content_type=='IMAGE' || slist.content_type=='MAGIC_PIC'}"  @click.stop="show_chehui(sindex,true)">
											<span  v-if="slist.content_type=='TXT'" v-html="emoji(slist.content)" class="slist_content"></span>
											<div v-if="slist.content_type=='MAGIC_PIC'" class="magic_pic">
												<img :src="slist.content.animatedPicUrl" alt="">
											</div>
											<div v-if="slist.content_type=='IMAGE'" class="img_show">
												<img :src="slist.url" alt="" @dblclick="seeimg(slist.url)">
											</div>
											<span class="other_selfsay" v-show="slist.chat_type=='SELF'">本人说</span>
											<span :id="'del'+list.group._id+sindex" class="chehui" data-show="false" :style="{right:slist.chat_type=='SELF'?'-70px':'-30px'}" @click="del_msg(list.index,sindex)">删除</span>
										</div>
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
		<div class="windowfooter"  v-if="!$store.state.chat.conversation[list.index].silenced">
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
				<div class="atlist_container">
					<div class="atlist_content">
						<div class="at_list"  :style="'width:'+$store.state.chat.conversation[list.index].tempAtList.length*131+'px'" @mousedown.stop="downat($event)" >
							<div v-for="(list, index) in $store.state.chat.conversation[list.index].tempAtList">{{list.name}}<div class="delete_at" @click="delete_at(index)">x</div></div>
						</div>
					</div>
				</div>
				<div :class="{wordsay:true,border_left:true,active:!myself_say_act}" @click="f_me_say($event)">角色说</div>
				<div :class="{wordsay:true,border_right:true,active:myself_say_act}" @click="f_me_say($event)">本人说</div>
				<p class="addjuqing_switch" @click="start_juqing">添加剧情</p>
				<p class="select_img" :id="'container'+list.index"><input type="file" accept="image/jpeg,image/jpg,image/png"  :id="'pickfiles'+list.index"><img src="~assets/chat/add_img.png" alt=""></p>
				<p class="face" @click="show_emoji"><img src="~assets/chat/add_face.png" alt=""></p>
				<p class="qun_at" @click.stop="qun_at">@</p>
			</div>
			<div class="messageval">
				<textarea v-model="val" @input="jianting($event)" :placeholder="tishi" :id="'emoji'+list.group._id"@keydown.enter.shift = "sendmessage($event)"></textarea>
				<div class="sendmessage" @click="sendmessage">发送</div>
			</div> 
		</div>
		<div v-else class="jinyan">
			禁言中
		</div>
		<div class="group_info" v-if="group_switch">
			<div class="group_info_header" @mousedown="down($event)"><p>群资料</p><img src="~assets/chat/close1.png" alt="" @click="close_group_info" @mousedown.stop></div>
			<div class="group_banner" :style="{background:'url('+group_info.poster+') center center no-repeat',backgroundSize:'100% 100%'}">
				<img :src="group_info.headimg" alt="">
				<p style="text-shadow:1px 1px 1px #000">{{group_info.name}}</p>
				<p style="text-shadow:1px 1px 1px #000">群号：{{group_info.no}}</p>
			</div>
			<div class="group_details">
				<div class="group_gonggao">
					<p>群公告</p>
					<p>{{group_info.recruit}}</p>
				</div>
				<div class="group_member">
					<p>群成员({{group_info.stat.member}}/{{group_info.max_member}})</p>
					<ul class="group_members_headimg">
						<li v-for="memberlist in group_info.members" @click="f_check_personal(memberlist)"><img :src="memberlist.headimg" alt=""><p>{{memberlist.name}}</p></li>
					</ul>
					<div v-show="group_info.stat.member>6" @click="get_all_members">更多</div>
				</div>
				<div class="group_description">
					<p>群简介</p>
					<p>{{group_info.description}}</p>
				</div>
				<div style="border:none">
					<p style="color:#666">显示角色编号<span class="show_no_switch">/ {{show_userno_string}}</span><span class="check_show_no" :class="{active:check_show_no_act}" @click="f_check_show_no"><i></i></span></p>
				</div>
			</div>
			<div class="all_members" v-if="all_members_show">
				<div class="all_members_header" @mousedown="down($event)"><p>群成员({{group_info.stat.member}}/{{group_info.max_member}})</p><img src="~assets/chat/close1.png" alt="" @click="close_all_members" @mousedown.stop></div>
				<div>
					<ul>
						<li v-for="all_list in all_members_list" class="group_members_details" @click="f_check_personal(all_list)">
							<img :src="all_list.headimg" alt="">
							<div>
								<p>{{all_list.name}}</p>
								<p>NO.{{all_list.no}}</p>
							</div>
							<p v-if="all_list.title" :style="{background:title_bg(all_list.group_member_type)}">{{all_list.title}}</p>
						</li>
					</ul>
				</div>
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
				atlist: [],
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
				//群资料
				group_info: {},
				group_switch: false,
				all_members_show: false,
				all_members_list: [],
				check_show_no_act: false,
				show_userno_string: '已关闭',
				show_userno_switch: false,
				not_open: this.list.not_open ? 'transition:width 1s,height 1s,top 1s,left 1s,border-radius 1s,opacity 1s;height:0;width:0;border-radius:50%;' + 'opacity:0' : '',
				scrollLeft: 0,
			}
		},
		mounted: function() {

			console.log(this.$store.state.chat.cmd_msg)
			document.querySelector('#win' + this.list.group._id).style.left = parseInt(document.body.clientWidth) / 2 - 250 + 'px';
			var me = this;
			console.log(this.$store.state.chat.conversation[this.index]);
			document.onmouseup = function() {
				document.onmousemove = null;
				var dom = document.querySelector('#window_container');
			}
			console.log(this.list);
			this.not_open = this.list.not_open ? 'transition:width 1s,height 1s,top 1s,left 1s,border-radius 1s,opacity 1s;height:0;width:0;border-radius:50%;top:' + (this.$store.state.pageY + 40) + 'px;' + 'left:' + (this.$store.state.pageX + 40) + 'px;' + 'opacity:0' : '';
			console.log(chat.uploadeimg)
			chat.uploadeimg(this.list.index);
		},
		methods: {
			qun_at: function() {
				this.$store.state.show_at = true;
				console.log("测试group:", this.list.group);
				//全局设置当前进行的群会话index
				console.log("this.list.index**********,", this.list.index);
				this.$store.state.chat.at_current_con_index = this.list.index;
				this.$store.state.group_id = this.list.group._id;
			},
			emoji: function(content) {
				var content = content.replace(/</g, '&lt;').
				replace(/>/g, '&gt;').
				replace(/"/g, "&quot;").
				replace(/'/g, "&#039;");
				content = content.replace(/\n/g, "<br />");
				for (var i = 0; i < this.$store.state.chat.emojis.length; i++) {
					if (content.match(this.$store.state.chat.emojis[i].Word)) {
						var ex = new RegExp('\\[' + this.$store.state.chat.emojis[i].Word + '\\]', 'g');
						content = content.replace(ex, '<image style="display: inline-block;position:relative;top:-3px;height: 20px;width: 20px;vertical-align: middle;" src="' + this.$store.state.chat.emojis[i].ImageName + '"/>')
					}
				}
				return content
			},
			delete_at: function(index) {
				//找到索引对应的@项并删除
				var con = this.$store.state.chat.conversation[this.list.index];
				con.tempAtList.splice(index, 1);
				console.log("tempAtList:", con.tempAtList);
			},
			downat: function(event) {
				var dom2 = event.currentTarget.parentNode,
					left = event.clientX;
				var that = this;
				document.onmousemove = function(event) {
					var evt = event || window.event,
						left2 = event.clientX;
					dom2.scrollLeft = left - left2 + that.scrollLeft;
				}
				document.onmouseup = function() {
					that.scrollLeft = dom2.scrollLeft;
					document.onmousemove = null;
				}
			},
			del_msg: function(lindex, sindex) {
				this.$store.state.chat.conversation[lindex].msg.splice(sindex, 1);
			},
			f_check_show_no: function() {
				this.check_show_no_act = !this.check_show_no_act;
				if (this.show_userno_string == '已开启') {
					this.show_userno_string = '已关闭';
				} else {
					this.show_userno_string = '已开启'
				}
				this.show_userno_switch = !this.show_userno_switch;
			},
			title_bg: function(type) {
				if (type == 20) {
					return '#fc9934'
				} else if (type == 10) {
					return '#4eae4d'
				} else {
					return '#3dcbef'
				}
			},
			close_all_members: function() {
				this.all_members_show = false;
			},
			//获取所有群成员
			get_all_members: function() {
				this.$http({
					method: 'get',
					url: 'http://test.mrpyq.com/api/group/members_in_group',
					params: {
						'access_token': localStorage.getItem('access_token'),
						'id': this.list.group._id,
						'page': 1,
					},
					emulateJSON: true,
				}).then((res) => {
					var s = res.body.items,
						n = 1;
					for (var i = 0; i < s.length; i++) {
						console.log(s[i].title)
						if (!s[i].title) {
							n = i;
							console.log(n)
							break;
						}
					}
					var a = [];
					for (var i = n; i < s.length; i++) {
						if (s[i].title) {
							a.push(s[i]);
							s.splice(i, 1);
							i--;
						}
					}
					for (var i = 0; i < a.length; i++) {
						s.splice(n, 0, a[i])
					}
					this.all_members_list = s;
					this.all_members_show = true;
				})
			},
			//群资料
			close_group_info: function() {
				this.group_switch = false;
			},
			//获取群资料
			getgroupinfo: function() {
				this.$http({
					method: 'get',
					url: 'http://test.mrpyq.com/api/group/details',
					params: {
						'access_token': localStorage.getItem('access_token'),
						'id': this.list.group._id,
						'page': 1,
					},
					emulateJSON: true,
				}).then((res) => {
					//title顺序排列
					this.group_info = res.body.group;
					this.group_switch = true;
				})
			},
			//消息向上滚动
			scroll_top: function() {
				this.chehui_switch = false;
				var me = this;
				setTimeout(function() {
					if (me.length != me.$store.state.chat.conversation[me.list.index].msg.length) {
						document.querySelector('#win' + me.list.group._id + ' .window_box').scrollTop = parseInt(window.getComputedStyle(document.querySelector('#win' + me.list.group._id + ' .windowcontent')).height) + 1000;
						console.log(window.getComputedStyle(document.querySelector('#win' + me.list.group._id + ' .windowcontent')).height)
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
					d = document.querySelector('#emoji' + this.list.group._id);
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
				var emoji = '[' + event.target.dataset.name + ']',
					d = document.querySelector('#emoji' + this.list.group._id);
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
						var id = me.list.group._id + sindex;
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
				if (t - time <= 180000) {
					chat.send_revoke(conversation_index, msg_index, "")
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
					chat.send(me.list.index, 0, me.juqingval, 3);
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
				var a = this.$store.state.message_window[this.index],
					index = this.$store.state.message_window[this.index].index;
				a.show = 0;
				this.$store.state.message_window.splice(this.index, 1, a);
				console.log(index)
				for (var j = 0; j < this.$store.state.message_ball.length; j++) {
					if (this.$store.state.message_ball[j].index == index) {
						var b = this.$store.state.message_ball[j];
						b.show = 0;
						this.$store.state.message_ball.splice(j, 1, b);
						break;
					}
				}
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
				var dom = document.querySelector('#win' + this.list.group._id),
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
			sendmessage: function(e) {
				if (e.code == 'Enter' && e.shiftKey == true)
					e.preventDefault()
				if (this.val == '') {
					this.tishi = "请输入内容！";
				} else {
					var me = this;
					var val = me.val;
					var group_at_users = this.$store.state.chat.conversation[me.list.index].tempAtList;
					for (var i = 0; i < group_at_users.length; i++) {
						val += ' @' + group_at_users[i].name;
					}
					chat.send(me.list.index, 0, val, me.myself_say_act, group_at_users);
					this.val = '';
					this.tishi = '';
					this.$store.state.chat.conversation[me.list.index].tempAtList = [];
				}
			},
			send_magicimg(index, type) {
				chat.send_magicimg(index, type);
				this.emoji_swi = false;
			},
			//进入个人中心
			f_check_personal: function(user) {
				this.$store.state.current_user_pe = user;
				this.$store.state.personal_mounted(this.$store.state, this);
				this.$router.push('/Main_page/Personal');
			},
		},
	})

</script>
<style scoped>
	.jinyan {
		background: -webkit-linear-gradient(top left, #ccc 0%, #fff 25%, transparent 25%, transparent 100%), -webkit-linear-gradient(top right, #ccc 0%, #fff 25%, transparent 25%, transparent 100%), -webkit-linear-gradient(bottom left, #ccc 0%, #fff 25%, transparent 25%, transparent 100%), -webkit-linear-gradient(bottom right, #ccc 0%, #fff 25%, transparent 25%, transparent 100%);
		background: -o-linear-gradient(top left, #ccc 0%, #fff 25%, transparent 25%, transparent 100%), -o-linear-gradient(top right, #ccc 0%, #fff 25%, transparent 25%, transparent 100%), -o-linear-gradient(bottom left, #ccc 0%, #fff 25%, transparent 25%, transparent 100%), -o-linear-gradient(bottom right, #ccc 0%, #fff 25%, transparent 25%, transparent 100%);
		background: linear-gradient(to bottom right, #ccc 0%, #fff 25%, transparent 25%, transparent 100%), linear-gradient(to bottom left, #ccc 0%, #fff 25%, transparent 25%, transparent 100%), linear-gradient(to top right, #ccc 0%, #fff 25%, transparent 25%, transparent 100%), linear-gradient(to top left, #ccc 0%, #fff 25%, transparent 25%, transparent 100%);
		color: #333;
		height: 126px;
		line-height: 126px;
		text-align: center;
		font-size: 30px;
		letter-spacing: 40px;
		background-size: 493px;
		text-indent: 40px;
		box-shadow: 0 0 6px 0px #000;
	}
	
	.group_member_title {
		display: inline-block;
		padding: 0 5px;
		border-radius: 3px;
		color: #FFF!important;
		margin: 0 5px 0 0!important;
		line-height: 16px;
	}
	
	.all_members {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;
	}
	
	.all_members>div:nth-child(2) {
		height: 556px;
		width: 600px;
		overflow: auto;
	}
	
	.all_members li {
		width: 500px;
		height: 60px;
		float: left;
		border-bottom: 1px solid #ededed;
		cursor: pointer;
	}
	
	.all_members li:hover {
		background: #ccc;
	}
	
	.group_members_details>img {
		float: left;
		height: 50px;
		width: 50px;
		border-radius: 5px;
		margin: 5px 10px;
	}
	
	.group_members_details>div {
		float: left;
		width: 300px;
		margin-left: 5px;
	}
	
	.group_members_details>div>p {
		font-size: 14px;
		width: 300px;
		margin-top: 7px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.group_members_details>div>p:nth-child(2) {
		margin-top: 5px;
		color: #888;
	}
	
	.group_members_details>p {
		float: right;
		padding: 0 5px;
		background: #ccc;
		border-radius: 3px;
		margin-top: 19px;
		margin-right: 10px;
		font-size: 12px;
		line-height: 22px;
		color: #fff;
	}
	
	.check_show_no {
		float: right;
		width: 40px;
		height: 20px;
		background: #fff;
		border-radius: 11px;
		cursor: pointer;
		margin: 10px 8px 0 0;
		position: relative;
		border: 1px solid #ddd;
		transition: all .3s;
	}
	
	.check_show_no.active {
		background: #42c047;
		border: 1px solid #42c047;
	}
	
	.check_show_no>i {
		display: block;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 0 5px #000;
		position: absolute;
		top: 2px;
		left: 1px;
		transition: all .3s;
	}
	
	.check_show_no.active>i {
		left: 23px;
		box-shadow: none;
	}
	
	.show_no_switch {
		color: #999;
		font-size: 12px;
		margin-left: 20px;
	}
	
	.group_members_headimg {
		float: left;
		padding-bottom: 10px;
		width: 410px;
	}
	
	.group_members_headimg>li {
		float: left;
		padding: 0 9px;
		cursor: pointer;
	}
	
	.group_members_headimg>li>img {
		display: block;
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}
	
	.group_members_headimg>li>p {
		width: 50px;
		text-align: center;
		font-size: 12px;
		margin-top: 5px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		color: #999;
	}
	
	.group_member>div {
		float: left;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		border: 1px solid #ddd;
		text-align: center;
		line-height: 50px;
		background: #eee;
		margin-left: 9px;
		cursor: pointer;
	}
	
	.group_details {
		padding-left: 12px;
	}
	
	.group_details>div>p:nth-child(1) {
		font-size: 14px;
		color: #999;
		line-height: 40px;
	}
	
	.group_details>div>p:nth-child(2) {
		line-height: 20px;
		color: #666;
		padding-bottom: 5px;
	}
	
	.group_details>div {
		border-bottom: 1px solid #ededed;
		float: left;
		width: 100%;
	}
	
	.group_banner {
		height: 240px;
		overflow: hidden;
	}
	
	.group_banner>img {
		display: block;
		width: 80px;
		height: 80px;
		margin: 0 auto;
		margin-top: 40px;
		border-radius: 50%;
	}
	
	.group_banner>p {
		color: #fff;
		text-align: center;
	}
	
	.group_banner>p:nth-child(2) {
		font-size: 16px;
		margin-top: 15px;
	}
	
	.group_banner>p:nth-child(3) {
		font-size: 12px;
		line-height: 24px
	}
	
	.group_info {
		position: absolute;
		background: #fcfcfc;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}
	
	.system_message {
		margin-bottom: 12px;
	}
	
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
	
	.emoji_tu>p {
		margin: 5px;
		float: left;
		cursor: pointer;
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
	
	.windowheader,
	.group_info_header,
	.all_members_header {
		width: 500px;
		background: #333;
		height: 55px;
		font-size: 16px;
		text-align: center;
		color: #fff;
		line-height: 55px;
		position: relative;
	}
	
	.group_info_header>img,
	.all_members_header>img {
		position: absolute;
		display: block;
		width: 12px;
		top: 22px;
		right: 15px;
		cursor: pointer;
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
		right: 70px;
	}
	
	.windowheader>p:nth-child(1)>img {
		width: 18px;
		margin-top: 22px;
	}
	
	.windowheader>p:nth-child(2) {
		right: 40px;
	}
	
	.windowheader>p:nth-child(2)>img {
		margin-top: 28px;
	}
	
	.windowheader>p:nth-child(3)>img {
		margin-top: 23px;
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
	
	.atlist_container {
		position: absolute;
		left: 0;
		top: -24px;
		height: 24px;
		width: 100%;
		overflow: hidden;
	}
	
	.atlist_content {
		width: 100%;
		height: 100px;
		overflow-x: scroll;
		overflow-y: hidden;
	}
	
	.at_list {
		height: 2224px;
		cursor: pointer;
	}
	
	.delete_at {
		position: absolute;
		height: 14px;
		font-size: 12px;
		line-height: 14px;
		top: 3px;
		width: 14px;
		right: 0px;
		border-radius: 50%;
		border: 1px solid #999;
		background: #fff;
		text-align: center;
	}
	
	.at_list>div {
		max-width: 100px;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		float: left;
		height: 22px;
		border: #333 1px solid;
		line-height: 22px;
		margin-right: 6px;
		background: #fff;
		border-radius: 5px;
		padding: 0 20px 0 5px;
		position: relative;
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
		-moz-user-select: text;
		-webkit-user-select: text;
		-ms-user-select: text;
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
		white-space: pre-wrap;
		word-break: break-word;
		cursor: pointer;
		-moz-user-select: text;
		-webkit-user-select: text;
		-ms-user-select: text;
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
	
	p.qun_at {
		float: right;
		line-height: 40px;
		margin-right: 20px;
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
	
	.emojis {
		margin: 5px;
		float: left;
		cursor: pointer;
		width: 30px;
		height: 30px;
	}

</style>
