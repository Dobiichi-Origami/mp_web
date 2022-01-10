<template>
   <transition name="anime">
    <div class="show_img" v-show="$store.state.plugin.show_select_pi" @click.stop="f_hide_pi($event)">
			<div class="container">
				<div class="pi_chu">
					<ul class="pi_list">
						<li v-for="(list,listindex) in $store.state.users" @click.stop="f_sure_add(listindex)">
							<img :src="list.headimg">
							<h3>{{list.name}}</h3>
							<span :style="level_color(list.level_exp.level)">Lv.{{list.level_exp.level}}</span>
							<p>{{list.description}}</p>
						</li>
					</ul>
				</div>
			</div>
		</div>
   </transition>
</template>

<script>
	import vm from 'src/main.js'
	var state = vm.$store.state
	export default {
		mounted: function() {
			var ele = document.querySelector(".pi_chu");
			state.no_scroll(ele);
		},
		methods: {
			f_hide_pi: function(event) {
				if (location.href.match('/Main_page/News') != null) {
					state.news_datas[state.plugin.pi_index].pi_show = false;
					state.plugin.show_select_pi = false;
				} else if (location.href.match('/Main_page/Personal') != null) {
					state.per_datas[state.plugin.pi_index].pi_show = false;
					state.plugin.show_select_pi = false;
				} else {
					state.home_datas[state.plugin.pi_index].pi_show = false;
					state.plugin.show_select_pi = false;
				}
			},
			f_sure_add: function(index) {
				if (location.href.match('/Main_page/News') != null) {
					this.$http({
						method: 'get',
						url: 'http://www.mrpyq.com/api/feed/add_play',
						params: {
							'access_token': localStorage.getItem('access_token'),
							'id': state.news_items[state.plugin.pi_index].feed._id,
							'userid': state.users[index]._id,
							'no': state.users[index].no,
						},
						emulateJSON: true,
					}).then((res) => {
						if (res.body.play) {
							if (res.body.play.default) {
								state.news_datas[state.plugin.pi_index].play_user = res.body.play.user;
							}
							state.news_datas[state.plugin.pi_index].pi_show = false;
							state.plugin.show_select_pi = false;
						} else if (res.body.error) {
							state.plugin.f_error(state, res.body.error);
						}
					}, (res) => {
						state.plugin.f_error(state, "服务器正在开小差。。。");
					})
				} else if (location.href.match('/Main_page/Personal') != null) {
					this.$http({
						method: 'get',
						url: 'http://www.mrpyq.com/api/feed/add_play',
						params: {
							'access_token': localStorage.getItem('access_token'),
							'id': state.per_items[state.plugin.pi_index]._id,
							'userid': state.users[index]._id,
							'no': state.users[index].no,
						},
						emulateJSON: true,
					}).then((res) => {
						if (res.body.play) {
							if (res.body.play.default) {
								state.per_datas[state.plugin.pi_index].play_user = res.body.play.user;
								for (var j = 0; j < state.per_datas[state.plugin.pi_index].like_inform.length; j++) {
									state.per_datas[state.plugin.pi_index].like_inform[j].is_me = state.per_datas[state.plugin.pi_index].like_inform[j]._id == state.per_datas[state.plugin.pi_index].play_user._id;
									if (state.per_datas[state.plugin.pi_index].like_inform[j].is_me) {
										state.per_datas[state.plugin.pi_index].my_pi_like = true;
										break;
									} else {
										state.per_datas[state.plugin.pi_index].my_pi_like = false;
									}
								}
							}
							state.per_datas[state.plugin.pi_index].pi_show = false;
							state.plugin.show_select_pi = false;

						} else if (res.body.error) {
							state.plugin.f_error(state, res.body.error);
						};
					}, (res) => {
						state.plugin.f_error(state, "服务器正在开小差。。。");
					})
				} else {
					this.$http({
						method: 'get',
						url: 'http://www.mrpyq.com/api/feed/add_play',
						params: {
							'access_token': localStorage.getItem('access_token'),
							'id': state.home_items[state.plugin.pi_index]._id,
							'userid': state.users[index]._id,
							'no': state.users[index].no,
						},
						emulateJSON: true,
					}).then((res) => {
						if (res.body.play) {
							if (res.body.play.default) {
								state.home_datas[state.plugin.pi_index].play_user = res.body.play.user;
								for (var j = 0; j < state.home_datas[state.plugin.pi_index].like_inform.length; j++) {
									state.home_datas[state.plugin.pi_index].like_inform[j].is_me = state.home_datas[state.plugin.pi_index].like_inform[j]._id == state.home_datas[state.plugin.pi_index].play_user._id;
									if (state.home_datas[state.plugin.pi_index].like_inform[j].is_me) {
										state.home_datas[state.plugin.pi_index].my_pi_like = true;
										break;
									} else {
										state.home_datas[state.plugin.pi_index].my_pi_like = false;
									}
								}
								state.home_datas[state.plugin.pi_index].pi_show = false;
							}

							state.plugin.show_select_pi = false;
						} else if (res.body.error) {
							state.plugin.f_error(state, res.body.error);
						}
					}, (res) => {
						state.plugin.f_error(state, "服务器正在开小差。。。");
					})
				}
			},
			level_color: function(level) {
				if (state.users) {
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
		},
	}

</script>

<style scoped>
	.container {
		margin-top: 25vh!important;
		width: 400px;
		height: 490px;
		background: #fff;
		margin: 0 auto;
		overflow: hidden;
		border-radius: 5px;
		position: relative;
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

	.show_img {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		transition: 0.2s;
		padding-top: 20px;
		z-index: 999;
	}

	.show_img img {
		display: block;
	}

	.anime-enter,
	.anime-leave-to {
		opacity: 0;
	}

</style>
