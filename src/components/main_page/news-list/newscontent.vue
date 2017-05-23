<template>
	<div class="news_content">
	<select_pi></select_pi>
		<div class="form_list">
			<div class="su_re" v-show="this.$store.state.su_re">
				<img src="../../../assets/post_success.fd94927d.png">
			</div>
			<small-content v-for="(item,itemindex) in $store.state.news_items" :item="item" :itemindex="itemindex"></small-content>
		</div>
	</div>
</template>
<script>
	import smallContent from "./small_content"
	import select_pi from "../../page_func/select_pi.vue"
	export default ({
		data() {
			return {

			}
		},
		methods: {

		},
		components: {
			smallContent,
			select_pi
		},
	})

</script>
<style scoped>
	.news_content {
		width: 660px;
	}
	
	.su_re {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
	}
	
	.su_re img {
		display: block;
		margin: 20vh auto;
	}
	/* .home_content .show_img>div.igs { display: table; margin: 0 auto; overflow: hidden; }*/
	
	#img_box {
		width: 200%;
		height: 100vh;
		overflow: auto;
	}

</style>
