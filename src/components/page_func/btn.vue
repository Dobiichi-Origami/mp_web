<template>
   <div>
    	<img src="~assets/Main_page/to_top.png" alt="回到顶部" @click="to_top">
		<div id="line"></div>
		<img src="~assets/Main_page/refresh.png" alt="刷新" @click='refresh'>
   </div>
</template>

<script>
	//导航按钮
	export default {
		data() {
			return {}
		},
		methods: {
			to_top: function() {
				_czc.push(["_trackEvent", "功能", "按钮-回到顶部-点击"]);
				TDAPP.onEvent("功能", "按钮-回到顶部-点击");
				var t = 400 * 60 / 1000,
					currentST = {},
					ele = {},
					flag = 0;
				if (document.body.scrollTop != 0) {
					ele = document.body;
					currentST = document.body.scrollTop;
				} else if (document.documentElement.scrollTop != 0) {
					ele = document.documentElement;
					currentST = document.documentElement.scrollTop
				} else {
					return;
				}

				function easeOut(t, b, c, d) {
					return -c * (t /= d) * (t - 2) + b;
				}
				var timer = setInterval(function() {
					//linear滑动定位
					if (flag <= t) {
						ele.scrollTop = easeOut(flag, currentST, 0 - currentST, t)
						flag++;
					} else {
						clearInterval(timer);
					}
				}, 16);
				//执行完再true
			},

			refresh: function() {
				_czc.push(["_trackEvent", "功能", "按钮-刷新-点击"]);
				TDAPP.onEvent("功能", "按钮-刷新-点击");
				if (location.href.match('/Main_page/News') != null)
					this.$store.state.news_mounted(this.$store.state, this);
				else if (location.href.match('/Main_page/Personal') != null)
					this.$store.state.personal_mounted(this.$store.state, this);
				else if (location.href.match('/Main_page/Detail') != null) 
					this.$store.state.detail_mounted(this.$store.state, this);
				else if(location.href.match('/Main_page/Addresslist') != null)
					this.$store.state.friendcenter_mounted(this.$store.state, this)
				else
					this.$store.state.home_mounted(this.$store.state, this);
			},
		}
	}

</script>

<style scoped>
	img {
		width: 25px;
		height: 25px;
		display: block;
		margin: 2px;
		padding: 3px;
		border-radius: 10px;
		cursor: pointer;
		transition: all .2s;
	}
	
	img:hover {
		background: #ddd;
	}
	
	#line {
		width: 35px;
		height: 2px;
		background: #ddd;
	}

</style>
