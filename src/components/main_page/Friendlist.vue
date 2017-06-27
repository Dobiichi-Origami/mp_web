<template>
	<div class="content" >
		<div class="ajax-loader" v-show="$store.state.loader"></div>
		<div  v-for="(blist,bindex) in this.$store.state.chat.messages.friendlist">
			<div class="classname" :data-index="bindex" @click="bianxiao($event)">{{blist.name}}</div>
			<ul :id="'class'+bindex" class="active classcontent" :style="{height:blist.friends.length*61+'px'}">
				<li v-for="(slist,sindex) in blist.friends" :class="{noborder:sindex==0}">
					<p><img :src="slist.headimg" alt=""><span class="friendname">{{slist.name}}no.{{slist.no}}</span><span class="messagecontent">{{slist.content}}</span><span @click="openwindow($event,bindex,sindex)" :data-index="slist.user._id" class="enterroom">聊天</span></p>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	export default ({
		data() {
			return {
				act: false,
				n: 0,
			}
		},
		mounted: function() {
			if (this.$store.state.current_user) {
				this.$store.state.mounted.friendcenter_mounted(this.$store.state, this);
			}

			function f(num, i, arr) {
				if (i++ < 5) {
					var a = Math.floor(Math.random() * num / 2);
					arr.push(a);
					return f(num - a, i, arr);
				} else {
					arr.push(num);
					return arr;
				}
			}
		},
		methods: {
			bianxiao: function(event) {
				var index = event.target.dataset.index;
				var dom = document.querySelector('#class' + index);
				if (dom.className == '') {
					dom.className = 'active';
				} else {
					dom.className = '';
				}
			},
			openwindow: function(event, bindex, sindex) {
				var index = event.target.dataset.index;
				if (this.$store.state.message_window.length == 0) {
					this.$store.state.message_window.push({
						user: this.$store.state.chat.messages.friendlist[bindex].friends[sindex],
						show: 1
					});
				} else {
					for (var i = 0; i < this.$store.state.message_window.length; i++) {
						if (index == this.$store.state.message_window[i].user.user._id) {
							var dom = document.querySelector('#win' + index);
							var w = parseInt(window.getComputedStyle(dom).width);
							if (w != 500) {
								dom.style.transition = "all 1s";
								dom.style.width = "500px";
								dom.style.height = '600px';
								dom.style.borderRadius = '8px';
								dom.style.top = '100px';
								dom.style.left = document.body.clientWidth / 2 - 250 + 'px';
								dom.style.opacity = 1;
							}
							dom.style.zIndex = ++this.$store.state.message_window_index;
							var a = this.$store.state.message_window[i];
							a.show = 1;
							this.$store.state.message_window.splice(i, 1, a);
							return;
						} else if (i == this.$store.state.message_window.length - 1) {
							this.$store.state.message_window.push({
								user: this.$store.state.chat.messages.friendlist[bindex].friends[sindex],
								show: 1
							});
							return;
						}
					}
				}

			},
		}
	})

</script>
<style scoped>
	.content {
		width: 660px;
		min-height: 100px;
	}
	
	.classname {
		line-height: 40px;
		font-size: 24px;
		border: 1px solid #f2f2f2;
		text-indent: 100px;
		background: #ddd;
		cursor: pointer;
	}
	
	ul {
		transition: all .5s;
		overflow: hidden;
	}
	
	ul.active {
		height: 0!important;
		opacity: 0;
	}
	
	li.noborder {
		border: none;
	}
	
	li {
		height: 60px;
		border-top: 1px solid #fff;
	}
	
	li>p>img {
		float: left;
		height: 40px;
		width: 40px;
		border-radius: 50%;
		margin-top: 10px;
		overflow: hidden;
	}
	
	.messagecontent {
		float: left;
		width: 400px;
		line-height: 60px;
		margin-left: 30px;
		color: #333;
	}
	
	.enterroom {
		float: right;
		width: 50px;
		height: 24px;
		line-height: 24px;
		background: #aaa;
		color: #fff;
		text-align: center;
		border-radius: 3px;
		cursor: pointer;
		margin-top: 18px;
	}
	
	.enterroom:hover {
		background: #fff;
		color: #333;
	}
	
	span.friendname {
		line-height: 40px;
		color: #333;
		margin-left: 10px;
		font-size: 12px;
	}

</style>
