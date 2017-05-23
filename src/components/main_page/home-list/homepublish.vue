<template>
	<div>
		<img src="../../../assets/text_title.3dd7af29.png">
		<textarea v-model="publicVal" @click.stop=""></textarea>
		<button v-if="publicVal" @click.stop="mpPublic">
			发布
		</button>
		<button v-else  disabled="disabled" class="disabled">
			发布
		</button>
	</div>

</template>
<script>
	export default ({
		data() {
			return {
				publicVal: '',
				//
				isDis: true,
				//
				dis: 'disabled',
			}
		},
		methods: {
			mpPublic: function() {
				//发帖
				this.$http({
					method: 'post',
					url: 'http://test.mrpyq.com/api/feed/create',
					body: {
						'access_token': localStorage.getItem('access_token'),
						'userid': this.$store.state.current_user._id,
						'content': this.publicVal,
					},
					emulateJSON: true
				}).then((res) => {
					if (res.body.feed) {
						_czc.push(["_trackEvent", "专区首页", "发帖"]);
						TDAPP.onEvent("专区首页", "发帖");
						//this.$store.state.add_number++;
						var ad = res.body.feed;
						ad.likeusers = [];
						ad.comments = [];
						var da = {
							//addl: 0,
							me_if_like: false,
							head_img_show: false,
							dis: true,
							me_co_con: '',
							myself_say: 0,
							replyuserid: '',
							replyusername: '',
							replyuserno: '',
							//????
							i: 0,
							comments_pagemore: ad.stat.comment > 20,
							comments_page: 2,
							comments: ad.comments,
							slideup: false,
							swi: true,
							con_height: 0,
							like_inform: ad.likeusers,
							me_inform: this.$store.state.current_user,
							my_pi_like: false,
							play_user: ad.play ? ad.play.user : this.$store.state.current_user,
							feed_items: false,
							pi_show: false,
							comment_beifen: [],
						}
						this.$store.state.home_items.unshift(ad);
						this.$store.state.home_datas.unshift(da);
						this.publicVal = '';
					} else if (res.body.error) {
						this.$store.state.f_error(this.$store.state, res.body.error);
					}
				}, (res) => {
					this.$store.state.f_error(this.$store.state, "服务器正在开小差。。。");
				})
			}
		},
		watch: {
			publicVal: function() {
				this.isDis = this.publicVal ? false : true;
				this.dis = this.publicVal ? 'none' : 'disabled';
			}
		}
	})

</script>
<style scoped>
	* {
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		word-wrap: break-word;
	}
	
	div {
		width: 660px;
		background: #fff;
		border-radius: 2px;
		padding: 8px 25px 50px;
		box-shadow: 1px 1px 6px #666;
		margin-bottom: 20px;
	}
	
	div>img {
		margin: 4px 0;
	}
	
	div>textarea {
		overflow: auto;
		padding: 5px;
		width: 100%;
		height: 100px;
		border: 1px solid #ccc;
		border-radius: 2px;
		font-size: 14px;
		color: #555;
	}
	
	div>button {
		margin-top: 3px;
		float: right;
		height: 31px;
		width: 72px;
		font-size: 13px;
		line-height: 31px;
		text-align: center;
		background: #fc986a;
		border: none;
		color: #fff;
		border-radius: 2px;
		cursor: pointer;
	}
	
	div>button.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

</style>
