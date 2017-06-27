<template>
  <div class="news_list">
    <div v-if="item.type==0">
      <div>
        <div class="head_img">
          <img :src="item.headimg" @click="f_check_personal(item.user)">
        </div>
        <div class="n_con">
          <div class="u_name">{{item.title}}</div>
          <div class="u_con">{{item.content}}</div>
          <div :class="{pyq:true,copyright:!item.feed.copyright}" @click="f_details"><span>{{item.feed.user.name}}的朋友圈：</span>{{item.feed.content}}</div>
          <div class="time">{{$store.state.cheTime(item.time.create)}}</div>
        </div>
      </div>
      <div class="input_reply" @click.stop>
        <ul :class="{active:this.$store.state.news_datas[itemindex].pi_show}" id="feed_pi">
          <li v-for="feed_item in this.feed_items">
            <img :src="feed_item.user.headimg" @click="f_check_pi($event)" :data-no="feed_item.user.no" :data-id="feed_item.user._id">
          </li>
          <li id="add_pi" @click="$store.state.plugin.f_add_pi($store.state.plugin,itemindex)">+</li>
        </ul>
        <div class="me_comment">
          <img :src="$store.state.news_datas[itemindex].play_user.headimg" :class="{comment_active:$store.state.news_datas[itemindex].head_img_show}" @click="f_change_pi">
          <div contentEditable="true" :class="{comment_active:$store.state.news_datas[itemindex].head_img_show}" @focus="comment_focus" @input="watch_val($event)" :id="item._id" @keyup="for_ie_key($event)">
          </div>
        </div>
        <div :class="{comment_commit:true,active:$store.state.news_datas[itemindex].head_img_show}">
          <input type="button" value="回复" v-if="$store.state.news_datas[itemindex].dis" disabled="disabled">
          <input type="button" value="回复" v-else class="me_comment active" v-on:click="f_commit_reply">
          <div>
            <input type="checkbox" class="me_comment" @click="f_me_say($event)">
            <span class="me_comment">本人说</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="item.type==1">
      <div>
        <div class="head_img">
          <img :src="item.headimg" @click="f_check_personal(item.user)">
        </div>
        <div class="n_con">
          <div class="u_name">{{item.title}}</div>
          <div class="beau"><img src="../../../assets/i_like_32b7cd5a.png"></div>
          <div class="pyq" @click="f_details"><span>{{item.feed.user.name}}的朋友圈：</span>{{item.feed.content}}</div>
          <div class="time">{{$store.state.cheTime(item.time.create)}}</div>
        </div>
      </div>
    </div>
    <div v-if="item.type==99">
      <div>
        <div class="head_img">
          <img :src="item.headimg">
        </div>
        <div class="n_con">
          <div class="u_name">{{item.title}}</div>
          <div class="u_con">{{item.content}}</div>
          <div class="time">{{$store.state.cheTime(item.time.create)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
	export default ({
		props: ['item', 'itemindex'],
		data() {
			return {
				myself_say: 0,
				me_co_con: '',
				replyuserid: this.item.user._id,
				replyuserno: this.item.user.no,
				me_inform: this.$store.state.current_user,
				feed_items: false,
			}
		},
		methods: {
			f_check_personal: function(user) {
				this.$store.state.current_user_pe = user;
				this.$router.push('/Main_page/Personal');
			},
			f_details: function() {
				this.$store.state.feed_id = this.item.feed._id;
				localStorage.setItem('feed_id', this.$store.state.feed_id);
				this.$http({
					method: 'get',
					url: this.$store.state.domain + 'feed/comments_by_feed',
					params: {
						'access_token': localStorage.getItem('access_token'),
						'id': this.$store.state.feed_id,
					},
					emulateJSON: true,
				}).then((res) => {
					if (res.body.feed) {
						_czc.push(["_trackEvent", "消息", "点击帖子进入帖子详情"]);
						TDAPP.onEvent("消息", "点击帖子进入帖子详情");
						// localStorage.setItem('details', JSON.stringify(this.$store.state.details));
						this.$router.push('/Main_page/Detail');
					} else if (res.body.error) {
						if (res.body.error == "该帖子不存在") {
							_czc.push(["_trackEvent", "消息", "点击-帖子不存在"]);
							TDAPP.onEvent("消息", "点击-帖子不存在");
						}
						this.$store.state.plugin.f_error(this.$store.state, res.body.error);
					}
				}, (res) => {
					this.$store.state.plugin.f_error(this.$store.state, "服务器正在开小差。。。");
				})
			},
			f_change_pi: function() {
				_czc.push(["_trackEvent", "消息", "帖子下切皮"]);
				TDAPP.onEvent("消息", "帖子下切皮");
				if (this.feed_items) {
					this.$store.state.news_datas[this.itemindex].pi_show = true;
				} else {
					//查看帖子下扮演角色列表
					this.$http({
						method: 'get',
						url: this.$store.state.domain + 'feed/plays_by_feed',
						params: {
							'access_token': localStorage.getItem('access_token'),
							'id': this.item._id,
						},
						emulateJSON: true,
					}).then((res) => {
						if (res.body.error) {
							this.$store.state.plugin.f_error(this.$store.state, res.body.error);
						} else {
							this.feed_items = res.body;
							this.$store.state.news_datas[this.itemindex].pi_show = true;
						}
					}, (res) => {
						this.$store.state.plugin.f_error(this.$store.state, "服务器正在开小差。。。");
					})
				}
			},
			f_check_pi: function(event) {
				var no = event.target.dataset.no;
				var userid = event.target.dataset.id;
				this.$http({
					method: 'get',
					url: this.$store.state.domain + 'feed/change_default_play',
					params: {
						'access_token': localStorage.getItem('access_token'),
						'userid': userid,
						'id': this.item._id,
						'no': no,
					},
					emulateJSON: true,
				}).then((res) => {
					if (res.body.play) {
						this.$store.state.news_datas[this.itemindex].play_user = res.body.play.user;
						this.$store.state.news_datas[this.itemindex].pi_show = false;
					} else if (res.body.error) {
						this.$store.state.plugin.f_error(this.$store.state, res.body.error);
					}
				}, (res) => {
					this.$store.state.plugin.f_error(this.$store.state, "服务器正在开小差。。。");
				})
			},
			comment_focus: function() {
				//获取焦点触发效果
				this.$store.state.news_datas[this.itemindex].head_img_show = true;
			},
			watch_val: function(event) {
				//时时监听val值
				var ob = event.target;
				var co_val = ob.innerText;
				this.$store.state.news_datas[this.itemindex].dis = co_val ? false : true;
				this.me_co_con = co_val;
			},
			f_commit_reply: function() {
				//提交回复
				this.$http({
					method: 'post',
					url: this.$store.state.domain + 'feed/comment',
					body: {
						'access_token': localStorage.getItem('access_token'),
						'userid': this.$store.state.news_datas[this.itemindex].play_user._id,
						'id': this.item.feed._id,
						'content': this.me_co_con,
						'b': this.myself_say,
						'replyuserid': this.replyuserid,
						'replyuserno': this.replyuserno,
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
							_czc.push(["_trackEvent", "消息", "回复-本人说"]);
							TDAPP.onEvent("消息", "回复-本人说");
						}
						_czc.push(["_trackEvent", "消息", "回复"]);
						TDAPP.onEvent("消息", "回复");
						this.$store.state.news_datas[this.itemindex].head_img_show = false;
						var val = document.querySelectorAll('.me_comment div');
						for (let i = 0; i < val.length; i++) {
							val[i].innerHTML = '';
						}
						this.$store.state.su_re = true;
						var _this = this;
						setTimeout(function() {
							_this.$store.state.su_re = false;
						}, 800)
					} else if (res.body.error) {
						if (res.body.error == "该帖子不存在") {
							_czc.push(["_trackEvent", "消息", "回复-帖子不存在"]);
							TDAPP.onEvent("消息", "回复-帖子不存在");
						}
						this.$store.state.plugin.f_error(this.$store.state, res.body.error);
					}
				}, (res) => {
					this.$store.state.plugin.f_error(this.$store.state, "服务器正在开小差。。。");
				})
			},
			for_ie_key: function(event) {
				//ie oninput兼容
				var o = event.keyCode || event.which;
				if (o == 8 || 46 || 17) {
					this.watch_val(event);
				}
			},
			f_me_say: function(event) {
				//本人说
				var me_say = event.target;
				if (me_say.checked) {
					this.myself_say = 1;
				} else {
					this.myself_say = 0;
				}
			},
		},
	})

</script>
<style scoped>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		overflow: hidden;
		word-wrap: break-word;
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
	
	.copyright {
		moz-user-select: -moz-none;
		-moz-user-select: none;
		-o-user-select: none;
		-khtml-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	.news_list>div {
		width: 660px;
		width: 100%;
		background: #fff;
		border-radius: 2px;
		margin-bottom: 20px;
		box-shadow: 1px 1px 6px #666;
	}
	
	.news_list:after {
		display: block;
		clear: both;
		content: "";
		visibility: hidden;
		height: 0;
	}
	
	.news_list>div>div {
		padding: 14px 34px 14px 20px;
	}
	
	.news_list {
		width: 100%;
		overflow: visible;
	}
	
	.head_img>img {
		display: block;
		width: 57px;
		height: 57px;
		border-radius: 50%;
	}
	
	.head_img {
		float: left;
		cursor: pointer;
	}
	
	.n_con {
		float: left;
		width: 525px;
		margin-left: 23px;
	}
	
	.u_name {
		margin-top: 8px;
		font-size: 16px;
		margin-bottom: 4px;
		cursor: pointer;
	}
	
	.u_con {
		font-size: 14px;
	}
	
	.pyq {
		margin-top: 10px;
		background: #ededed;
		padding: 5px 10px;
		border-radius: 2px;
		cursor: pointer;
	}
	
	.pyq>span {
		color: #888;
		display: inline-block;
		vertical-align: middle;
	}
	
	.time {
		color: #888;
		font-size: 12px;
		margin-top: 12px;
	}
	
	.beau {
		margin-top: 3px;
		line-height: 0;
	}
	
	.input_reply {
		float: left;
		position: relative;
		width: 100%;
		background: #f2f2f2;
	}
	
	div.me_comment {
		margin-top: 10px;
		position: relative;
		overflow: hidden;
	}
	
	div.me_comment img {
		opacity: 0;
		position: absolute;
		top: 0;
		left: 8px;
		height: 38px;
		width: 38px;
		border-radius: 50%;
		transition: all 0.5s;
		z-index: -1;
		cursor: pointer;
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
		padding: 8px 10px;
		outline: none;
		line-height: 20px;
		z-index: 9;
		transition: all 0.5s;
	}
	
	div.me_comment div.comment_active {
		width: 525px;
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

</style>
