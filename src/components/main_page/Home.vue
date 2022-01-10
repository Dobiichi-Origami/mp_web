<template>
<!--<div id="home">this is homepage</div>-->
 <section id="home">
	<home-publish></home-publish>
	<home-content></home-content>
	<div class="ajax-loader" v-show="$store.state.loader"></div>
	<button v-show="$store.state.pagemore && !$store.state.loader" @click.stop="f_get_more">点击加载更多！</button>
	<button v-show="!$store.state.pagemore && !$store.state.loader && this.$store.state.current_user" class="no_more">没有更多了哦！</button>
 </section>

</template>

<script>
	import homePublish from './home-list/homepublish'
	import homeContent from './home-list/homecontent'
	export default {
		data() {
			return {}
		},
		mounted: function() {
			if (this.$store.state.current_user)
				this.$store.state.mounted.home_mounted(this.$store.state, this);
		},
		methods: {
			f_get_more: function() {
				_czc.push(["_trackEvent", "专区首页", "加载更多"]);
				TDAPP.onEvent("专区首页", "加载更多");
				this.$store.state.loader = true;
				if (this.$store.state.pagemore) {
					//查看首页帖子列表
					this.$http({
						method: 'get',
						url: 'http://www.mrpyq.com/api/feed/feeds_by_room',
						params: {
							'access_token': localStorage.getItem('access_token'),
							'page': this.$store.state.pagenumber,
							't': this.$store.state.date,
						},
						emulateJSON: true
					}).then((res) => {
						if (res.body.items) {
							this.$store.state.pagenumber++;
							this.$store.state.pagemore = res.body.pagemore;
							var it = res.body.items;
							this.$store.state.home_items = this.$store.state.home_items.concat(it);
							for (var i = 0; i < it.length; i++) {
								var ob = {
									//addl: 0,
									head_img_show: false,
									dis: true,
									me_co_con: '',
									myself_say: 0,
									replyuserid: '',
									replyusername: '',
									comments_pagemore: it[i].stat ? it[i].stat.comment > 20 : false,
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
								this.$store.state.home_datas.push(ob);
							}
							//this.$store.state.add_number = 0;
						} else if (res.body.error)
							this.$store.state.plugin.f_error(this.$store.state, res.body.error);

						this.$store.state.loader = false;
					}, (res) => {
						this.$store.state.plugin.f_error(this.$store.state, "服务器正在开小差。。。");
					})
				}
			},
		},
		components: {
			homePublish,
			homeContent
		},
	}

</script>

<style scoped>
	section {
		width: 660px;
		padding-bottom: 25px;
	}

	button {
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

	button.no_more {
		background: transparent;
		color: #dd6f5a;
		cursor: auto;
		border: none;
	}

</style>
