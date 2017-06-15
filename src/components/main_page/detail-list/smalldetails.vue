<template>
	<div id="outer_box">
	<div class="user_list">
		<div :class="{show_img:true,animated:true,fadeIn:is_piIn,fadeOut:is_piOut}" v-show="is_pi_show" @click.stop="f_hide_pi($event)">
			<div class="container">	
				<div class="pi_chu">
					<ul class="pi_list">
						<li v-for="(list,listindex) in this.$store.state.users" @click.stop="f_sure_add(listindex)">
							<img :src="list.headimg">
							<h3>{{list.name}}</h3>
							<span :style="level_color(list.level_exp.level)">Lv.{{list.level_exp.level}}</span>
							<p>{{list.description}}</p>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<seeimg></seeimg>
		<div>
			<img :src="this.$store.state.details.item.user.headimg" @click="f_check_personal($store.state.details.item.user)" class="headimg"/>
			<div class="user_inform">
				<h3>{{this.$store.state.details.item.user.name}}</h3>
				<p>{{$store.state.cheTime(this.$store.state.details.item.time.create)}}</p>
			</div>
			<div class="i_like">
				<img src="../../../assets/i_like_selected.png" v-if="this.my_pi_like" data-like="true" :data-id="$store.state.details.item._id" @click="change_like($event)">
				<img src="../../../assets/i_like_32b7cd5a.png" v-else data-like="false" :data-id="$store.state.details.item._id" @click="change_like($event)">
				<span>赞</span>
			</div>
			<div v-if="this.$store.state.details.item.user.me" class="de_my_title" @click.stop="f_de_mytitle($event)">
				<p>删除</p>
				<div>
					<span class="de_sure" @click="f_sure_demytitle">确定</span>
					<span class="de_default">取消</span>
				</div>
			</div>
		</div>
		<div :class="{content:true,copyright:$store.state.details.item.copyright}">
			<div class="text_content">
				<p :class="{active:swi && slideup}" :id="$store.state.details.item._id+'lz'">{{$store.state.details.item.content}}</p>
				<a href="javascript:;" v-if="slideup" @click="f_slideup">{{swi?'展开':'收起'}}</a>
			</div>
			<div v-if="$store.state.details.item.photos">
				<img v-for="(photo_item,photo_index) in $store.state.details.item.photos" :src="photo_item.thumbnail" @click.stop="$store.state.see_img($store.state,$event.target.dataset.index,$store.state.details.item.photos)" :data-index="photo_index" class="toBigger">
			</div>
		</div>
		<div class="result">
			<div class="result_in">
				<div>
					<img src="../../../assets/i_like_selected copy.png" v-if="like_inform.length>=1">
					<div class="like_users_name">
						<span v-for="like_user in like_inform" :class="{l_user:true,me_like:like_user.me,me_pi_like:like_user.is_me}" @click="f_check_personal(like_user)">{{like_user.name}}</span>
					</div>
				</div>
				<div class="comment_list">
					<div v-for="(comments,comment_index) in comments">
						<div class="comment_content">
							<img :src="comments.user.headimg" @click="f_check_personal(comments.user)">
							<div>
								<span class="b" v-if="comments.b==1">本人说</span>
								<span :class="{active:comments.user.me,na:true}" @click.stop="f_check_personal(comments.user)">{{comments.user.name}}：</span>
								<span>{{comments.replyuser?'回复'+comments.replyuser.name+'：':''}}{{comments.content}}</span>
								<p class="comment_click">
									<span>{{$store.state.cheTime(comments.time.create)}}</span>
									<span @click.stop="f_replyuser($event)" :data-userid="comments.user._id" :data-username="comments.user.name" :data-userno="comments.user.no"></span>
									<span v-if="comments.user.me" @click.stop="f_delete($event)" class="de">
										<span>
											<span class="de_sure" @click="de_comment($event)" :data-deid="comments._id" :data-index="comment_index">确定</span>
											<span class="de_default">取消</span>
										</span>
									</span>
								</p>
							</div>
						</div>
					</div>
					<div class="comments_more" v-if="comments_pagemore" @click="f_comments_more">后面还有{{$store.state.details.item.stat.comment-(comments_page-1)*20}}条评论，点击查看</div>
				</div>
				<div @click.stop>
					<ul :class="{active:this.pi_show}" id="feed_pi">
						<li v-for="feed_item in feed_items">
							<img :src="feed_item.user.headimg" @click="f_check_pi($event)" :data-no="feed_item.user.no" :data-id="feed_item.user._id">
						</li>
						<li id="add_pi" @click="f_add_pi">+</li>
					</ul>
					<div class="me_comment">
						<img :src="play_user.headimg" :class="{comment_active:head_img_show}" @click="f_change_pi">
						<div contentEditable="true" :class="{comment_active:head_img_show}" @focus.stop="comment_focus" @input="watch_val($event)" :id="$store.state.details.item._id" @click.stop="" @keyup="for_ie_key($event)">
						</div>
					</div>
					<div :class="{comment_commit:true,active:head_img_show}">
						<input type="button" value="评论" v-if="dis" disabled="disabled">
						<input type="button" value="评论" v-else class="me_comment active" @click="f_commit_reply">
						<div>
							<input type="checkbox" class="me_comment" @click="f_me_say($event)">
							<span class="me_comment">本人说</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	</div>
</template>
<script>
	import seeimg from "./../../page_func/seeimg"
	import selectPi from "./../../page_func/select_pi"
	export default ({
		components: {
			seeimg,
			selectPi
		},
		data() {
			return {
				addl: 0,
				head_img_show: false,
				dis: true,
				me_co_con: '',
				myself_say: 0,
				replyuserid: '',
				replyusername: '',
				replyuserno:'',
				comments_page: 2,
				comments: this.$store.state.details.comments,
				slideup: false,
				swi: true,
				con_height: 0,
				feed_items: false,
				pi_show: false,
				comments_pagemore: this.$store.state.details.comments_pagemore,
				like_inform: this.$store.state.details.like_inform,
				me_inform: false,
				my_pi_like: false,
				play_user: this.$store.state.details.play_user,
				is_piIn: false,
				is_piOut: false,
				is_pi_show: false,
				large_img: [],
				i: 0,
				isIn: false,
				isOut: false,
				isShow: false,
				photos: [],
			}
		},
		mounted: function() {
			for (var j = 0; j < this.like_inform.length; j++) {
				if (this.like_inform[j]._id == this.play_user._id) {
					this.my_pi_like = true;
					this.like_inform[j].is_me=true;
					break;
				}
			}
			var con = document.getElementById(this.$store.state.details.item._id + 'lz');
			this.con_height = parseInt(window.getComputedStyle(con, null)['height']);
			if (this.con_height > 132) {
				this.slideup = true;
			}
			var v = this;
			document.onclick = function() {
				v.pi_show = false;
				v.dis = true;
				v.head_img_show = false;
				var del = document.querySelectorAll('.de');
				for (let i = 0; i < del.length; i++) {
					del[i].children[0].className = '';
				}
				var del_ti = document.querySelectorAll('.de_my_title');
				for (let i = 0; i < del_ti.length; i++) {
					del_ti[i].children[1].className = '';
				}
				var val = document.querySelectorAll('.me_comment div');
				for (let i = 0; i < val.length; i++) {
					val[i].innerHTML = '';
				}
			};
			//弹窗滑动，背景不动
			var ele = document.querySelector(".pi_chu");
			this.$store.state.no_scroll(ele);
		},
		methods: {
			f_check_personal: function(user) {
				this.$store.state.current_user_pe = user;
				this.$router.push('/Main_page/Personal');
			},
			f_hide_pi: function(event) {
				this.pi_show = false;
				this.is_piIn = false;
				this.is_piOut = true;
				var vm = this;
				setTimeout(function() {
					vm.is_pi_show = false;
				}, 500)
			},
			level_color: function(level) {
				if (this.$store.state.users) {
					if (level < 4)
						return "background:#7de0bf"
					else if (level < 10)
						return "background:#55cde7"
					else if (level < 16)
						return "background:#ffa559"
					else
						return "background:#f6c302"
				}

			},
			f_add_pi: function() {
				this.is_pi_show = true;
				this.is_piOut = false;
				this.is_piIn = true;
			},
			f_change_pi: function() {
				_czc.push(["_trackEvent", "帖子详情", "帖子下切皮"]);
				TDAPP.onEvent("帖子详情", "帖子下切皮");
				if (this.feed_items) {
					this.pi_show = true;
				} else {
					this.$http({
						method: 'get',
						url: 'http://test.mrpyq.com/api/feed/plays_by_feed',
						params: {
							'access_token': localStorage.getItem('access_token'),
							'id': this.$store.state.details.item._id,
						},
						emulateJSON: true,
					}).then((res) => {
						if (res.body.error) {
							this.$store.state.f_error(this.$store.state, res.body.error);
						} else {
							this.feed_items = res.body;
							this.pi_show = true;
						}
					}, (res) => {
						this.$store.state.f_error(this.$store.state, "服务器正在开小差。。。");
					})
				}
			},
			f_check_pi: function(event) {
				var no = event.target.dataset.no;
				var userid = event.target.dataset.id;
				this.$http({
					method: 'get',
					url: 'http://test.mrpyq.com/api/feed/change_default_play',
					params: {
						'access_token': localStorage.getItem('access_token'),
						'userid': userid,
						'id': this.$store.state.details.item._id,
						'no': no,
					},
					emulateJSON: true,
				}).then((res) => {
					if (res.body.play) {
						this.play_user = res.body.play.user;
						for (var j = 0; j < this.like_inform.length; j++) {
							this.like_inform[j].is_me = this.like_inform[j]._id == this.play_user._id;
							if (this.like_inform[j].is_me) {
								this.my_pi_like = true;
								break;
							} else {
								this.my_pi_like = false;
							}
						}
						this.pi_show = false;
					} else if (res.body.error) {
						this.$store.state.f_error(this.$store.state, res.body.error);
					}
				}, (res) => {
					this.$store.state.f_error(this.$store.state, "服务器正在开小差。。。");
				})
			},
			change_like: function(event){
				var con = document.getElementById(this.$store.state.details.item._id + 'lz');
				this.con_height = parseInt(window.getComputedStyle(con, null)['height']);
				let _this = event.target,
					_id = _this.dataset.id;
				this.$http({
					method: 'get',
					url: 'http://test.mrpyq.com/api/feed/like',
					params: {
						'access_token': localStorage.getItem('access_token'),
						'userid': this.play_user._id,
						'id': _id,
						'no': this.play_user.no,
					},
					emulateJSON: true,
				}).then((res) => {
					if (res.body.result == 1) {
						_czc.push(["_trackEvent", "帖子详情", "点赞"]);
						TDAPP.onEvent("帖子详情", "点赞");
						//this.addl++;
						var m = this.play_user;
						m.is_me = true;
						this.like_inform.unshift(m);
						console.log(this.like_inform)
					} else if (res.body.result == -1) {
						_czc.push(["_trackEvent", "帖子详情", "取消点赞"]);
						TDAPP.onEvent("帖子详情", "取消点赞");
						this.my_pi_like = false;
						for (var i = 0; i < this.like_inform.length; i++) {
							console.log(this.like_inform[i].is_me)
							if (this.like_inform[i].is_me) {
								this.like_inform.splice(i, 1);
								console.log(i)
							}
						}
						//this.addl--;
					} else if (res.body.error) {
						this.$store.state.f_error(this.$store.state, res.body.error);
					}
					for (var j = 0; j < this.like_inform.length; j++) {
						this.like_inform[j].is_me = this.like_inform[j]._id == this.play_user._id;
						if (this.like_inform[j].is_me) {
							this.my_pi_like = true;
							break;
						} else {
							this.my_pi_like = false;
						}
					}
				}, (res) => {
					this.$store.state.f_error(this.$store.state, "服务器正在开小差。。。");
				})
			},
			for_ie_key: function(event) {
				var o = event.keyCode || event.which;
				if (o == 8 || 46 || 17) {
					this.watch_val(event);
				}
			},
			comment_focus: function() {
				this.head_img_show = true;
			},
			watch_val: function(event) {
				var ob = event.target;
				var co_val = ob.innerText;
				this.dis = co_val ? false : true;
				if (ob.childNodes.length >= 2 && ob.childNodes[1].nodeType==1) {
					if (ob.childNodes[1].tagName.match(/^button$/i)) {
						ob.removeChild(ob.firstChild);
					}
				}
				if(ob.childNodes.length>=1 && ob.firstChild.nodeType==1){
					if (!ob.firstChild.tagName.match(/^button$/i)) {
						this.replyuserid = '';
						this.replyusername='';
					}
				}else if(ob.childNodes.length>=1 && ob.firstChild.nodeType!=1){
						this.replyuserid = '';
						this.replyusername='';
				}
				var reg = new RegExp("^<button.{0,}<\/button>$", 'i'),
					reg01 = new RegExp("^<button.{0,}<\/button><br>$", 'i');
				if (reg.exec(ob.innerHTML) || reg01.exec(ob.innerHTML)) {
					this.replyuserid = '';
					ob.innerHTML = '';
				}
				if (this.replyusername) {
					var l = this.replyusername.length + 4;
					this.me_co_con = co_val.substr(l, );
				} else {
					this.me_co_con = co_val;
				}
			},
			f_me_say: function(event) {
				var me_say = event.target;
				if (me_say.checked) {
					this.myself_say = 1;
				} else {
					this.myself_say = 0;
				}
			},
			f_replyuser: function(event) {
				this.dis = true;
				this.replyuserid = event.target.dataset.userid;
				this.replyusername = event.target.dataset.username;
				this.replyuserno = event.target.dataset.userno;
				this.comment_focus();
				var com = document.getElementById(this.$store.state.details.item._id);
				var html = "<button onclick='return false;' contenteditable='false' class='me_comment' disabled='disabled'>回复" + this.replyusername + "：</button>&nbsp";
				com.innerHTML = html;
				this.po_Last_Div(com);
			},
			po_Last_Div: function(obj) {
				//输入框获得焦点
				if (window.getSelection) {
					obj.focus();
					var range = window.getSelection();
					range.selectAllChildren(obj);
					range.collapseToEnd();
				} else if (document.selection) {
					var range = document.selection.createRange();
					range.moveToElementText(obj);
					range.collapse(false);
					range.select();
				}
			},
			f_sure_add: function(index) {
				this.$http({
					method: 'get',
					url: 'http://test.mrpyq.com/api/feed/add_play',
					params: {
						'access_token': localStorage.getItem('access_token'),
						'id': this.$store.state.details.item._id,
						'userid': this.$store.state.users[index]._id,
						'no': this.$store.state.users[index].no,
					},
					emulateJSON: true,
				}).then((res) => {
					if (res.body.play) {
						if (res.body.play.default) {
							this.play_user = res.body.play.user;
							for (var j = 0; j < this.like_inform.length; j++) {
								this.like_inform[j].is_me = this.like_inform[j]._id == this.play_user._id;
								if (this.like_inform[j].is_me) {
									this.my_pi_like = true;
									break;
								} else {
									this.my_pi_like = false;
								}
							}
						}
						this.pi_show = false;
						this.is_piIn = false;
						this.is_piOut = true;
						var vm = this;
						setTimeout(function() {
							vm.is_pi_show = false;
						}, 500)
					} else if (res.body.error) {
						this.$store.state.f_error(this.$store.state, res.body.error);
					};
				}, (res) => {
					this.$store.state.f_error(this.$store.state, "服务器正在开小差。。。");
				})
			},
			f_commit_reply: function() {
				this.$http({
					method: 'post',
					url: 'http://test.mrpyq.com/api/feed/comment',
					body: {
						'access_token': localStorage.getItem('access_token'),
						'userid': this.play_user._id,
						'id': this.$store.state.details.item._id,
						'content': this.me_co_con,
						'b': this.myself_say,
						'replyuserid': this.replyuserid,
						'replyuserno': this.replyuserid?this.replyuserno:'',
						// 1) access_token
						// 2) userid  
						// 3) id    //帖子id   feed下的
						// 4) content  帖子内容，文本   
						// 5) b
					},
					emulateJSON: true,
				}).then((res) => {
					if (res.body.result == 1) {
						if (this.myself_say) {
							_czc.push(["_trackEvent", "帖子详情", "回复-本人说"]);
							TDAPP.onEvent("帖子详情", "回复-本人说");
						}
						_czc.push(["_trackEvent", "帖子详情", "回复"]);
						TDAPP.onEvent("帖子详情", "回复");
						this.replyuserid = '';
						this.head_img_show = false;
						this.comments.push({
							'_id': res.body.comment._id,
							'b': this.myself_say,
							'content': this.me_co_con,
							'time': {
								create: new Date().getTime(),
							},
							replyuser: this.replyusername ? {
								'name': this.replyusername
							} : '',
							'user': {
								'_id': this.play_user._id,
								'name': this.play_user.name,
								'headimg': this.play_user.headimg,
								'me': true,
								'no': this.play_user.no,
							}
						})
						this.replyusername = '';
						var val = document.querySelectorAll('.me_comment div');
						for (let i = 0; i < val.length; i++) {
							val[i].innerHTML = '';
						}
					} else if (res.body.error) {
						this.$store.state.f_error(this.$store.state, res.body.error);
					}
				}, (res) => {
					this.$store.state.f_error(this.$store.state, "服务器正在开小差。。。");
				})
			},
			f_slideup: function(event) {
				this.swi = !this.swi;
			},
			f_delete: function(event) {
				var del = document.querySelectorAll('.de');
				for (let i = 0; i < del.length; i++) {
					del[i].children[0].className = '';
				}
				if (event.target.children.length == 1) {
					event.target.children[0].className = 'active';
				}
			},
			f_de_mytitle: function() {
				var del = document.querySelectorAll('.de_my_title');
				for (let i = 0; i < del.length; i++) {
					del[i].children[1].className = '';
				}
				if (event.target.className == "de_my_title") {
					event.target.children[1].className = 'active';
				} else if (event.target.innerHTML == "删除") {
					event.target.nextElementSibling.className = 'active';
				}
			},
			de_comment: function(event) {
				var commentid = event.target.dataset.deid,
					comment_index = event.target.dataset.index;
				this.$http({
					method: 'get',
					url: 'http://test.mrpyq.com/api/feed/delcomment',
					params: {
						'access_token': localStorage.getItem('access_token'),
						'commentid': commentid,
					},
					emulateJSON: true,
				}).then((res) => {
					if (res.body.result == 1) {
						_czc.push(["_trackEvent", "帖子详情", "删除回复"]);
						TDAPP.onEvent("帖子详情", "删除回复");
						this.comments.splice(comment_index, 1);
					} else if (res.body.error) {
						this.$store.state.f_error(this.$store.state, res.body.error);
					}
				}, (res) => {
					this.$store.state.f_error(this.$store.state, "服务器正在开小差。。。");
				})
			},

			f_comments_more: function() {
				var comments = [];
				var n = this.comments_page;
				var i = 1;
				this.comment_beifen = [];
				this.f_get_more_co(i);
			},
			f_get_more_co: function(i) {
				this.$http({
					method: 'get',
					url: 'http://test.mrpyq.com/api/feed/comments_by_feed',
					params: {
						'access_token': localStorage.getItem('access_token'),
						'id': this.$store.state.details.item._id,
						'page': i,
					},
					emulateJSON: true,
				}).then((res) => {
					if (res.body.item) {
						if (i < this.comments_page) {
							this.comment_beifen = this.comment_beifen.concat(res.body.items);
							var s = i + 1;
							this.f_get_more_co(s);
						} else {
							this.comment_beifen = this.comment_beifen.concat(res.body.items);
							this.comments = this.comment_beifen;
							this.comments_page++;
							this.comments_pagemore = res.body.pagemore;
							this.$http({
								method: 'get',
								url: 'http://test.mrpyq.com/api/feed/comments_by_feed',
								params: {
									'access_token': localStorage.getItem('access_token'),
									'id': this.$store.state.details.item._id,
								},
								emulateJSON: true,
							}).then((res) => {
								if (res.body.feed) {
									this.$store.state.details.item.stat = res.body.feed.stat;
								} else if (res.body.error)
									this.$store.state.f_error(this.$store.state, res.body.error);
							}, (res) => {
								this.$store.state.f_error(this.$store.state, "服务器正在开小差。。。");
							})
						}
					} else if (res.body.error)
						this.$store.state.f_error(this.$store.state, res.body.error);
				}, (res) => {
					this.$store.state.f_error(this.$store.state, "服务器正在开小差。。。");
				})
			},
			f_sure_demytitle: function() {
				// http://test.mrpyq.com/api/feed/delete?access_token=58252d066e998f6bfd67f783.1509590666.1b63e9e2c7c73059a51be94e04b8d59c&id=582573146e998f550fc3001b
				this.$http({
					method: 'get',
					url: 'http://test.mrpyq.com/api/feed/delete',
					params: {
						'access_token': localStorage.getItem('access_token'),
						'id': this.$store.state.details.item._id,
					},
					emulateJSON: true,
				}).then((res) => {
					if (res.body.result == 1) {
						_czc.push(["_trackEvent", "帖子详情", "删帖"]);
						TDAPP.onEvent("帖子详情", "删帖");
						var i = {
							item: false,
							comments_pagemore: false,
							like_inform: false,
							me_inform: false,
							my_pi_like: false,
							play_user: false,
							comments: false
						}
						localStorage.setItem('details', JSON.stringify(i));
						this.$router.push('/Main_page/News');
					} else if (res.body.error) {
						this.$store.state.f_error(this.$store.state, res.body.error);
					}
				}, (res) => {
					this.$store.state.f_error(this.$store.state, "服务器正在开小差。。。");
				})
			},
		}
	})

</script>
<style scoped>
	* {
		word-wrap: break-word;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}
	#outer_box {
		width: 660px;
		min-height: 500px;
	}
	
	button {
		border: none;
		background: transparent;
		overflow: visible;
		font-size: 14px;
	}
	
	.user_list:after,
	.user_list>div>div:nth-child(1):after,
	.text_content>p.active:after,
	.content>div:nth-child(2):after,
	.result_in>div:nth-child(1):after {
		display: block;
		clear: both;
		content: "";
		visibility: hidden;
		height: 0
	}
	
	.show_img {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		transition: 0.2s;
		z-index: 999;
	}
	
	.show_img img {
		display: block;
	}
	
	.pi_chu {
		width: 600px;
		height: 490px;
		overflow-x: hidden;
		overflow-y: scroll;
		background: #fff;
		margin: 0 auto;
	}
	
	.pi_chu ul {
		width: 400px;
	}
	
	.pi_chu ul>li {
		height: 70px;
		padding-left: 10px;
		border-bottom: 1px solid #ccc;
		cursor: pointer;
	}
	
	.pi_chu ul>li:hover {
		background: #f2f2f2;
	}
	
	.pi_list li>img {
		float: left;
		margin-top: 7px;
		height: 56px;
		width: 56px;
		border-radius: 50%;
		margin-right: 10px;
	}
	
	.pi_list li>h3 {
		float: left;
		display: table;
		font-size: 16px;
		line-height: 16px;
		margin-top: 15px;
		font-weight: normal;
		color: #000;
	}
	
	.pi_list li>span {
		float: left;
		display: table;
		line-height: 14px;
		height: 14px;
		font-size: 12px;
		padding: 0 3px;
		margin-top: 17px;
		margin-left: 5px;
		background: #ddd;
		border-radius: 3px;
		color: #fff;
	}
	
	.pi_list li>p {
		float: left;
		width: 317px;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		font-size: 14px;
		line-height: 14px;
		height: 14px;
		margin-top: 10px;
	}
	
	.container {
		margin-top: 25vh!important;
		width: 400px!important;
		height: 490px;
		background: #fff;
		margin: 0 auto;
		overflow: hidden;
		border-radius: 5px;
		position: relative;
	}
	
	.show_img>div.igs {
		width: 100vw;
		overflow: auto;
		height: 100vh;
	}
	
	#img_box {
		width: 100vw;
		overflow: auto;
		height: 100vh;
		display: table-cell;
		vertical-align: middle;
	}
	
	#img_box>img {
		margin: 0 auto;
	}
	
	.show_img>div>span:nth-child(2) {
		position: absolute;
		top: 20px;
		right: 20px;
		height: 30px;
		width: 50px;
		display: block;
		font-size: 40px;
		text-align: center;
		line-height: 30px;
		color: #807f7c;
		cursor: pointer;
	}
	
	.show_img>div>span:nth-child(3) {
		position: absolute;
		top: 50%;
		margin-top: -25px;
		right: 20px;
		height: 50px;
		width: 50px;
		display: block;
		cursor: pointer;
		background: url(../../../assets/r_h.png);
	}
	
	.show_img>div>span:nth-child(3):hover {
		background: url(../../../assets/r_b.png);
	}
	
	.show_img>div>span:nth-child(4) {
		position: absolute;
		top: 50%;
		margin-top: -25px;
		left: 20px;
		height: 50px;
		width: 50px;
		display: block;
		cursor: pointer;
		background: url(../../../assets/l_h.png);
	}
	
	.show_img>div>span:nth-child(4):hover {
		background: url(../../../assets/l_b.png);
	}
	
	.show_img:nth-child(2) {
		background: rgba(0, 0, 0, 0.7);
	}
	
	.show_img>div>span:hover {
		color: #fff;
	}
	
	.form_list {
		width: 660px;
	}
	
	.user_list {
		width: 660px;
		background: #fff;
		border-radius: 2px;
		margin-bottom: 20px;
		box-shadow: 1px 1px 6px #666;
		min-height: 100px;
	}
	
	.user_list>div {
		padding: 14px 34px 14px 20px;
	}
	
	.user_list>div>div:nth-child(1) {
		width: 100%;
	}
	
	.toBigger {
		cursor: zoom-in;
	}
	
	.headimg {
		float: left;
		width: 57px;
		height: 57px;
		border-radius: 50%;
		cursor: pointer;
	}
	
	.user_inform {
		float: left;
		margin-left: 23px;
	}
	
	.user_inform>h3 {
		font-weight: normal;
		margin-top: 15px;
		font-size: 16px;
		display: table;
	}
	
	.user_inform>p {
		font-size: 12px;
		color: #aaa8a8;
		display: table;
	}
	
	.i_like {
		margin-top: 18px;
		float: right;
		height: 21px;
	}
	
	.i_like>img {
		float: left;
		margin-top: 2px;
		margin-right: 10px;
		cursor: pointer;
	}
	
	.i_like>span {
		float: left;
		height: 21px;
		line-height: 21px;
	}
	
	.like_users_name {
		float: left;
		width: 585px;
	}
	
	.text_content>p {
		white-space: pre-wrap;
		word-wrap: break-word;
		margin: 14px 0;
		font-size: 16px;
		line-height: 22px;
		transition: all .2s;
	}
	
	.text_content>p.active {
		height: 132px;
		overflow: hidden;
	}
	
	.text_content a {
		color: rgb(72, 153, 237);
	}
	
	.text_content a.active {
		display: block;
	}
	
	.content>div:nth-child(2) {
		width: 100%;
		border-top: 1px solid #eee;
	}
	
	.content>div>img {
		float: left;
		width: 178px;
		height: 178px;
		margin-left: 5px;
		padding: 10px 0;
	}
	
	.result {
		background: #fafafa;
	}
	
	.result img {
		float: left;
	}
	
	.like_users_name span {
		float: left;
		line-height: 17px;
		margin-left: 12px;
		color: #54a1e9;
		cursor: pointer;
	}
	
	.like_users_name span.me_like {
		color: #dd6f5a;
	}
	
	.animated {
		-webkit-animation-duration: 0.5s;
		animation-duration: 0.5s;
		-webkit-animation-fill-mode: both;
		animation-fill-mode: both;
	}
	
	@-webkit-keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	
	.fadeIn {
		-webkit-animation-name: fadeIn;
		animation-name: fadeIn;
	}
	
	@-webkit-keyframes fadeOut {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
	
	@keyframes fadeOut {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
	
	.fadeOut {
		-webkit-animation-name: fadeOut;
		animation-name: fadeOut;
	}
	
	div.me_comment {
		margin-top: 10px;
		position: relative;
	}
	
	.content {
		moz-user-select: -moz-text;
		-moz-user-select: text;
		-o-user-select: text;
		-khtml-user-select: text;
		-webkit-user-select: text;
		-ms-user-select: text;
		user-select: text;
	}
	
	div.copyright {
		moz-user-select: -moz-none;
		-moz-user-select: none;
		-o-user-select: none;
		-khtml-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	.user_list>div:after,
	.comment_commit:after,
	.comment_list>div:after,
	.comment_list .comment_content div:after,
	div.me_comment:after,
	.comment_click:after {
		display: block;
		clear: both;
		content: "";
		visibility: hidden;
		height: 0;
	}
	
	#feed_pi {
		width: 660px;
		position: relative;
		left: -20px;
		border-radius: 2px;
		height: 0;
		transition: 0.4s;
		background: #ddd;
		overflow: hidden;
		padding-left: 38px;
	}
	
	#feed_pi.active {
		padding: 10px 0 10px 38px;
		height: 58px;
		margin: 8px 0;
	}
	
	#feed_pi>li {
		float: left;
		overflow: hidden;
		cursor: pointer;
	}
	
	#feed_pi>li>img {
		display: block;
		width: 38px;
		height: 38px;
		margin-right: 15px;
		border-radius: 50%;
	}
	
	#add_pi {
		font-size: 38px;
		line-height: 38px;
		text-align: center;
		color: #bbb;
		background: #fff;
		width: 38px;
		height: 38px;
		border-radius: 50%;
		margin-right: 15px;
	}
	
	div.me_comment>img {
		cursor: pointer;
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		height: 38px;
		width: 38px;
		border-radius: 50%;
		transition: all 0.5s;
		z-index: -1;
	}
	
	div.me_comment img.comment_active {
		opacity: 1;
		z-index: 1;
	}
	
	div.me_comment .prompt {
		position: absolute;
		top: 0;
		left: ;
	}
	
	div.me_comment>div {
		float: right;
		min-height: 40px;
		width: 606px;
		right: 0;
		top: 0;
		border-radius: 2px;
		border: 1px solid #ccc;
		padding: 9px 10px;
		outline: none;
		line-height: 20px;
		z-index: 9;
		transition: all 0.5s;
	}
	
	div.me_comment div.comment_active {
		width: 543px;
	}
	
	span.de {
		position: relative;
		cursor: pointer;
	}
	
	.de_my_title>div>span {
		float: left;
		color: #fff;
		width: 65px;
		border-radius: 2px;
		padding: 5px 0;
		font-size: 18px;
		text-align: center;
		line-height: 20px;
		margin-left: 45px;
		margin-top: 115px;
		cursor: pointer;
	}
	
	.de_sure {
		float: left;
		height: 30px;
		background: #ffa394;
		color: #fff;
		width: 65px;
		border-radius: 2px;
		padding: 5px 0;
		font-size: 18px;
		text-align: center;
		line-height: 20px;
		margin-left: 45px;
		margin-top: 100px;
		cursor: pointer;
	}
	
	.de_default {
		float: left;
		height: 30px;
		background: #b4b2b2;
		color: #fff;
		width: 65px;
		border-radius: 2px;
		padding: 5px 0;
		font-size: 18px;
		text-align: center;
		line-height: 20px;
		margin-left: 45px;
		margin-top: 100px;
		cursor: pointer;
	}
	
	.comments_more {
		width: 100%;
		height: 40px;
		border-top: 1px dashed #ddd;
		border-bottom: 1px dashed #ddd;
		text-align: center;
		cursor: pointer;
		color: #bbb;
		line-height: 40px;
	}
	
	span.de>span,
	.de_my_title div {
		position: absolute;
		display: block;
		background: url(../../../assets/delete_comment_panel.9a887d8f.png) no-repeat center center;
		background-size: 100%;
		height: 182px;
		width: 264px;
		top: -182px;
		left: 50%;
		margin-left: -134px;
		z-index: 99;
		display: none;
		cursor: default;
	}
	
	.de_my_title div {
		background: url(../../../assets/delete_feed_panel.a21a333.png) no-repeat center center;
		top: auto;
		bottom: -182px!important;
	}
	
	span.de>span.active,
	.de_my_title div.active {
		display: block;
	}
	
	.de_my_title {
		float: right;
		margin-right: 60px;
		margin-top: 18px;
		height: 20px;
		width: 20px;
		background: url(../../../assets/i_delete.fc36f948.png) no-repeat center center;
		cursor: pointer;
		position: relative;
	}
	
	.de_my_title>p {
		position: absolute;
		width: 40px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		z-index: 99;
		right: -40px;
		top: 0;
	}
	
	.de_my_title:hover {
		background: url(../../../assets/i_delete_selected.ef518658.png) no-repeat center center;
	}
	
	.comment_commit {
		margin-top: 10px;
		height: 0;
		overflow: hidden;
		transition: all 0.5s;
		opacity: 0;
	}
	
	.comment_commit.active {
		height: 25px;
		opacity: 1;
	}
	
	.comment_commit>input {
		color: #fff;
		cursor: not-allowed;
		height: 25px;
		width: 50px;
		border-radius: 2px;
		border: none;
		background: #6abdf1;
		float: right;
		opacity: 0.5;
	}
	
	.comment_commit>input.active {
		cursor: pointer;
		opacity: 1;
	}
	
	.comment_commit div {
		height: 25px;
		float: right;
		margin-right: 18px;
		line-height: 25px;
		font-size: 12px;
	}
	
	.comment_commit div>input {
		vertical-align: middle;
	}
	
	.comment_list>div {
		margin-top: 10px;
	}
	
	.comment_list .comment_content {
		float: left;
	}
	
	.comment_list .comment_content img {
		float: left;
		height: 38px;
		width: 38px;
		border-radius: 50%;
		cursor: pointer;
	}
	
	.comment_list .comment_content div {
		padding-left: 10px;
		padding-top: 2px;
		float: left;
		width: 568px;
	}
	
	.comment_list .comment_content div span {
		float: left;
	}
	
	.comment_list .comment_content div>span.b {
		display: inline-block;
		background: #999;
		color: #fff;
		line-height: 12px;
		font-size: 12px;
		padding: 2px 5px;
		margin-top: 2px;
		border-radius: 2px;
		margin-right: 5px;
	}
	
	.comment_list .comment_content div>span.na {
		color: #54a1e9;
		cursor: pointer;
	}
	
	.comment_list .comment_content div>span.na.active {
		color: #dd6f5a;
	}
	
	.comment_click {
		float: left;
		width: 100%;
		margin-top: 10px;
	}
	
	.comment_click>span {
		float: left;
		margin-right: 10px;
	}
	
	.comment_click>span:nth-child(1) {
		font-size: 12px;
		color: #aaa8a8;
		line-height: 20px;
	}
	
	.comment_click>span:nth-child(2) {
		height: 20px;
		width: 20px;
		background: url(../../../assets/i_comment.795b275e.png) no-repeat center center;
		cursor: pointer;
	}
	
	.comment_click>span:nth-child(2):hover {
		background: url(../../../assets/i_comment_selected.11a93ec6.png) no-repeat center center;
	}
	
	.comment_click>span:nth-child(3) {
		height: 20px;
		width: 20px;
		background: url(../../../assets/i_delete.fc36f948.png) no-repeat center center;
	}
	
	.comment_click>span:nth-child(3):hover {
		background: url(../../../assets/i_delete_selected.ef518658.png) no-repeat center center;
	}

</style>
