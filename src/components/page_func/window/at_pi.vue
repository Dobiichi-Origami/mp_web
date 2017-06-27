<template>
   <transition name="anime">
    <div class="show_img" v-show="$store.state.show_at" @click.stop="f_hide_pi($event)">
			<div class="container">	
				<div class="pi_chu">
					<ul class="pi_list">
						<li v-for="(list,listindex) in all_members_list" @click.stop="add_at(listindex)">
							<img :src="list.headimg">
							<h3>{{list.name}}</h3>
							<span :style="{background:title_bg(list.group_member_type)}" v-if="list.title">{{list.title}}</span>
							<p>NO.{{list.no}}</p>
						</li>
					</ul>
				</div>
			</div>
		</div>
   </transition>
</template>
<script>
	export default ({
		data() {
			return {
				all_members_list:[]
			}
		},
		mounted:function(){
			this.$http({
					method: 'get',
					url: 'http://test.mrpyq.com/api/group/members_in_group',
					params: {
						'access_token': localStorage.getItem('access_token'),
						'id': this.$store.state.group_id,
						'page': 1,
					},
					emulateJSON: true,
				}).then((res) => {
					console.log("test*******",res.body);
					var s = res.body.items,
						n = 1;
					console.log();
					for (var i = 0; i < s.length; i++) {
						console.log(s[i].title)
						if (!s[i].title) {
							n = i;
							console.log(n)
							break;
						}
					}
					var a = [];
					for (var i = n; i < s.length; i++) {
						if (s[i].title) {
							a.push(s[i]);
							s.splice(i, 1);
							i--;
						}
					}
					for (var i = 0; i < a.length; i++) {
						s.splice(n, 0, a[i])
					}
					this.all_members_list = s;
					this.all_members_show = true;
				})
		},
		methods:{
			title_bg: function(type) {
				if (type == 20) {
					return '#fc9934'
				} else if (type == 10) {
					return '#4eae4d'
				} else {
					return '#3dcbef'
				}
			},

			add_at:function(listIndex){
				//将选中的用户放入当前会话的临时atList中
				var con = this.$store.state.chat.conversation[this.$store.state.chat.at_current_con_index];
				console.log("@对应的当前会话：", con );
				var current_member = this.all_members_list[listIndex];
				var user = {
					id:current_member._id,
   					no:current_member.no,
    				name:current_member.name,
    				head_img:current_member.headimg
				}
				con.tempAtList.push(user);
				console.log("tempAtList:   ", con.tempAtList);
				this.$store.state.show_at = false;
			},
			f_hide_pi:function(event) {
				this.$store.state.show_at = false;
			}
		}
	})
</script>
<style scoped>
	.container {
		margin-top: 25vh!important;
		width: 400px;
		height: 490px;
		background: #fff;
		margin: 0 auto;
		overflow: hidden;
		border-radius: 5px;
		position: relative;
	}
	.pi_chu {
		width: 600px;
		height: 490px;
		overflow-x: hidden;
		overflow-y: scroll;
		background: #fff;
		margin: 0 auto;
	}
	
	.pi_chu ul {
		width: 400px;
	}
	
	.pi_chu ul>li {
		height: 70px;
		padding-left: 10px;
		border-bottom: 1px solid #ccc;
		cursor: pointer;
	}
	
	.pi_chu ul>li:hover {
		background: #f2f2f2;
	}
	
	.pi_list li>img {
		float: left;
		margin-top: 7px;
		height: 56px;
		width: 56px;
		border-radius: 50%;
		margin-right: 10px;
	}
	
	.pi_list li>h3 {
		float: left;
		display: table;
		font-size: 16px;
		line-height: 16px;
		margin-top: 15px;
		font-weight: normal;
		color: #000;
	}
	
	.pi_list li>span {
		float: left;
		padding: 0 5px;
		background: #ccc;
		border-radius: 3px;
		margin-top: 13px;
		margin-left: 10px;
		font-size: 12px;
		line-height: 22px;
		color: #fff;
	}
	
	.pi_list li>p {
		float: left;
		width: 317px;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		font-size: 14px;
		line-height: 14px;
		height: 14px;
		margin-top: 10px;
	}
	
	.show_img {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		transition: 0.2s;
		padding-top: 20px;
		z-index: 99999999;
	}
	
	.show_img img {
		display: block;
	}
	
	.anime-enter,
	.anime-leave-to {
		opacity: 0;
	}
</style>
