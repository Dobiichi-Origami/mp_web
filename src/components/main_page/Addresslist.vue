<template>
	<div class="content" >
		<div class="ajax-loader" v-show="$store.state.loader"></div>
		<div v-show="$store.state.messages.friendlist.length" class="content_content">
			<div :class="{tofriend:true,active:act}" @click="check_friend">好友列表<div></div></div>
			<div :class="{togroup:true,active:!act}" @click="check_group">群组<div></div></div>
			<div class="classname" v-show="friendorgroup">
				<div  v-for="(blist,bindex) in this.$store.state.messages.friendlist">

					<div @click="bianxiao($event)" :data-index="bindex" class="listtitle"><img src="~assets/chat/pull_list.png" alt=""  :data-index="bindex" @click.stop="bianxiao($event)">{{blist.name}}</div>
					<ul :id="'class'+bindex" class="active classcontent" :style="{height:blist.friends.length*55+'px'}">
						<li v-for="(slist,sindex) in blist.friends" :class="{noborder:sindex==0}">
							<img :src="slist.headimg" alt="">
							<div class="friendinfo">
								<p class="friendname">{{slist.name}}<span>NO.{{slist.no}}</span></p>

								<span class="messagecontent">{{slist.content}}</span>
							</div>
							<span @click="openwindow($event,bindex,sindex)" :data-index="slist.user._id" class="enterroom">聊天</span>
						</li>
					</ul>
				</div>
			</div>
			<div class="groupname" v-show="!friendorgroup">
				<div  v-for="(blist,bindex) in this.$store.state.messages.grouplist">
					<img :src="blist.headimg" alt="">
					<div class="friendinfo">
						<p class="friendname">{{blist.name}}</p>
						<span class="messagecontent">{{blist.description}}</span>
					</div>
					<span @click="opengroup($event,bindex)" :data-index="blist._id" class="enterroom">进入</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import chat from "src/chat"
	export default ({
		data() {
			return {
				//好友列表和群组列表开关
				act: true,
				//好友列表和群组列表组件显示
				friendorgroup: true,
			}
		},
		mounted: function() {
			if (this.$store.state.current_user) {
				this.$store.state.friendcenter_mounted(this.$store.state, this);
			}
			console.log(this.$store.state.messages.grouplist)
		},
		methods: {
			bianxiao: function(event) {
				var index = event.target.dataset.index;
				var dom = document.querySelector('#class' + index);
				console.log(index)
				if (dom.className == '') {
					dom.className = 'active';
					dom.previousElementSibling.children[0].className = '';
				} else {
					dom.className = '';
					dom.previousElementSibling.children[0].className = 'active';
				}

			},
			check_friend: function() {
				this.act = true;
				this.friendorgroup = true;
			},
			check_group: function() {
				this.act = false;
				this.friendorgroup = false;
			},
			opengroup: function(event, bindex) {
				var id = event.target.dataset.index;
				console.log(this.$store.state.messages.grouplist[bindex])
				var index = chat.start(this.$store.state.messages.grouplist[bindex]);
				if (this.$store.state.message_window.length == 0) {
					this.$store.state.message_window.push({
						group: this.$store.state.messages.grouplist[bindex],
						show: 1,
						index: index,
					});
					this.$store.state.message_ball.unshift({
						group: this.$store.state.messages.grouplist[bindex],
						show: 1,
						index: index,
					});
				} else {
					for (var i = 0; i < this.$store.state.message_window.length; i++) {
						if(this.$store.state.message_window[i].group){
							if (id == this.$store.state.message_window[i].group._id) {
								var dom = document.querySelector('#win' + id);
								var w = parseInt(window.getComputedStyle(dom).width);
								if (w != 500) {
									dom.style.transition = "all 1s";
									dom.style.width = "500px";
									dom.style.height = '611px';
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
							}else if (i == this.$store.state.message_window.length - 1) {
							this.$store.state.message_window.push({
								group: this.$store.state.messages.grouplist[bindex],
								show: 1,
								index: index,
							});
							this.$store.state.message_ball.unshift({
								group: this.$store.state.messages.grouplist[bindex],
								show: 1,
								index: index,
							});
							return;
						}
						}
						 else if (i == this.$store.state.message_window.length - 1) {
							this.$store.state.message_window.push({
								group: this.$store.state.messages.grouplist[bindex],
								show: 1,
								index: index,
							});
							this.$store.state.message_ball.unshift({
							group: this.$store.state.messages.grouplist[bindex],
							show: 1,
							index: index,
						});
							return;
						}
					}
				}
			},
			openwindow: function(event, bindex, sindex) {
				var id = event.target.dataset.index;
				var index = chat.start(this.$store.state.messages.friendlist[bindex].friends[sindex]);
				if (this.$store.state.message_window.length == 0) {
					this.$store.state.message_window.push({
						user: this.$store.state.messages.friendlist[bindex].friends[sindex],
						show: 1,
						index: index,
					});
					this.$store.state.message_ball.unshift({
						user: this.$store.state.messages.friendlist[bindex].friends[sindex],
						show: 1,
						index: index,
					});
				} else {
					for (var i = 0; i < this.$store.state.message_window.length; i++) {
						if(this.$store.state.message_window[i].user){
							if (id == this.$store.state.message_window[i].user.user._id) {
								var dom = document.querySelector('#win' + id);
								var w = parseInt(window.getComputedStyle(dom).width);
								if (w != 500) {
									dom.style.transition = "all 1s";
									dom.style.width = "500px";
									dom.style.height = '611px';
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
									user: this.$store.state.messages.friendlist[bindex].friends[sindex],

									show: 1,
									index: index,
								});
								this.$store.state.message_ball.unshift({
									user: this.$store.state.messages.friendlist[bindex].friends[sindex],
									show: 1,
									index: index,
								});
								return;
							}
						}else if (i == this.$store.state.message_window.length - 1) {
							this.$store.state.message_window.push({
								user: this.$store.state.messages.friendlist[bindex].friends[sindex],

								show: 1,
								index: index,
							});
							this.$store.state.message_ball.unshift({
								user: this.$store.state.messages.friendlist[bindex].friends[sindex],
								show: 1,
								index: index,
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
		min-height: 1px;
	}
	
	.content_content {
		background: #fff;
		overflow: hidden;
		border: 1px solid #ededed;
		padding-bottom: 200px;
		box-shadow: 1px 1px 6px #333;
	}
	
	.listtitle,
	.groupname>div {
		height: 56px;
		border-bottom: 1px solid #ebebeb;
		line-height: 56px;
		font-size: 16px;
		color: #555;
		cursor: pointer;
	}
	
	.listtitle {
		text-indent: 30px;
		position: relative;
	}
	
	.listtitle:hover {
		background: #ccc;
	}
	
	.listtitle>img {
		display: block;
		position: absolute;
		width: 15px;
		left: 5px;
		top: 23px;
		-webkit-transform: rotateZ(-90deg);
		-ms-transform: rotateZ(-90deg);
		-o-transform: rotateZ(-90deg);
		transform: rotateZ(-90deg);
		transition: transform .5s;
	}
	
	.listtitle>img.active {
		-webkit-transform: rotateZ(0deg);
		-ms-transform: rotateZ(0deg);
		-o-transform: rotateZ(0deg);
		transform: rotateZ(0deg);
	}
	
	.classname,
	.groupname {
		margin-left: 10px;
		float: left;
		width: 640px;
	}
	
	ul {
		transition: all .5s;
		overflow: hidden;
	}
	
	ul.active {
		height: 0!important;
		opacity: 0;
	}
	
	ul>li {
		height: 54px;
		border-bottom: 1px solid #ebebeb;
		border-top: none;
		overflow: hidden;
		background: #fafafa;
	}
	
	ul>li>img,
	.groupname img{
		float: left;
		width: 34px;
		height: 34px;
		border-radius: 50%;
		margin: 10px 0 0 10px;
	}
	
	.friendinfo {
		float: left;
		width: 490px;
		height: 38px;
		margin-top: 8px;
		margin-left: 10px;
		border-right: 1px solid #ebebeb;
	}
	
	.friendname {
		display: block;
		font-size: 14px;
		color: #343434;
		line-height: 20px;
	}
	
	.friendname>span {
		color: #999;
		font-size: 12px;
		margin-left: 5px;
	}
	
	.messagecontent {
		display: block;
		width: 490px;
		font-size: 12px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		color: #999;
		line-height: 24px;
	}
	
	.enterroom {
		float: left;
		height: 100%;
		line-height: 56px;
		width: 80px;
		margin-left: 10px;
		text-indent: 38px;
		cursor: pointer;
		font-size: 14px;
		background: url(~assets/chat/enterroom.png) 10px center no-repeat;
		background-size: 20px;
	}
	
	.tofriend,
	.togroup {
		width: 50%;
		background: #ededed;
		color: #b3b3b3;
		height: 56px;
		font-size: 16px;
		line-height: 56px;
		float: left;
		text-align: center;
		/*text-indent: 20px;*/
		text-indent: 35px;
		position: relative;
		cursor: pointer;
		border-bottom: 1px solid #ebebeb;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
	}
	
	.tofriend {
		border-right: 1px solid #ccc;
		border-right: 1px solid #ebebeb;
		background: url('~assets/chat/friendlist2.png') 115px center no-repeat #fff;
	}
	
	.togroup {
		background: url('~assets/chat/grouplist2.png') 120px center no-repeat #fff;
	}
	
	.tofriend>div,
	.togroup>div {
		width: 20%;
		background: #132b4d;
		height: 2px;
		position: absolute;
		bottom: 0;
		left: 40%;
		display: none;
	}
	
	.tofriend.active,
	.tofriend:hover {
		background: url('~assets/chat/friendlist1.png') 115px center no-repeat #fff;
		color: #333238;
	}
	
	.togroup.active,
	.togroup:hover {
		background: url('~assets/chat/grouplist1.png') 120px center no-repeat #fff;
		color: #333238;
	}
	.tofriend.active>div,
	.togroup.active>div {
		display: block;
	}
	.groupname>div {

	}

</style>
