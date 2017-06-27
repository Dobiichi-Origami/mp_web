<template>
<div id="app">
<router-view></router-view>
<error></error>
<atlist v-if="$store.state.show_at"></atlist>
</div>
</template>
<script>
	import error from "./page_func/error"
	import atlist from "./page_func/window/at_pi"
	export default {
		name: 'app',
		data() {
			return {
				news_interval: 0,
			}
		},
		components: {
			error,
			atlist
		},
		mounted: function() {
			//实时获取消息,看融云更改
			this.new_message()
		},
		destroyed: function() {
			clearInterval(this.news_interval);
		},
		updated: function() {
			var old_time = localStorage.getItem('time'),
				me = this;
			if (old_time) {
				let new_time = new Date().getTime(),
					expire = localStorage.getItem('expire');
				//时间过期
				if (new_time - old_time > expire) {
					if (!(location.hash == '#/' || location.href.match('/Login') != null)) {
						this.$store.state.plugin.f_error(this.$store.state, "用户信息失效，请重新登录");
						me.$router.push('/Login')
					}
				} else {
					if ((location.hash == '#/' || location.href.match('/Login') != null))
						me.$router.push('/Main_page')
				}
			}
			//时间戳不存在
			else {
				//不在登录页面
				if (!(location.hash == '#/' || location.href.match('/Login') != null)) {
					this.$store.state.plugin.f_error(this.$store.state, "用户信息失效，请重新登录");
					me.$router.push('/Login')
				}
				//在登录页面就不做操作

			}
		},
		methods: {
			//实时获取消息
			new_message: function() {
				var me = this;
				me.news_interval = setInterval(function() {
					if (location.href.match('/Login') != null) {
						me.$store.state.news = 0;
					} else if (location.hash == '#/Main_page/News') {
						me.$store.state.news = 0;
					} else {
						me.$http.get(me.$store.state.domain + "feed/unread_count", {
							params: {
								access_token: localStorage.getItem('access_token'),
							}
						}).then(
							(res) => {
								var re = res.body;
								if (!re.error) {
									if (re.count > 999)
										me.$store.state.news = 'N+';
									else
										me.$store.state.news = re.count;
								} else
									this.$store.state.plugin.f_error(this.$store.state, res.body.error);

							}, (res) => {
								this.$store.state.plugin.f_error(this.$store.state, "服务器正在开小差。。。");
							}
						)
					}
					//20s获取一次
					//测试5s一次
				}, 60000)
			},
		}
	}

</script>

<style>
	body {
		background: #ededed;
	}
	
	html,
	body,
	div,
	dl,
	dt,
	dd,
	ul,
	ol,
	li,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	pre,
	form,
	fieldset,
	input,
	p,
	blockquote,
	th,
	td {
		margin: 0;
		padding: 0;
	}
	
	fieldset,
	img {
		border: none;
	}
	
	input,
	button,
	select,
	textarea {
		outline: none;
	}
	
	textarea {
		resize: none;
		-moz-user-select: text;
		-webkit-user-select: text;
		-ms-user-select: text;
	}
	
	li {
		list-style: none;
	}
	
	a {
		text-decoration: none;
		color: white;
	}
	
	body {
		color: #4c4c4c;
		font-size: 14px;
		line-height: 1.5;
		font-family: Arial, 'microsoft yahei', Helvetica, sans-serif;
	}
	
	html {
		overflow-y: scroll;
		min-height: 100%;
	}
	
	:root {
		overflow-y: auto;
		overflow-x: hidden;
	}
	
	:root body {
		position: absolute;
	}
	
	body {
		width: 100vw;
		overflow: hidden;
		min-height: 100%;
	}
	
	@keyframes ajax-loader-rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	/*	转转转动画*/
	
	.ajax-loader {
		font-size: 10px;
		width: 1.5em;
		height: 1.5em;
		margin: 0 auto;
		margin-bottom: 19px;
		border-left: .1em solid rgba(0, 0, 0, 1);
		border-bottom: .1em solid rgba(0, 0, 0, 0.8);
		border-right: .1em solid rgba(0, 0, 0, 0.6);
		border-top: .1em solid rgba(0, 0, 0, 0);
		border-radius: 50%;
		animation: 0.7s ajax-loader-rotate infinite;
	}

</style>
