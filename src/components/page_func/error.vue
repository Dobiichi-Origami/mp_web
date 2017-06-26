<template>
<transition name="error">
	<div class="error" v-show="$store.state.show_error" @click.stop>
		<div>
			<div>{{$store.state.error}}</div>
			<div class="confirm" @click="confirm">确定</div>
		</div>
	</div>
</transition>
</template>
<script>
	//消息提示弹窗
	export default ({
		mounted: function() {
			this.no_scroll();
		},
		methods: {
			confirm: function() {
				_czc.push(["_trackEvent", "功能", "出错弹窗"]);
				this.$store.state.show_error = false;
				this.$store.state.loader = false;
				TDAPP.onEvent("功能", "出错弹窗");
			},
			no_scroll: function() {
				var ele = document.getElementsByClassName("error")[0];
				this.$store.state.no_scroll(ele);
			}
		}
	})

</script>
<style scoped>
	.error {
		position: fixed;
		z-index: 9999;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.4);
		display: table-cell;
		vertical-align: middle;
	}
	
	.error>div {
		width: 280px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -100px;
		margin-left: -165px;
		padding: 20px;
		font-size: 22px;
		background: #f0f0f0;
		color: #333;
		border-radius: 3px;
		overflow: hidden;
		text-align: center;
		line-height: 40px;
	}
	
	.confirm {
		margin-top: 20px;
		cursor: pointer;
		height: 40px;
		background: #cdcdcd;
		border-radius: 3px;
		transition: .3s all;
	}
	
	.confirm:hover {
		background: #bbb;
		color: #fff;
	}
	
	.error-enter-active,
	.error-leave-active {
		transition: all .5s;
	}
	
	.error-enter,
	.error-leave-to {
		opacity: 0;
	}

</style>
