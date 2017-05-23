<template>
   <div>

    	<input type="file" accept="image/jpeg,image/jpg,image/png" id="file-Id"  @change="upload($event)">
   </div>
</template>

<script>
	import uploadimg from 'src/chat/RongSDK_helper/uploadimg'
	export default {
		data() {
			return {}
		},
		methods: {
			upload: function(e) {
				var file = e.target.files[0],
					me = this;
				if (file) {
					if (file.name.slice(-4) == '.png' || file.name.slice(-4) == '.jpg') {
						function callback(url_) {
							if (url_.match('jpg'))
								me.$store.state.chat.selected_img = url_;
							console.log(me.$store.state.chat.selected_img)
						}
						uploadimg(file, callback);
					} else
						this.$store.state.f_error(this.$store.state, "ÔÝ²»Ö§³Ö´«ËÍjpg£¬pngÒÔÍâµÄ¸ñÊ½");
				}
			},
		}
	}

</script>


<style scoped="true">
	#file-Id {
		width: 70px;
		overflow: hidden;
	}

</style>
