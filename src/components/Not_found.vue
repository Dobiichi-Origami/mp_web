<template>
<div id="bg">
	<div id="box">
		<div id="back" @click="back"></div>
	</div>
</div>
</template>

<script>
	export default {
		mounted: function() {
			_czc.push(["_trackEvent", "404页面", "404页面打开次数"]);
			TDAPP.onEvent("404页面", "404页面打开次数");
		},
		methods: {
			back: function() {
				this.$router.push("/Main_page")
			},
		}
	}

</script>

<style scoped>
	#box {
		background-image: url(~assets/404/404.png);
		background-position: center;
		background-repeat: no-repeat;
		width: 506px;
		height: 498px;
		position: relative;
		margin: 0 auto;
	}
	#back {
		cursor: pointer;
		position: absolute;
		left: 160px;
		top: 465px;
		width: 160px;
		height: 40px;
	}
	#bg {
		padding-top: 20vh;
		background: #ededed;
		width: 100vw;
		height: 80vh;
	}

</style>
