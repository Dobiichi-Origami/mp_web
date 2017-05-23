<template>
   <transition name="anime">
    <div class="show_img" v-show="$store.state.img_show" @click.stop="hide_img">
			<div class="igs">
				<div id="img_box">
				<transition-group name="img">
					<img v-for="(photo,photoindex) in $store.state.img_photos" :key="photoindex" :src="photo.large"  v-show="$store.state.photos_show[photoindex]" @click.stop>
				</transition-group>
				</div>
				<span @click.stop="hide_img">X</span>
				<span @click.stop="next_img"></span>
				<span @click.stop="previous_img"></span>
			</div>	
	</div>
   </transition>
</template>

<script>
	//点击小图观看大图
	export default {
		mounted: function() {
			var ele = document.querySelector(".igs");
			this.$store.state.no_scroll(ele);
		},
		methods: {
			hide_img: function() {
				_czc.push(["_trackEvent", "功能", "看图"]);
				TDAPP.onEvent("功能", "看图");
				this.$store.state.img_photos = false;
				this.$store.state.img_show = false;
				this.$store.state.photos_show = [];
			},
			next_img: function() {
				var me = this;
				me.$store.state.photos_show = [];
				me.$store.state.img_index++;
				if (me.$store.state.img_index >= me.$store.state.img_photos.length)
					me.$store.state.img_index = 0;

				for (var i = 0; i < me.$store.state.img_photos.length; i++)
					me.$store.state.photos_show[i] = false;
				setTimeout(function() {
					me.$store.state.photos_show = [];
					me.$store.state.photos_show[me.$store.state.img_index] = true;
				}, 50)
			},
			previous_img: function() {
				var me = this;
				me.$store.state.photos_show = [];
				me.$store.state.img_index--;
				if (me.$store.state.img_index < 0)
					me.$store.state.img_index = me.$store.state.img_photos.length - 1;

				for (var i = 0; i < me.$store.state.img_photos.length; i++)
					me.$store.state.photos_show[i] = false;
				setTimeout(function() {
					me.$store.state.photos_show = [];
					me.$store.state.photos_show[me.$store.state.img_index] = true;
				}, 50)
			},
		}
	}

</script>

<style scoped>
	.igs {
		width: 100vw;
		overflow: auto;
		height: 100vh;
	}
	
	#img_box {
		height: 100vh;
		width: 100vw;
		overflow: auto;
		display: table-cell;
		vertical-align: middle;
		text-align: center;
	}
	
	#img_box img {
		max-width: 600px;
		min-width: 200px;
		margin: 0 auto;
	}
	
	.show_img {
		left: 0;
		top: 0;
		z-index: 99999999999;
		position: fixed;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.7);
	}
	
	.show_img>div>span {
		cursor: pointer;
		position: absolute;
		height: 50px;
		width: 50px;
	}
	
	.show_img>div>span:nth-child(2) {
		top: 20px;
		right: 20px;
		font-size: 45px;
		line-height: 50px;
		text-align: center;
		color: #807f7c;
	}
	
	.show_img>div>span:nth-child(3) {
		top: 50%;
		margin-top: -25px;
		right: 20px;
		background: url(../../assets/r_h.png);
	}
	
	.show_img>div>span:nth-child(3):hover {
		background: url(../../assets/r_b.png);
	}
	
	.show_img>div>span:nth-child(4) {
		top: 50%;
		margin-top: -25px;
		left: 20px;
		background: url(../../assets/l_h.png);
	}
	
	.show_img>div>span:nth-child(4):hover {
		background: url(../../assets/l_b.png);
	}
	
	.show_img>div>span:hover {
		color: #fff;
	}
	
	.anime-enter-active,
	.anime-leave-active {
		transition: all .2s;
	}
	
	.anime-enter,
	.anime-leave-to {
		opacity: 0;
	}
	.img-enter-active {
		transition: all .5s ease-out;
	}
	
	.img-enter {
		transform: translateY(-100%);
		opacity: 0;
	}

</style>
