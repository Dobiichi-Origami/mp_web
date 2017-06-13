<template>
<div id="main">
	<div v-if="zhezhao" id="zhezhao" @click="zhezhaoxy">
		<div id="qr_code">
			<img src="~assets/Login/qr_code.png" alt="二维码下载">
		</div>
	</div>	
	<div id="login">
		<img src="~assets/Login/title.png" alt="标题" id="title">

		<div class="input" :class="{input_focus:focus1}">
			<img src="~assets/Login/phone_number.png" alt="手机号" :class="{img_focus:focus1,img_nfocus:!focus1}">
			<input type="text" v-model='phone_number' maxlength="11" placeholder="手机号码" @keyup.enter="login" @focus="focus_1">
		</div>
		<div class="input" id="xbj" :class="{input_focus:focus2}">
			<img src="~assets/Login/password.png" alt="登录密码" :class="{img_focus:focus2,img_nfocus:!focus2}">
			<input type="password" v-model='password' placeholder="登录密码" maxlength="16" @keyup.enter="login"
			@focus="focus_2">
		</div>
		<div id="error">
			<span>
				<img v-show="error" src="~assets/Login/error.png" alt="错误提示">{{error}}
			</span>
		</div>

		<div @click="login">登陆</div>
		<div id="download" @click="zhezhaoxy">扫一扫下载</div>
	</div>
</div>
</template>
<script>
	export default {
		name: 'Login',
		data() {
			return {
				phone_number: '',
				password: '',
				error: '',
				focus1: false,
				focus2: false,
				zhezhao: false,
			}
		},
		mounted: function() {
			_czc.push(["_trackEvent", "登录页面", "登录页面打开次数"]);
			TDAPP.onEvent("登录页面", "登录页面打开次数");
		},
		methods: {
			login: function() {
				//传数据判断用户输入的信息是否正确，正确后执行下面函数
				//返回id，设置id
				var me = this;
				me.$http.get('http://test.mrpyq.com/api/account/login', {
					params: {
						phone: me.phone_number,
						password: me.password,
					},
				}).then(
					(res) => {
						if (res.body.access_token) {
							_czc.push(["_trackEvent", "登录页面", "登录成功"]);
							TDAPP.onEvent("登录页面", "登录成功");
							localStorage.setItem('access_token', res.body.access_token);
							me.set_location();
							me.error = '';
							me.$router.push('/Main_page');

						} else if (res.body.error)
							me.error = res.body.error;
					},
					(res) => {
						_czc.push(["_trackEvent", "登录页面", "登录失败"]);
						TDAPP.onEvent("登录页面", "登录失败");
						me.error = '登录失败'
					}
				)
			},
			set_location: function() {
				var a = new Date().getTime()
				localStorage.setItem('time', a);
				//过期时间一周
				localStorage.setItem('expire', 604800000);
			},
			focus_1: function() {
				this.focus1 = true;
				this.focus2 = false;
				this.error = '';
			},
			focus_2: function() {
				this.focus2 = true;
				this.focus1 = false;
				this.error = '';
			},
			zhezhaoxy: function() {
				this.zhezhao = !this.zhezhao;
				if (this.zhezhao) {
					TDAPP.onEvent("登录页面", "点击扫一扫下载");
					_czc.push(["_trackEvent", "登录页面", "点击扫一扫下载"]);
				}
			},
		},

	}

</script>

<style scoped>
	#main {
		display: flex;
		min-height: 100vh;
		margin: 0;
		font: #323238;
		background-image: url("~assets/Login/bg.png");
	}
	
	#zhezhao {
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .7);
	}
	
	#qr_code:after {
		position: absolute;
		top: -50px;
		right: -60px;
		cursor: pointer;
		color: white;
		content: url("~assets/Login/close.png");
	}
	
	#qr_code {
		position: absolute;
		z-index: 1;
		left: calc(50% - 175px);
		top: calc(40% - 235px);
	}
	
	#login {
		margin: 250px auto;
	}
	
	#title {
		transform: translateX(30px);
	}
	
	#xbj {
		margin-bottom: 0;
	}
	
	.input {
		background: #fff;
		border: 1px solid #bbb;
		border-radius: 2px;
		margin: 30px 0;
		height: 50px;
		width: 500px;
		transform: translateY(-5px);
	}
	
	.input_focus {
		border: 1px solid #323238;
	}
	
	.img_focus {
		opacity: 1;
	}
	
	.img_nfocus {
		opacity: .5;
	}
	
	.input img {
		vertical-align: sub;
		margin: 0 15px;
	}
	
	#error {
		height: 40px;
		width: 100%;
	}
	
	#error>span {
		font-size: 18px;
		line-height: 2;
		display: inline-block;
	}
	
	#error>span img {
		vertical-align: sub;
		margin-right: 12px;
	}
	
	#login>div:nth-last-child(2) {
		color: white;
		width: 500px;
		height: 60px;
		background: #323238;
		border-radius: 2px;
		cursor: pointer;
		text-align: center;
		font-size: 24px;
		line-height: 60px;
		position: relative;
		transition: all .3s;
	}
	
	#login>div:nth-last-child(2):hover {
		background: #111;
	}
	
	#login>div:nth-last-child(1) {
		text-align: center;
		font-size: 24px;
		margin-top: 15px;
	}
	
	#download {
		cursor: pointer;
		display: table;
		margin: 0 auto;
	}
	
	input {
		font-size: 20px;
		color: #4c4c4c;
		height: 50px;
		width: 420px;
		border: none;
		letter-spacing: 4px;
	}
	
	::placeholder {
		color: #a6a6a6;
		font-size: 20px;
		letter-spacing: 0px;
		font-family: Arial, 'microsoft yahei', Helvetica, sans-serif;
	}

</style>
