<template>
	<div class="content window_select" id="system_msg">
		<div @mousedown="down($event)" class="header">系统通知
			<p @click.stop.conce="change($event)" @mousedown.stop><img src="~assets/chat/smallest.png" alt=""></p>
		</div>
		<div class="toggle_bar">
			<p :class="{active:toggle_switch}" @click="toggle_change(1)">个人消息<span></span></p>
			<p :class="{active:!toggle_switch}" @click="toggle_change(0)">群消息<span></span></p>
		</div>
		<div class="inform" v-if="toggle_switch">
			<ul>
				<li v-for="(item,index) in $store.state.chat.cmd_msg.friendCmd" class="inform_list">
					<div>
						<img src="item.apply_user.head_img" alt="">
					</div>
					<div>
						<p>item.apply_user.name <span>item.apply_user.no</span></p>
						<p class="inform_content">item.action</p>
						<p>我的身份:{{item.target_user.name}}</p>
					</div>					
				</li>
			</ul>
		</div>
		<div class="inform" v-else>
			<ul>
				<li v-for="(item,index) in $store.state.chat.cmd_msg.groupCmd" class="inform_list">
					
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	export default ({
		data() {
			return {
				toggle_switch: true,
			}
		},
		mounted: function() {
			document.onmouseup = function() {
				document.onmousemove = null;
				var dom = document.querySelector('#window_container');
			}
			document.querySelector('#system_msg').style.left = parseInt(document.body.clientWidth - 150) + 'px';
			document.querySelector('#system_msg').style.top = parseInt(document.body.clientHeight - 50) + 'px';
			var me = this;
			window.onresize = function() {
				var dom = document.querySelector('#window_container');
				me.$store.state.pageX = parseInt(dom.offsetLeft);
				me.$store.state.pageY = parseInt(dom.offsetTop);
				var win = document.querySelectorAll('.window_select');
				for (var i = 0; i < win.length; i++) {
					if (parseInt(window.getComputedStyle(win[i]).width) == 0) {
						win[i].style.top = me.$store.state.pageY + 25 + 'px';
						win[i].style.left = me.$store.state.pageX + 25 + 'px';
					}
				}
			}

		},
		methods: {
			toggle_change: function(bool) {
				bool ? this.toggle_switch = true : this.toggle_switch = false;
			},
			change: function(event) {
				var dom = document.querySelector('#system_msg');
				dom.style.transition = "width 1s,height 1s,top 1s,left 1s,border-radius 1s,opacity 1s";
				dom.style.height = '0';
				dom.style.width = '0';
				dom.style.borderRadius = "50%";
				dom.style.top = this.$store.state.pageY + 40 + 'px';
				dom.style.left = this.$store.state.pageX + 40 + 'px';
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
	.inform_list {
		height: min-60px;
		width: 100%;
		background: #fff;
		overflow: hidden;
		margin: 5px 0;
		border: 1px solid #ddd;
	}
	
	#system_msg {
		right: 150px;
		bottom: 50px;
		width: 0;
		height: 0;
		transition: width 1s, height 1s, top 1s, left 1s, border-radius 1s, opacity 1s;
	}
	
	.content {
		position: fixed;
		z-index: 999;
		width: 500px;
		overflow: hidden;
		background: #f8f6f7;
		color: #333;
		border-radius: 8px;
		box-shadow: 1px 1px 6px #333;
		height: 611px;
	}
	
	.header {
		background: #333;
		height: 55px;
		font-size: 16px;
		text-align: center;
		color: #fff;
		line-height: 55px;
		position: relative;
	}
	
	.header>p {
		position: absolute;
		color: #fff;
		height: 100%;
		right: 12px;
		top: 0;
		cursor: pointer;
	}
	
	.header>p>img {
		display: block;
		width: 16px;
		margin-top: 26px;
	}
	
	.toggle_bar {
		width: 100%;
		overflow: hidden;
	}
	
	.toggle_bar>p {
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
	
	.toggle_bar>p:nth-child(1) {
		border-right: 1px solid #ededed;
		background: url(~assets/chat/friendlist2.png) 78px center no-repeat #fff;
		background-size: 20px;
	}
	
	.toggle_bar>p:nth-child(1).active {
		background: url(~assets/chat/friendlist1.png) 78px center no-repeat #fff;
		background-size: 20px;
	}
	
	.toggle_bar>p:nth-child(1):hover {
		background: url(~assets/chat/friendlist1.png) 78px center no-repeat #fff;
		background-size: 20px;
	}
	
	.toggle_bar>p:nth-child(2) {
		text-indent: 24px;
		background: url(~assets/chat/grouplist2.png) 82px center no-repeat #fff;
		background-size: 26px;
	}
	
	.toggle_bar>p:nth-child(2):hover {
		text-indent: 24px;
		background: url(~assets/chat/grouplist1.png) 82px center no-repeat #fff;
		background-size: 26px;
	}
	
	.toggle_bar>p:nth-child(2).active {
		background: url(~assets/chat/grouplist1.png) 82px center no-repeat #fff;
		background-size: 26px;
	}
	
	.toggle_bar>p>span {
		background: #132b4d;
		height: 2px;
		position: absolute;
		bottom: 0;
		width: 40px;
		left: 105px;
		display: none;
	}
	
	.toggle_bar>p.active {
		color: #333;
	}
	
	.toggle_bar>p.active>span {
		display: block;
	}
	
	.toggle_bar>p:hover {
		color: #333;
		cursor: pointer;
	}

</style>
