<template>
	<div class="user_list">
		<div>
			<img :src="this.$store.state.home_items[itemindex].user.headimg" @click="f_check_personal($store.state.home_items[itemindex].user)" class="headimg"/>
			<div class="user_inform">
				<h3>{{this.$store.state.home_items[itemindex].user.name}}</h3>
				<p>{{$store.state.cheTime(this.$store.state.home_items[itemindex].time.create)}}</p>
			</div>
			<div class="i_like">
				<img src="../../../assets/i_like_selected.png" v-if="this.$store.state.home_datas[itemindex].my_pi_like" data-like="true" :data-id="this.$store.state.home_items[itemindex]._id" @click="change_like($event)">
				<img src="../../../assets/i_like_32b7cd5a.png" v-else data-like="false" :data-id="this.$store.state.home_items[itemindex]._id" @click="change_like($event)">
				<span>赞</span>
			</div>
			<div v-if="this.$store.state.home_items[itemindex].user.me" class="de_my_title" @click.stop="f_de_mytitle($event)">
				<p>删除</p>
				<div>
					<span class="de_sure" @click="f_sure_demytitle">确定</span>
					<span class="de_default">取消</span>
				</div>
			</div>
		</div>
		<div :class="{content:true,copyright:this.$store.state.home_items[itemindex].copyright}">
			<div class="text_content">
				<p :class="{active:$store.state.home_datas[itemindex].swi && $store.state.home_datas[itemindex].slideup}" :id="this.$store.state.home_items[itemindex]._id+'lz'">{{this.$store.state.home_items[itemindex].content}}</p>
				<a href="javascript:;" v-if="$store.state.home_datas[itemindex].slideup" @click="f_slideup">{{$store.state.home_datas[itemindex].swi?'展开':'收起'}}</a>
			</div>
			<div v-if="this.$store.state.home_items[itemindex].photos">
				<img v-for="(photo_item,photo_index) in this.$store.state.home_items[itemindex].photos" :src="photo_item.thumbnail" @click.stop="$store.state.plugin.see_img($store.state.plugin,$event.target.dataset.index,$store.state.home_items[itemindex].photos)" :data-index="photo_index" class="toBigger">
			</div>
		</div>
		<div class="result">
			<div class="result_in">
				<div>
					<img src="../../../assets/i_like_selected copy.png" v-if="$store.state.home_datas[itemindex].like_inform.length>=1">
					<div class="like_users_name">
						<span v-for="like_user in $store.state.home_datas[itemindex].like_inform" :class="{l_user:true,me_like:like_user.me,me_pi_like:like_user.is_me}" @click="f_check_personal(like_user)">{{like_user.name}}</span>
					</div>
				</div>
				<div class="comment_list">
					<div v-for="(comments,comment_index) in $store.state.home_datas[itemindex].comments">
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
					<div class="comments_more" v-if="$store.state.home_datas[itemindex].comments_pagemore" @click="f_comments_more">后面还有{{this.$store.state.home_items[itemindex].stat.comment-($store.state.home_datas[itemindex].comments_page-1)*20}}条评论，点击查看</div>
				</div>
				<div @click.stop>
					<ul :class="{active:$store.state.home_datas[this.itemindex].pi_show}" id="feed_pi">
						<li v-for="feed_item in $store.state.home_datas[this.itemindex].feed_items">
							<img :src="feed_item.user.headimg" @click="f_check_pi($event)" :data-no="feed_item.user.no" :data-id="feed_item.user._id">
						</li>
						<li id="add_pi" @click="$store.state.plugin.f_add_pi($store.state.plugin,itemindex)">+</li>
					</ul>
					<div class="me_comment">
						<img :src="$store.state.home_datas[itemindex].play_user.headimg" :class="{comment_active:$store.state.home_datas[itemindex].head_img_show}" @click="f_change_pi">
						<div contentEditable="true" :class="{comment_active:$store.state.home_datas[itemindex].head_img_show}" @focus.stop="comment_focus" @input="watch_val($event)" :id="this.$store.state.home_items[itemindex]._id" @click.stop="" @keyup="for_ie_key($event)">
						</div>
					</div>
					<div :class="{comment_commit:true,active:$store.state.home_datas[itemindex].head_img_show}">
						<input type="button" value="评论" v-if="$store.state.home_datas[itemindex].dis" disabled="disabled">
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
</template>
<script>
	export default ({
		props: ['item', 'itemindex'],
		data() {
			return {}
		},
		mounted: function() {
			//判断帖子的内容是否超过限高
			//window.document.oncontextmenu = function(){ return false; };
			var con = document.getElementById(this.$store.state.home_items[this.itemindex]._id + 'lz');
			this.$store.state.home_datas[this.itemindex].con_height = parseInt(window.getComputedStyle(con, null)['height']);
			if (this.$store.state.home_datas[this.itemindex].con_height > 132) {
				this.$store.state.home_datas[this.itemindex].slideup = true;
			}
		},
		updated: function() {
			//针对自己刚发的帖子进行判断
			if (this.$store.state.home_datas[0]) {
				var con = document.getElementsByClassName('text_content')[0];
				console.log(this.$store.state.home_datas[0].con_height);
				if (this.$store.state.home_datas[0].con_height == 0) {
					this.$store.state.home_datas[0].con_height = parseInt(window.getComputedStyle(con.children[0], null)['height']);
					if (this.$store.state.home_datas[0].con_height > 132) {
						this.$store.state.home_datas[0].slideup = true;
					};
				}
			}
		},
		methods: {
			//更改当前皮（自己的皮或者别人的皮），进入个人中心查看皮信息
			f_check_personal: function(user) {
				this.$store.state.current_user_pe = user;
				this.$router.push('/Main_page/Personal');
			},
			//查询帖子下所有皮
			f_change_pi: function() {
				_czc.push(["_trackEvent", "专区首页", "帖子下切皮"]);
				TDAPP.onEvent("专区首页", "帖子下切皮");
				//查看帖子下扮演角色列表
				if (this.$store.state.home_datas[this.itemindex].feed_items) {
					this.$store.state.home_datas[this.itemindex].pi_show = true;
				} else {
					this.$http({
						method: 'get',
						url: this.$store.state.domain + 'feed/plays_by_feed',
						params: {
							'access_token': localStorage.getItem('access_token'),
							'id': this.$store.state.home_items[this.itemindex]._id,
						},
						emulateJSON: true,
					}).then((res) => {
						if (res.body.error) {
							this.$store.state.plugin.f_error(this.$store.state, res.body.error);
						} else {
							this.$store.state.home_datas[this.itemindex].feed_items = res.body;
							this.$store.state.home_datas[this.itemindex].pi_show = true;
						}
					}, (res) => {
						this.$store.state.plugin.f_error(this.$store.state, "服务器正在开小差。。。");
					})
				}
			},
			//切换帖子下默认皮
			f_check_pi: function(event) {
				var no = event.target.dataset.no;
				var userid = event.target.dataset.id;
				this.$http({
					method: 'get',
					url: this.$store.state.domain + 'feed/change_default_play',
					params: {
						'access_token': localStorage.getItem('access_token'),
						'userid': userid,
						'id': this.$store.state.home_items[this.itemindex]._id,
						'no': no,
					},
					emulateJSON: true,
				}).then((res) => {
					if (res.body.play) {
						this.$store.state.home_datas[this.itemindex].play_user = res.body.play.user;
						for (var j = 0; j < this.$store.state.home_datas[this.itemindex].like_inform.length; j++) {
							this.$store.state.home_datas[this.itemindex].like_inform[j].is_me = this.$store.state.home_datas[this.itemindex].like_inform[j]._id == this.$store.state.home_datas[this.itemindex].play_user._id;
							if (this.$store.state.home_datas[this.itemindex].like_inform[j].is_me) {
								this.$store.state.home_datas[this.itemindex].my_pi_like = true;
								break;
							} else {
								this.$store.state.home_datas[this.itemindex].my_pi_like = false;
							}
						}
						this.$store.state.home_datas[this.itemindex].pi_show = false;
					} else if (res.body.error) {
						this.$store.state.plugin.f_error(this.$store.state, res.body.error);
					}
				}, (res) => {
					this.$store.state.plugin.f_error(this.$store.state, "服务器正在开小差。。。");
				})
			},
			//点赞
			change_like: function(event) {
				var con = document.getElementById(this.$store.state.home_items[this.itemindex]._id + 'lz');
				this.$store.state.home_datas[this.itemindex].con_height = parseInt(window.getComputedStyle(con, null)['height']);
				let _this = event.target,
					_id = _this.dataset.id;
				this.$http({
					method: 'get',
					url: this.$store.state.domain + 'feed/like',
					params: {
						'access_token': localStorage.getItem('access_token'),
						'userid': this.$store.state.home_datas[this.itemindex].play_user._id,
						'id': _id,
						'no': this.$store.state.home_datas[this.itemindex].play_user.no,
					},
					emulateJSON: true,
				}).then((res) => {
					if (res.body.result == 1) {
						//点赞
						_czc.push(["_trackEvent", "专区首页", "点赞"]);
						TDAPP.onEvent("专区首页", "取消点赞");
						//this.$store.state.home_datas[this.itemindex].addl++;
						var m = this.$store.state.home_datas[this.itemindex].play_user;
						//????
						m.is_me = true;
						this.$store.state.home_datas[this.itemindex].like_inform.unshift(m);
					} else if (res.body.result == -1) {
						//取消点赞
						_czc.push(["_trackEvent", "专区首页", "取消点赞"]);
						TDAPP.onEvent("专区首页", "取消点赞");
						this.$store.state.home_datas[this.itemindex].my_pi_like = false;
						for (var i = 0; i < this.$store.state.home_datas[this.itemindex].like_inform.length; i++) {
							if (this.$store.state.home_datas[this.itemindex].like_inform[i].is_me) {
								this.$store.state.home_datas[this.itemindex].like_inform.splice(i, 1);
							}
						}
						//this.$store.state.home_datas[this.itemindex].addl--;
					} else if (res.body.error) {
						this.$store.state.plugin.f_error(this.$store.state, res.body.error);
					}
					for (var j = 0; j < this.$store.state.home_datas[this.itemindex].like_inform.length; j++) {
						this.$store.state.home_datas[this.itemindex].like_inform[j].is_me = this.$store.state.home_datas[this.itemindex].like_inform[j]._id == this.$store.state.home_datas[this.itemindex].play_user._id;
						if (this.$store.state.home_datas[this.itemindex].like_inform[j].is_me) {
							this.$store.state.home_datas[this.itemindex].my_pi_like = true;
							break;
						} else {
							this.$store.state.home_datas[this.itemindex].my_pi_like = false;
						}
					}
				}, (res) => {
					this.$store.state.plugin.f_error(this.$store.state, "服务器正在开小差。。。");
				})
			},
			for_ie_key: function(event) {
				var o = event.keyCode || event.which;
				if (o == 8 || 46 || 17) {
					this.watch_val(event);
				}
			},
			comment_focus: function() {
				this.$store.state.home_datas[this.itemindex].head_img_show = true;
			},
			//????
			watch_val: function(event) {
				var ob = event.target;
				var co_val = ob.innerText;
				this.$store.state.home_datas[this.itemindex].dis = co_val ? false : true;
				if (ob.childNodes.length >= 2) {
					if (ob.firstChild.nodeType == 3) {
						ob.removeChild(ob.firstChild);
					}
				} else {
					this.$store.state.home_datas[this.itemindex].replyusername = "";
				}
				var reg = new RegExp("^<button.{0,}<\/button>$", 'i'),
					reg01 = new RegExp("^<button.{0,}<\/button><br>$", 'i');
				if (reg.exec(ob.innerHTML) || reg01.exec(ob.innerHTML)) {
					this.$store.state.home_datas[this.itemindex].replyuserid = '';
					ob.innerHTML = '';
				}
				if (this.$store.state.home_datas[this.itemindex].replyusername) {
					var l = this.$store.state.home_datas[this.itemindex].replyusername.length + 4;
					this.$store.state.home_datas[this.itemindex].me_co_con = co_val.substr(l, );
				} else {
					this.$store.state.home_datas[this.itemindex].me_co_con = co_val;
				}
				console.log(this.$store.state.home_datas[this.itemindex].me_co_con)
			},
			//本人说
			f_me_say: function(event) {
				var me_say = event.target;
				if (me_say.checked) {
					this.$store.state.home_datas[this.itemindex].myself_say = 1;
				} else {
					this.$store.state.home_datas[this.itemindex].myself_say = 0;
				}
			},
			//回复评论
			f_replyuser: function(event) {
				this.$store.state.home_datas[this.itemindex].dis = true;
				this.$store.state.home_datas[this.itemindex].replyuserid = event.target.dataset.userid;
				this.$store.state.home_datas[this.itemindex].replyusername = event.target.dataset.username;
				this.$store.state.home_datas[this.itemindex].replyuserno = event.target.dataset.userno;
				console.log(this.$store.state.home_datas[this.itemindex], this.itemindex)
				this.comment_focus();
				var com = document.getElementById(this.$store.state.home_items[this.itemindex]._id);
				var html = "<button onclick='return false;' contenteditable='false' class='me_comment' disabled='disabled'>回复" + this.$store.state.home_datas[this.itemindex].replyusername + "：</button>&nbsp";
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
			f_commit_reply: function() {
				this.$http({
					method: 'post',
					url: this.$store.state.domain + 'feed/comment',
					body: {
						'access_token': localStorage.getItem('access_token'),
						'userid': this.$store.state.home_datas[this.itemindex].play_user._id,
						'id': this.$store.state.home_items[this.itemindex]._id,
						'content': this.$store.state.home_datas[this.itemindex].me_co_con,
						'b': this.$store.state.home_datas[this.itemindex].myself_say,
						'replyuserid': this.$store.state.home_datas[this.itemindex].replyuserid,
						'replyuserno': this.$store.state.home_datas[this.itemindex].replyuserid ? this.$store.state.home_datas[this.itemindex].replyuserno : ''
						// 1) access_token
						// 2) userid  
						// 3) id    //帖子id   feed下的
						// 4) content  帖子内容，文本   
						// 5) b
					},
					emulateJSON: true,
				}).then((res) => {
					if (res.body.result == 1) {
						if (this.$store.state.home_datas[this.itemindex].myself_say) {
							_czc.push(["_trackEvent", "专区首页", "回复-本人说"]);
							TDAPP.onEvent("专区首页", "回复-本人说");
						}
						_czc.push(["_trackEvent", "专区首页", "回复"]);
						TDAPP.onEvent("专区首页", "回复");
						this.$store.state.home_datas[this.itemindex].replyuserid = '';
						this.$store.state.home_datas[this.itemindex].head_img_show = false;
						this.$store.state.home_datas[this.itemindex].comments.push({
							'_id': res.body.comment._id,
							'b': this.$store.state.home_datas[this.itemindex].myself_say,
							'content': this.$store.state.home_datas[this.itemindex].me_co_con,
							'time': {
								create: new Date().getTime(),
							},
							replyuser: this.$store.state.home_datas[this.itemindex].replyusername ? {
								'name': this.$store.state.home_datas[this.itemindex].replyusername
							} : '',
							'user': {
								'_id': this.$store.state.home_datas[this.itemindex].play_user._id,
								'name': this.$store.state.home_datas[this.itemindex].play_user.name,
								'headimg': this.$store.state.home_datas[this.itemindex].play_user.headimg,
								'me': true,
								'no': this.$store.state.home_datas[this.itemindex].play_user.no,
							}
						})
						this.$store.state.home_datas[this.itemindex].replyusername = '';
						var val = document.querySelectorAll('.me_comment div');
						for (let i = 0; i < val.length; i++) {
							val[i].innerHTML = '';
						}
					} else if (res.body.error) {
						this.$store.state.plugin.f_error(this.$store.state, res.body.error);
					}
				}, (res) => {
					this.$store.state.plugin.f_error(this.$store.state, "服务器正在开小差。。。");
				})
			},
			//????
			f_slideup: function(event) {
				this.$store.state.home_datas[this.itemindex].swi = !this.$store.state.home_datas[this.itemindex].swi;
				var con = document.getElementsByClassName('text_content')[this.itemindex].children[0];
				if (this.$store.state.home_datas[this.itemindex].swi) {
					// 	con.style.height='132px';
				} else {
					// 	con.style.height=this.$store.state.home_datas[this.itemindex].con_height+'px';
				}
			},
			//点击删除图标弹出提示框
			f_delete: function(event) {
				var del = document.querySelectorAll('.de');
				for (let i = 0; i < del.length; i++) {
					del[i].children[0].className = '';
				}
				if (event.target.children.length == 1) {
					event.target.children[0].className = 'active';
				}
			},
			//删除自己的帖子
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
			//删除评论
			de_comment: function(event) {
				var commentid = event.target.dataset.deid,
					comment_index = event.target.dataset.index;
				this.$http({
					method: 'get',
					url: this.$store.state.domain + 'feed/delcomment',
					params: {
						'access_token': localStorage.getItem('access_token'),
						'commentid': commentid,
					},
					emulateJSON: true,
				}).then((res) => {
					if (res.body.result == 1) {
						_czc.push(["_trackEvent", "专区首页", "删除回复"]);
						TDAPP.onEvent("专区首页", "删除回复");
						this.$store.state.home_datas[this.itemindex].comments.splice(comment_index, 1);
					} else if (res.body.error) {
						this.$store.state.plugin.f_error(this.$store.state, res.body.error);
					}
				}, (res) => {
					this.$store.state.plugin.f_error(this.$store.state, "服务器正在开小差。。。");
				})
			},
			//更多评论
			f_comments_more: function() {
				var i = 1;
				this.$store.state.home_datas[this.itemindex].comment_beifen = [];
				this.f_get_more_co(i);
			},
			//获取更多评论
			f_get_more_co: function(i) {
				this.$http({
					method: 'get',
					url: this.$store.state.domain + 'feed/comments_by_feed',
					params: {
						'access_token': localStorage.getItem('access_token'),
						'id': this.$store.state.home_items[this.itemindex]._id,
						'page': i,
					},
					emulateJSON: true,
				}).then((res) => {
					//????
					if (i < this.$store.state.home_datas[this.itemindex].comments_page) {
						this.$store.state.home_datas[this.itemindex].comment_beifen = this.$store.state.home_datas[this.itemindex].comment_beifen.concat(res.body.items);
						var s = i + 1;
						this.f_get_more_co(s);
					} else {
						this.$store.state.home_datas[this.itemindex].comment_beifen = this.$store.state.home_datas[this.itemindex].comment_beifen.concat(res.body.items);
						this.$store.state.home_datas[this.itemindex].comments = this.$store.state.home_datas[this.itemindex].comment_beifen;
						this.$store.state.home_datas[this.itemindex].comments_page++;
						this.$store.state.home_datas[this.itemindex].comments_pagemore = res.body.pagemore;
						this.$http({
							method: 'get',
							url: this.$store.state.domain + 'feed/comments_by_feed',
							params: {
								'access_token': localStorage.getItem('access_token'),
								'id': this.$store.state.home_items[this.itemindex]._id,
							},
							emulateJSON: true,
						}).then((res) => {
							this.$store.state.home_items[this.itemindex].stat = res.body.feed.stat;
						}, (res) => {
							this.$store.state.plugin.f_error(this.$store.state, "服务器正在开小差。。。");
						})
					}
				}, (res) => {
					this.$store.state.plugin.f_error(this.$store.state, "服务器正在开小差。。。");
				})
			},
			//删帖
			f_sure_demytitle: function() {
				this.$http({
					method: 'get',
					url: this.$store.state.domain + 'feed/delete',
					params: {
						'access_token': localStorage.getItem('access_token'),
						'id': this.$store.state.home_items[this.itemindex]._id,
					},
					emulateJSON: true,
				}).then((res) => {
					if (res.body.result == 1) {
						_czc.push(["_trackEvent", "专区首页", "删帖"]);
						TDAPP.onEvent("专区首页", "删帖");
						this.$store.state.home_items.splice(this.itemindex, 1);
						this.$store.state.home_datas.splice(this.itemindex, 1);
						//this.$store.state.add_number--;
					} else if (res.body.error) {
						this.$store.state.plugin.f_error(this.$store.state, res.body.error);
					}
				}, (res) => {
					this.$store.state.plugin.f_error(this.$store.state, "服务器正在开小差。。。");
				})
			},
		},
		watch: {}
	})

</script>
<style scoped>
	* {
		word-break: break-all;
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
		background: url(../../../assets/delete_feed_panel.a21a3336.png) no-repeat center center;
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
