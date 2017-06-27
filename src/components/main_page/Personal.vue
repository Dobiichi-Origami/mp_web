<template>
  <div class="per_content">
    <seeimg></seeimg>
    <select_pi></select_pi>
    <div class="per_inform">
      <div>
        <img :src="$store.state.current_user_pe.headimg"><span v-show="$store.state.current_user_pe.no">NO.{{$store.state.current_user_pe.no}}</span>
      </div>
      <div>
        <div class="per_name">{{$store.state.current_user_pe.name}}
          <p class="per_level"><span :style="level_color($store.state.current_user_pe.level_exp?$store.state.current_user_pe.level_exp.level:'0')">Lv.{{$store.state.current_user_pe.level_exp?$store.state.current_user_pe.level_exp.level:'0'}}</span></p>
        </div>
      </div>
      <div>
        {{$store.state.current_user_pe.description}}
      </div>
    </div>
    <per-title v-for="(item,itemindex) in $store.state.per_items" :item="item" :itemindex="itemindex"></per-title>
    <div class="ajax-loader" v-show="$store.state.loader"></div>
    <button v-show="$store.state.per_pagemore && !$store.state.loader" @click.stop="f_get_more">点击加载更多！</button>
    <button v-show="!$store.state.per_pagemore && !$store.state.loader && this.$store.state.current_user" class="no_more">没有更多了哦！</button>
  </div>
</template>
<script>
	import seeimg from "../page_func/seeimg"
	import perTitle from './per-list/per_title'
	import select_pi from "../page_func/select_pi.vue"
	export default {
		data() {
			return {
				// i: 0,
			}
		},
		mounted: function() {
			if (this.$store.state.current_user_pe)
				this.$store.state.mounted.personal_mounted(this.$store.state, this);
		},
		methods: {
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
			f_get_more: function() {
				_czc.push(["_trackEvent", "个人中心", "加载更多"]);
				TDAPP.onEvent("个人中心", "加载更多");
				this.$store.state.loader = true;
				if (this.$store.state.per_pagemore) {
					if (this.$store.state.per_number == 0) {
						this.$http({
							method: 'get',
							url: 'http://test.mrpyq.com/api/feed/feeds_by_member',
							params: {
								'userid': this.$store.state.current_user_pe._id,
								'access_token': localStorage.getItem('access_token'),
								'no': this.$store.state.current_user_pe.no,
								'page': this.$store.state.per_pagenumber,
							},
							emulateJSON: true
						}).then((res) => {
							if (res.body.items) {
								this.$store.state.per_pagenumber++;
								this.$store.state.per_pagemore = res.body.pagemore;
								var it = res.body.items;
								this.$store.state.per_items = this.$store.state.per_items.concat(it);
								for (var i = 0; i < it.length; i++) {
									var ob = {
										addl: 0,
										me_if_like: false,
										head_img_show: false,
										dis: true,
										me_co_con: '',
										myself_say: 0,
										replyuserid: '',
										replyusername: '',
										comments_pagemore: it[i].stat.comment > 20,
										comments_page: 2,
										con_height: 0,
										comments: it[i].comments,
										slideup: false,
										swi: true,
										like_inform: it[i].likeusers ? it[i].likeusers : [],
										me_inform: this.$store.state.current_user,
										my_pi_like: false,
										play_user: it[i].play ? it[i].play.user : this.$store.state.current_user,
										feed_items: false,
										pi_show: false,
									}
									for (var j = 0; j < ob.like_inform.length; j++) {
										ob.like_inform[j].is_me = ob.like_inform[j]._id == ob.play_user._id;
										if (ob.like_inform[j].is_me) {
											ob.my_pi_like = true;
											break;
										}
									}
									this.$store.state.per_datas.push(ob);
								}
							} else if (res.body.error)
								this.$store.state.plugin.f_error(this.$store.state, res.body.error);
							this.$store.state.loader = false;
						}, (res) => {
							this.$store.state.plugin.f_error(this.$store.state, "服务器正在开小差。。。");
						})
					} else {
						this.$http({
							method: 'get',
							url: 'http://test.mrpyq.com/api/feed/feeds_by_member',
							params: {
								'userid': this.$store.state.current_user_pe._id,
								'access_token': localStorage.getItem('access_token'),
								'no': this.$store.state.current_user_pe.no,
								'page': this.$store.state.per_pagenumber - 1,
							},
							emulateJSON: true
						}).then((res) => {
							if (res.body.items) {
								this.$store.state.per_pagemore = res.body.pagemore;
								var it = res.body.items,
									l = it.length;
								it.splice(0, it.length + this.$store.state.per_number);
								this.$http({
									method: 'get',
									url: 'http://test.mrpyq.com/api/feed/feeds_by_member',
									params: {
										'userid': this.$store.state.current_user_pe._id,
										'access_token': localStorage.getItem('access_token'),
										'no': this.$store.state.current_user_pe.no,
										'page': this.$store.state.per_pagenumber,
									},
									emulateJSON: true
								}).then((res) => {
									if (res.body.items) {
										this.$store.state.per_pagenumber++;
										this.$store.state.pagemore = res.body.pagemore;
										var it01 = res.body.items
										var it02 = it.concat(it01);
										this.$store.state.per_items = this.$store.state.per_items.concat(it02);
										for (var i = 0; i < it02.length; i++) {
											var ob = {
												addl: 0,
												me_if_like: false,
												head_img_show: false,
												dis: true,
												me_co_con: '',
												myself_say: 0,
												replyuserid: '',
												replyusername: '',
												comments_pagemore: it02[i].stat ? it02[i].stat.comment > 20 : false,
												comments_page: 2,
												comments: it02[i].comments,
												con_height: 0,
												slideup: false,
												swi: true,
												like_inform: it02[i].likeusers ? it02[i].likeusers : [],
												me_inform: this.$store.state.current_user,
												my_pi_like: false,
												play_user: it02[i].play ? it02[i].play.user : this.$store.state.current_user,
												feed_items: false,
												pi_show: false,
											}
											for (var j = 0; j < ob.like_inform.length; j++) {
												ob.like_inform[j].is_me = ob.like_inform[j]._id == ob.play_user._id;
												if (ob.like_inform[j].is_me) {
													ob.my_pi_like = true;
													break;
												}
											}
											this.$store.state.per_datas.push(ob);
										}
										//this.$store.state.add_number = 0;
									} else if (res.body.error)
										this.$store.state.plugin.f_error(this.$store.state, res.body.error);
									this.$store.state.loader = false;
								}, (res) => {
									this.$store.state.plugin.f_error(this.$store.state, "服务器正在开小差。。。");
								})
							} else if (res.body.error)
								this.$store.state.plugin.f_error(this.$store.state, res.body.error);
						}, (res) => {
							this.$store.state.plugin.f_error(this.$store.state, "服务器正在开小差。。。");
						})
					}
				}
			},
		},
		components: {
			perTitle,
			seeimg,
			select_pi
		},
	}

</script>
<style>
	.per_content {
		width: 660px;
		padding-bottom: 25px;
	}
	
	.per_content>button {
		height: 35px;
		line-height: 35px;
		width: 660px;
		background: #ccc;
		text-align: center;
		cursor: pointer;
		background: #ddd;
		border: 1px solid #ccc;
		border-radius: 3px;
		color: #777;
	}
	
	.per_content>button.no_more {
		background: transparent;
		color: #dd6f5a;
		cursor: auto;
		border: none;
	}
	
	.per_inform {
		padding: 14px 34px 14px 20px;
	}
	
	.per_inform>div:nth-child(1) {
		width: 86px;
		height: 86px;
		margin: 0 auto;
		position: relative;
	}
	
	.per_inform>div:nth-child(1)>img {
		width: 86px;
		border-radius: 50%;
	}
	
	.per_inform>div:nth-child(1)>span {
		position: absolute;
		left: 100%;
		top: 64px;
		font-size: 16px;
	}
	
	.per_inform>div:nth-child(2) {
		width: 100%;
		margin-top: 15px;
	}
	
	.per_inform>div:nth-child(3) {
		display: table;
		margin: 0 auto;
		margin-top: 10px;
		color: #a7a7a7;
		font-size: 14px;
		text-align: center;
		padding: 0 3px;
	}
	
	.per_name {
		display: table;
		margin: 0 auto;
		position: relative;
		font-size: 16px;
	}
	
	.per_level {
		position: absolute;
		display: table;
		left: 100%;
		top: 0;
		font-size: 12px;
		height: 14px;
		top: 5px;
		color: #fff;
		overflow: hidden;
		padding-left: 5px;
	}
	
	.per_level span {
		display: table;
		padding: 1px 3px;
		line-height: 1.0;
		border-radius: 5px;
	}
	
	.per_content * {
		word-wrap: break-word;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}
	
	button {
		border: 0;
		background: none;
		overflow: visible;
		font-size: 14px;
	}
	
	button.more {
		height: 30px;
		line-height: 30px;
		width: 660px;
		background: #ccc;
		text-align: center;
		cursor: pointer;
	}
	
	.per_content .user_list:after,
	.per_content .user_list>div>div:nth-child(1):after,
	.per_content .text_content>p.active:after,
	.per_content .content>div:nth-child(2):after,
	.per_content .result_in>div:nth-child(1):after {
		display: block;
		clear: both;
		content: "";
		visibility: hidden;
		height: 0
	}
	
	.per_content .show_img {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		transition: 0.2s;
		z-index: 9;
		/*overflow: auto;*/
		z-index: 999;
	}
	
	.per_content .form_list {
		width: 660px;
	}
	
	.per_content .user_list,
	.per_inform {
		width: 100%;
		background: #fff;
		border-radius: 2px;
		margin-bottom: 20px;
		box-shadow: 1px 1px 6px #666;
	}
	
	.per_content .user_list>div {
		padding: 14px 34px 14px 20px;
	}
	
	.per_content .user_list>div>div:nth-child(1) {
		width: 100%;
	}
	
	.per_content .toBigger {
		cursor: zoom-in;
	}
	
	.per_content .headimg {
		float: left;
		width: 57px;
		height: 57px;
		border-radius: 50%;
		cursor: pointer;
	}
	
	.per_content .user_inform {
		float: left;
		margin-left: 23px;
	}
	
	.per_content .user_inform>h3 {
		font-weight: normal;
		margin-top: 15px;
		font-size: 16px;
		display: table;
	}
	
	.per_content .user_inform>p {
		font-size: 12px;
		color: #aaa8a8;
		display: table;
	}
	
	.per_content .i_like {
		margin-top: 18px;
		float: right;
		height: 21px;
	}
	
	.per_content .i_like>img {
		float: left;
		margin-top: 2px;
		margin-right: 10px;
		cursor: pointer;
	}
	
	.per_content .i_like>span {
		float: left;
		height: 21px;
		line-height: 21px;
	}
	
	.per_content .like_users_name {
		float: left;
		width: 585px;
	}
	
	.per_content .text_content>p {
		white-space: pre-wrap;
		word-wrap: break-word;
		margin: 14px 0;
		font-size: 16px;
		line-height: 22px;
		transition: all .2s;
	}
	
	.per_content .text_content>p.active {
		height: 132px;
		overflow: hidden;
	}
	
	.per_content .text_content a {
		color: rgb(72, 153, 237);
	}
	
	.per_content .text_content a.active {
		display: block;
	}
	
	.per_content .content>div:nth-child(2) {
		width: 100%;
		border-top: 1px solid #eee;
	}
	
	.per_content .content>div img {
		float: left;
		width: 178px;
		height: 178px;
		margin-left: 5px;
		padding: 10px 0;
	}
	
	.per_content .result {
		background: #fafafa;
		;
	}
	
	.per_content .result img {
		float: left;
	}
	
	.per_content .like_users_name span {
		float: left;
		line-height: 17px;
		margin-left: 12px;
		color: #54a1e9;
		cursor: pointer;
	}
	
	.per_content .like_users_name span.me_like {
		color: #dd6f5a;
	}

</style>
