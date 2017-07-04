<template>
	<div class="content window_select" id="system_msg">
		<div @mousedown="down($event)" class="windowheader">系统通知
			<p @click.stop.conce="change($event)" @mousedown.stop><img src="~assets/chat/smallest.png" alt=""></p>
		</div>
		<div class="tongzhi_nav">
			<p :class="{active:tongzhi_act}" @click="change_tongzhi(1)">个人通知<span></span></p>
			<p :class="{active:!tongzhi_act}" @click="change_tongzhi(0)">群通知<span></span></p>
		</div>
		<div class="tongzhi_friend" v-if="tongzhi_act">
			<ul>
				<li v-for="(list,index) in $store.state.chat.cmd_msg.friendCmd" class="tongzhi_group_list">
					<img :src="list.apply_user.head_img" alt="" class="tongzhi_img">
					<div class="tongzhi_info">
						<p>{{list.apply_user.name}}</p>
						<p>申请信息: {{list.apply_info}}</p>
						<p>我的身份:{{list.target_user.name}}</p>
					</div>
					<div class="tongzhi_info_right">
						<p>{{list.timeString}}</p>
						<button @click="">同意</button>
					</div>
				</li>
			</ul>
		</div>
		<div class="tongzhi_group" v-else>
			<ul>
				<li v-for="(list,index) in $store.state.chat.cmd_msg.groupCmd" class="tongzhi_group_list">
					<div v-if="list.name=='group_kick'">
						<img :src="list.data.groupHeadimg" alt="">
						<div class="group_apply">
							<p class="tongzhi_group_name">{{list.data.groupName}}</p>
							<p class="tongzhi_group_info">你已被移出该群</p>
						</div>
					</div>
					<div v-else-if="list.name=='group_invite'">
						<img :src="list.data.groupHeadimg" alt="">
						<div class="group_apply">
							<p class="tongzhi_group_name">{{list.data.groupName}}</p>
							<p class="tongzhi_group_info">{{list.data.applyUserName+'('+list.data.applyUserNo+')'}}邀请你加入该群</p>
						</div>
						<div class="group_api_apply" v-show="list.data.state==0">
							<button @click="agree_join(list.data,index,$event)">同意</button>
							<button>忽略</button>
						</div>
						<div class="agree_join_success" style="display:none" v-show="list.data.state==1">
							已同意
						</div>
						<div class="agree_join_fail" style="display:none" v-show="list.data.state==2">
							已拒绝
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	export default ({
		props: ['index', 'list'],
		data() {
			return {
				tongzhi_act: true,
			}
		},
		mounted: function() {

		},
		methods: {
			//同意入群

			change_tongzhi: function(s) {
				if (s) {
					this.tongzhi_act = true;
				} else {
					this.tongzhi_act = false;
				}
			},
			change: function(event) {
				var dom = document.querySelector('#system_msg');
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
					box = document.querySelector('#system_msg'),
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
		},
	})

</script>
<style scoped>
	#system_msg {
		right: 150px;
		bottom: 50px;
		width: 0;
		height: 0;
		transition: width 1s, height 1s, top 1s, left 1s, border-radius 1s, opacity 1s;
	}
	
	.agree_join_success,
	.agree_join_fail {
		float: left;
		width: 58px;
		height: 24px;
		float: left;
		font-size: 12px;
		background: #8fc9f5;
		color: #fff;
		border-radius: 3px;
		text-align: center;
		line-height: 24px;
		margin: 18px 0 0 40px;
	}
	
	div.agree_join_fail {
		background: #bbb;
	}
	
	.tongzhi_group_list {
		height: min-60px;
		width: 100%;
		background: #fff;
		overflow: hidden;
		margin: 5px 0;
		border: 1px solid #ddd;
		position: relative;
	}
	
	.tongzhi_group_list img {
		float: left;
		width: 50px;
		height: 50px;
		margin: 20px 10px;
		border-radius: 50%;
	}
	


	.tongzhi_info_right{
		position: absolute;
		top:20px;
		right: 20px;
	}

	.group_apply>p {
		line-height: 20px;
		font-size: 14px;
		margin-top: 6px;
	}
	
	.tongzhi_group_name {
		font-size: 16px!important;
	}
	
	.group_apply {
		float: left;
		width: 280px;
	}
	
	.group_api_apply {
		float: left;
		width: 130px;
		margin-top: 18px;
		margin-left: 6px;
	}
	
	.group_api_apply>button {
		width: 58px;
		height: 24px;
		float: left;
		border: none;
		font-size: 12px;
		cursor: pointer;
		transition: all .3s;
		position: relative;
		top: 0;
		left: 0;
		border-radius: 3px;
	}
	
	.group_api_apply>button:hover {
		top: -2px;
		box-shadow: 0 0 3px 0 #999;
	}
	
	.group_api_apply>button:nth-child(1) {
		background: #8fc9f5;
		color: #fff;
	}
	
	.group_api_apply>button:nth-child(2) {
		margin-left: 10px;
		background: #bbb;
		color: #fff;
		padding-bottom: 8px;
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
		margin-top: 26px;
	}
	
/*	.tongzhi_img {
		vertical-align: center;
	}*/

	.tongzhi_info {
		margin-left: 20px;
		margin-top:10px;
	}

	.tongzhi_info_right {
		float:right;
	}

	.tongzhi_nav {
		width: 100%;
		overflow: hidden;
	}
	
	.tongzhi_nav>p {
		float: left;
		width: 50%;
		background: #fff;
		position: relative;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		text-align: center;
		line-height: 50px;
		font-size: 14px;
		border-bottom: 1px solid #ededed;
		color: #b3b3b3;
		text-indent: 20px;
	}
	
	.tongzhi_nav>p:nth-child(1) {
		border-right: 1px solid #ededed;
		background: url(~assets/chat/friendlist2.png) 78px center no-repeat #fff;
		background-size: 20px;
	}
	
	.tongzhi_nav>p:nth-child(1).active {
		background: url(~assets/chat/friendlist1.png) 78px center no-repeat #fff;
		background-size: 20px;
	}
	
	.tongzhi_nav>p:nth-child(1):hover {
		background: url(~assets/chat/friendlist1.png) 78px center no-repeat #fff;
		background-size: 20px;
	}
	
	.tongzhi_nav>p:nth-child(2) {
		text-indent: 24px;
		background: url(~assets/chat/grouplist2.png) 82px center no-repeat #fff;
		background-size: 26px;
	}
	
	.tongzhi_nav>p:nth-child(2):hover {
		text-indent: 24px;
		background: url(~assets/chat/grouplist1.png) 82px center no-repeat #fff;
		background-size: 26px;
	}
	
	.tongzhi_nav>p:nth-child(2).active {
		background: url(~assets/chat/grouplist1.png) 82px center no-repeat #fff;
		background-size: 26px;
	}
	
	.tongzhi_nav>p>span {
		background: #132b4d;
		height: 2px;
		position: absolute;
		bottom: 0;
		width: 40px;
		left: 105px;
		display: none;
	}
	
	.tongzhi_nav>p.active {
		color: #333;
	}
	
	.tongzhi_nav>p.active>span {
		display: block;
	}
	
	.tongzhi_nav>p:hover {
		color: #333;
		cursor: pointer;
	}
	
	.gift_sender_name {
		margin: 0 5px;
		color: #c89191;
		font-size: 14px;
	}
	
	.gift {
		margin: 0 5px;
		color: #c89191;
		font-size: 16px;
	}

</style>
