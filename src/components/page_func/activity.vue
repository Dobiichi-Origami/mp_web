<template>
   <div>
		<div id="activity" :class="{to_img1:dot==1,to_img2:dot==2,to_img3:dot==3}">
					<div id="img1"></div>
					<div id="img2"></div>
<!--					<div id="img3"></div>-->
		</div>
		<div id="dot1" class="dots" :class="{dot_active:dot==1}" @click="dots" data-dot="dot1"></div>
		<div id="dot2" class="dots" :class="{dot_active:dot==2}" @click="dots" data-dot="dot2"></div>
<!--		<div id="dot3" class="dots" :class="{dot_active:dot==3}" @click="dots" data-dot="dot3"></div>-->
   </div>
</template>

<script>
	//活动导航图
	export default {
		data() {
			return {
				dot: 1,
				dot_interval: false,
			}
		},
		mounted: function() {
			this.dots();
		},
		methods: {
			dots: function(e) {
				var me = this;

				if (e) {
					var a = e.target.dataset.dot;
					if (a == "dot1")
						me.dot = 1;

					else if (a == "dot2")
						me.dot = 2;

					//					else if (a == "dot3")
					//						me.dot = 3;
				}
				if (me.dot_interval) {
					clearInterval(me.dot_interval);
				}
				me.dot_interval = setInterval(function() {
					if (me.dot == 1) {
						me.dot = 2;
					} else if (me.dot == 2)
						me.dot = 1;
					//					else if (me.dot == 3)
					//						me.dot = 1;
				}, 5000);

			},
		},
	}

</script>

<style scoped>
	.dots {
		position: absolute;
		width: 12px;
		height: 12px;
		border-radius: 100%;
		border: 2px solid #666;
		bottom: 10px;
		cursor: pointer;
		left: 50%;
		transition: all .5s;
	}
	
	.dot_active {
		transform: scale(1.3);
		transform-origin: center;
		background: #fff;
	}
	
	#dot1 {
		left: calc(50% - 30px);
	}
	
	#dot2 {
		left: calc(50% - 0px);
	}
	
	#dot3 {
		left: calc(50% + 30px);
	}
	
	#activity {
		width: 615px;
		transition: all 1s;
	}
	
	.to_img1 {
		transform: translateX(0px);
	}
	
	.to_img2 {
		transform: translateX(-205px);
	}
	
	.to_img3 {
		transform: translateX(-410px);
	}
	
	#activity>div {
		width: 205px;
		height: 300px;
		float: left;
		background-position: center;
		background-size: cover;
	}
	
	#img1 {
		background-image: url(~assets/Main_page/img1.png);
	}
	
	#img2 {
		background-image: url(~assets/Main_page/img2.png);
	}
	/*
	
	#img3 {
		background-image: url(~assets/Main_page/img3.jpg);
	}
*/

</style>
