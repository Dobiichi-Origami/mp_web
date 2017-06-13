<template>
    <div id="box">
    	<h1>群聊demo</h1>
    	<div class="content">
    		<div v-for="(item, index) in items" class="qunList">
    			<p><img :src="item.headimg" alt=""><span>{{item.name}}no.{{item.no}}</span>
    			<span @click="test(4, index)">发消息</span>
		    	<span @click="test(5, index)">发魔法表情</span>
		    	<section>
		    		<span @click="test(6, index)">发图片</span>	
		    	</section>
    		</p>
    		</div>
    		<br>
    		<h2>群通知</h2>
			<div v-for="item in $store.state.chat.cmd_msg.groupCmd" class="qunCmd">
				<p v-if="item.name == 'group_join'">
					<img :src="item.data.applyUserHeadimg" alt=""><span>{{item.data.applyUserName}}no.{{item.data.applyUserNo}}申请入{{item.data.groupName}}</span>
					<span>理由:{{item.data.applyInfo}}</span><button>同意</button>|<button>拒绝</button><span>当前状态:{{item.data.status}}</span>
				</p>
				<p v-else-if="item.name == 'group_quit'">
					<img :src="item.data.applyUserHeadimg" alt=""><span>{{item.data.applyUserName}}no.{{item.data.applyUserNo}}已退出前端|时间:{{item.data.applyDate}}</span>
				</p>
				<p v-else-if="item.name == 'group_invite'">
					<img :src="item.data.groupHeadimg" alt=""><span>{{item.data.groupName}}:邀请你加入<button @click="agree_group_invite(item.data)">同意</button><button>忽略</button>|时间:{{item.data.applyDate}}</span>
				</p>
				<p v-else-if="item.name == 'group_kick'">
					<img :src="item.data.groupHeadimg" alt=""><span>{{item.data.groupName}} 已将{{item.data.targetUserName}}no.{{item.data.targetUserNo}}移出群|时间:{{item.data.applyDate}}</span>
				</p>
				<p v-else-if="item.name == 'admin_cancel'">
					<img :src="item.data.groupHeadimg" alt=""><span>{{item.data.groupName}} 已取消{{item.data.targetUserName}}no.{{item.data.targetUserNo}}管理员身份|时间:{{item.data.applyDate}}</span>
				</p>
				<p v-else-if="item.name == 'admin_setting'">
					<img :src="item.data.groupHeadimg" alt=""><span>{{item.data.groupName}} 已将{{item.data.targetUserName}}no.{{item.data.targetUserNo}}设置为管理员|时间:{{item.data.applyDate}}</span>
				</p>
				<p v-else-if="item.name == 'group_transfer'">
					<img :src="item.data.groupHeadimg" alt=""><span>{{item.data.groupName}} {{item.data.targetUserName}}no.{{item.data.targetUserNo}}已成为新群主|时间:{{item.data.applyDate}}</span>
				</p>
				<p v-else-if="item.name == 'group_silenced'">
					<img :src="item.data.groupHeadimg" alt=""><span>{{item.data.groupName}} 管理员
					<span v-if="item.data.silenced == 0">关闭</span><span v-else>开启</span>
					全员禁言</span>
				</p>
			</div>
    	</div>
    </div>
</template>

<script>
	import chat from "src/chat"
	export default {
		data() {
			return {
				items: this.$store.state.chat.messages.grouplist,
				cmd_msg: this.$store.state.chat.cmd_msg.groupCmd,
				/*[{
						"stat": {
							"member": 3,
							"user": 13
						},
						"_id": "58febe821893be66dd56d39e",
						"description": "尴尬",
						"use_group_users": true,
						"no": "104746",
						"poster": "http://7x2wk4.com2.z0.glb.qiniucdn.com/FmZNV1UMgZlfJg3THPrmb4bwuqBl-large",
						"signature": "B618814E-15FC-417B-B2ED-EAC4F388CFCD",
						"recruit": "哥哥的方法",
						"is_added": true,
						"member": {
							"me": true,
							"name": "江户川·柯南",
							"no": 203,
							"title": null,
							"group_member_type": 1,
							"headimg": "http://7x2wk4.com2.z0.glb.qiniucdn.com/FpV6hSWLlQEbrBBQ-jgGliH6PmSD-head",
							"device": {
								"_id": "582ac3be6e998f2d8573ab60"
							},
							"_id": "5512e12dfbe78e06ff33ea0d",
							"original": false
						},
						"max_member": 50,
						"isdeleted": false,
						"headimg": "http://7x2wk4.com2.z0.glb.qiniucdn.com/FhCliI-yC3Nh0G1ujyF9KHQgUXCq-head",
						"categories": [],
						"recommend": 0,
						"owner": {
							"device": {
								"_id": "58252d066e998f6bfd67f783"
							},
							"user": {
								"_id": "552239d1fbe78e7aea14a870"
							},
							"no": 43
						},
						"isrecruit": 1,
						"time": {
							"create": 1493089923964,
							"recruit": 1493089978306
						},
						"tags": [],
						"name": "前端2群"
					},
					{
						"stat": {
							"member": 8,
							"user": 26
						},
						"_id": "58f9e1bb1893be66b87b762e",
						"description": "红红火火恍恍惚惚1",
						"use_group_users": true,
						"no": "104743",
						"poster": "http://7x2wk4.com2.z0.glb.qiniucdn.com/Fq-4V9T_1d7iEbHI_e6ZMx9GcGcU-large",
						"signature": "62EAFD6C-87B3-497C-80EB-8A3F7ABC39A1",
						"recruit": "哈哈哈哈哈",
						"is_added": true,
						"member": {
							"me": true,
							"name": "折原临也",
							"no": 234,
							"title": null,
							"group_member_type": 10,
							"headimg": "http://7x2wk4.com2.z0.glb.qiniucdn.com/FtEZiqamIZdYd8Rb4biDsi0EPtrA-head",
							"device": {
								"_id": "582ac3be6e998f2d8573ab60"
							},
							"_id": "551d812efbe78e6ec27b1049",
							"original": false
						},
						"max_member": 50,
						"isdeleted": false,
						"silenced": 0,
						"categories": [],
						"recommend": 0,
						"owner": {
							"device": {
								"_id": "58252d066e998f6bfd67f783"
							},
							"user": {
								"_id": "551d812efbe78e6ec27b1049"
							},
							"no": 230
						},
						"headimg": "http://7x2wk4.com2.z0.glb.qiniucdn.com/FrC7GgIdO4ZYeB7NQDfbjFeP4WyJ-head",
						"isrecruit": 1,
						"time": {
							"create": 1492771260346,
							"recruit": 1492771582141,
							"silenced": 1493009011070
						},
						"tags": [],
						"name": "前端"
					}
				],*/
			}
		},
		methods: {
			agree_group_invite: function (data) {//同意群邀请

				//查看个人的所有群信息
			this.$http({
					method: 'get',
					url: 'http://test.mrpyq.com/api/group/agree_join',
					params: {
						'access_token': localStorage.getItem('access_token'),
						'id': data.groupId,
						'userid': data.targetUserId,
						'invite_deviceid': data.applyUserHxId,
						'invite_userid': data.applyUserId,
						'invite_time': data.applyDate,
						'invite_key': data.inviteKey,
					},
					emulateJSON: true,
				}).then(
					res => {
						console.log(res.body);
						if (res.body.error) {
							vm.$store.state.f_error(vm.$store.state, res.body.error);
						}
						
						else if (res.body.code == "join_success") {//进群成功
							//将该通知的data.status属性设为1
							data.state= 1;
							//发出文本通知
							console.log("进群成功");
							var flag = 0;
							var group;
							//如果本账号有在此群扮演过，则在groupList中可以找到对应的group
							for (var i = 0,l = this.items.length;i < l;i++) {
								if (this.items[i]._id == data.groupId) {
									//找到群后取出此群信息
									flag = 1;
									group = this.items[i];
									break;
								}
							}
							if (flag == 0) {//没有在该群扮演过
								//造一个group的信息传给chat的start()
								group = {
									"_id": data.groupId,
									"no": data.groupNo,
									"headimg": data.groupHeadimg,
									"name": data.groupName,
									"member": {
										"name": data.targetUserName,
										"no": data.targetUserNo,
										"title": null,
										"group_member_type": 1,
										"headimg": data.targetUserHeadimg,
										"device": {
											"_id": data.targetUserHxId
										},
										"_id": data.targetUserId,
										"original": false
									}
								};
							}
							

							var conIndex = chat.start(group);
							chat.send(conIndex, 0, data.targetUserName + " 加入该群", 3, 0);
							
						}
					},
					res => {//500报错
						vm.$store.state.f_error(vm.$store.state, "服务器正在开小差。。。");
				});
			},

			ignore: function (data) {
				data.state = 2;
			},
			test: function(type, index) {
				var conIndex = chat.start(this.items[index]);

				if (type == 4) {
					chat.send(conIndex, 0, "可爱\n可爱", 0, 0);
				}
				if (type == 5) {
					chat.send_magicimg(conIndex, 1);
				}
				if (type == 6) {
					if (this.$store.state.chat.selected_img)
						console.log('******************')
					chat.send(conIndex, 1, this.$store.state.chat.selected_img, 0, 0);
				}
			},
		},
		components: {

		}
	}

</script>

<style scoped="true">
	div #box {
		width: 660px;
		margin-top: 0;
		min-height: 800px;
		background: #aaa;
		font-size: 22px;
	}
	
	img {
		width: 80px;
		height: 80px;
	}
	
	h1 {
		text-align: center;
	}
	
	p {	
		border-bottom: 1px solid #333;
	}
	
	

	
</style>
