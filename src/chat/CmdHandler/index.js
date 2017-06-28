import vm from 'src/main.js'
import RongIM from '../RongSDK_helper/RongIM'
import chat from '../index.js'
import Msg from '../data_structure/Msg'

var Rong = new RongIM();
var con = vm.$store.state.chat.conversation;
var CmdHandler = {
	//  通知消息数目自增
	cmd_count_add: function () {
		//判断通知是否已读
		if (!vm.$store.state.unread_msg('system', vm.$store.state)) {
			vm.$store.state.chat.cmd_msg.count++;
			vm.$store.state.unread++;
			console.log('通知消息数目:', vm.$store.state.chat.cmd_msg.count);
		}
	},

	//	msg_revoke
	R_revoke: function (message) {
		var tagertId = message.content.data.revokeMsgUid,
			flag = 0;
		//查找匹配的uid并设置,需要优化
		for (var i = 0, l = con.length; i < l; i++) {
			for (var im = 0, jm = con[i].msg.length; im < jm; im++) {
				if (con[i].msg[im].uid) {
					if (con[i].msg[im].uid == tagertId) {
						flag = 1;
						break;
					}
				}
			}
			if (flag)
				break;
		}
		//设置此条消息已撤回
		con[i].msg[im].set_revoke(message.content.data);
	},
	S_revoke: function (i, im, content) {
		//设置此条消息已撤回
		con[i].msg[im].set_revoke();
		var data = {
			applyUserName: con[i].me.name,
			applyUserNo: con[i].me.no + "",
			applyUserId: con[i].me.id,
			revokeMsgUid: con[i].msg[im].uid,
			applyContent: content,
		};
		Rong.sendMessageCmdRevoke(data, "msg_revoke", con[i])
	},
	//存结婚请求，离婚请求
	R_couple: function (message) {
		var msg = {};
		msg.data = message.content.data;
		msg.name = message.content.name;
		//查重
		var flag = 0;
		for (var i = 0, l = vm.$store.state.chat.cmd_msg.friendCmd.length; i < l; i++) {
			if (vm.$store.state.chat.cmd_msg.friendCmd[i].name == msg.name && vm.$store.state.chat.cmd_msg.friendCmd[i].data.targetUserId == msg.data.targetUserId && vm.$store.state.chat.cmd_msg.friendCmd[i].data.targetUserName == msg.data.targetUserName) {
				flag = 1;
				break;
			}
		}

		if (flag) {
			vm.$store.state.chat.cmd_msg.friendCmd.splice(i, 1);
			vm.$store.state.chat.cmd_msg.friendCmd.unshift(msg);
		} else { //不存在重的情况下添加的新通知需要使count加1
			vm.$store.state.chat.cmd_msg.friendCmd.unshift(msg);
			this.cmd_count_add();
		}
		console.log('好友通知数组:', vm.$store.state.chat.cmd_msg.friendCmd);

		// //判断通知是否已读
		// if(!vm.$store.state.unread_msg('system',vm.$store.state)){
		// 	vm.$store.state.chat.cmd_msg.count++;
		// }
	},

	//同意拒绝结婚请求,index为cmd_msg的序号
	couple_reply: function (name, index, status, reject_reason) {
		var flag, status_;
		if (name == "couple_apply_reply") {
			flag = status;
		} else if (name == "couple_divorce_reply") {
			flag = "broke_" + status;
		}
		//接口，客户端用的名字不一样，麻烦
		if (status == "accept")
			status_ = "agree"
		else
			status_ = status;
		console.log(vm.$store.state.chat.cmd_msg.friendCmd[index]);
		vm.$http.get("http://test.mrpyq.com/api/cp/" + flag, {
			params: {
				access_token: localStorage.getItem('access_token'),
				applyid: vm.$store.state.chat.cmd_msg.friendCmd[index].data.inviteKey,
			}
		}).then(
			res => {
				if (res.body.error) {
					vm.$store.state.plugin.f_error(vm.$store.state, res.body.error);
				}
				//服务器数据已改，发通知
				else if (res.body.result) {
					if (reject_reason && status == "reject") {
						vm.$store.state.chat.cmd_msg.friendCmd[index].data.optInfo = reject_reason;
					}
					vm.$store.state.chat.cmd_msg.friendCmd[index].data.status = status_;
					vm.$store.state.chat.cmd_msg.friendCmd[index].data.gmtModified = new Date().getTime();
					Rong.sendMessageCmdCouple(vm.$store.state.chat.cmd_msg.friendCmd[index].data, name.slice(0, name.length - 6), vm.$store.state.chat.cmd_msg.friendCmd[index].data.applyUserHxId)
				}
			},
			res => {
				vm.$store.state.plugin.f_error(vm.$store.state, "服务器正在开小差。。。");
			}
		)
	},
	// <<<<<<< HEAD
	// 	//同意拒绝离婚请求,index为cmd_msg的序号协议离婚
	// 	couple_divorce: function (index, status, reject_reason) {
	// 	},
	//通过群id查到会话数组中的属于该群的会话index
	findGroupCon: function (groupId) {
		var conversations = vm.$store.state.chat.conversation;
		var conversation;
		var index;
		for (var i = 0, l = conversations.length; i < l; i++) {
			//只判断群会话中other.id是否与groupId相同
			if (conversations[i].isGroup && conversations[i].other.id == groupId) {
				// conversation = conversations[i];
				index = i;
				break;
			}
		}
		return index;
	},

	// 接收群通知
	R_group: function (message) {
		var cmd_msg = vm.$store.state.chat.cmd_msg.groupCmd;
		var content = {
			data: message.content.data,
			name: message.content.name
		};
		var flag = 0; //0为不在，1为在
		//判断群通知在cmd_msg数组中是否存在
		for (var i = 0, l = cmd_msg.length; i < l; i++) {
			if (content.name == "group_join" || content.name == "group_quit") {
				if (content.name == cmd_msg[i].name && content.data.applyUserId == cmd_msg[i].data.applyUserId && content.data.applyUserNo == cmd_msg[i].data.applyUserNo && content.data.groupNo == cmd_msg[i].data.groupNo) {
					flag = 1;
					break;
				}
			} else if (content.name == "group_invite") {
				if (content.name == cmd_msg[i].name && content.data.applyUserId == cmd_msg[i].data.applyUserId &&
					content.data.applyUserNo == cmd_msg[i].data.applyUserNo && content.data.groupNo == cmd_msg[i].data.groupNo &&
					content.data.targetUserId == cmd_msg[i].data.targetUserId && content.data.targetUserNo == cmd_msg[i].data.targetUserNo) {
					flag = 1;
					break;
				}
			} else if (content.name == "group_kick" || content.name == "admin_cancel" || content.name == "admin_setting" || content.name == "group_transfer") {
				if (content.name == cmd_msg[i].name && content.data.groupNo == cmd_msg[i].data.groupNo &&
					content.data.targetUserId == cmd_msg[i].data.targetUserId && content.data.targetUserNo == cmd_msg[i].data.targetUserNo) {
					flag = 1;
					break;
				}
			}
			// else if (content.name == "group_silenced") {
			// 	// //收到群禁言后更新对应群的群禁言状态
			// 	// var conversation = this.findGroupCon(content.data.groupId);
			// 	// chat.setSilenced(conversation, content.data.silenced);
			// 	// this.findGroupCon(content.data.groupId).set_silenced(content.data.silenced);

			// 	if (content.name == cmd_msg[i].name && content.data.groupId == cmd_msg[i].data.groupId) {
			// 		flag = 1;
			// 		break;
			// 	}
			// }
		}
		if (flag) { //存在的话替换
			cmd_msg.splice(i, 1);
			cmd_msg.unshift(content)
		} else { //不在的话添加
			cmd_msg.unshift(content);
			this.cmd_count_add();
		}

		//对禁言消息做处理
		if (content.name == "group_silenced") {
			//收到群禁言后更新对应群的群禁言状态
			var index = this.findGroupCon(content.data.groupId);
			var conversation = vm.$store.state.chat.conversation[index];
			if (conversation) {
				console.log('全员禁言的状态', content.data.silenced);
				chat.setSilenced(conversation, content.data.silenced);
				//在该会话中的msg数组中存入一条msg消息(系统)
				var time = new Date().getTime();
				var msg;
				if (content.data.silenced == 1) {
					msg = new Msg(index, 0, '管理员开启了全员禁言', 3, 0, time);
				} else {
					msg = new Msg(index, 0, '管理员关闭了全员禁言', 3, 0, time);
				}
			}
		}

		//对群主或管理员的邀请加群消息做处理
		if (content.name == "group_invite") {
			content.data.state = 0; //0未处理，1同意，2忽略
		}

		// //判断通知是否已读
		// if(!vm.$store.state.unread_msg('system',vm.$store.state)){
		// 	vm.$store.state.chat.cmd_msg.count++;
		// }

		console.log("打印通知消息数组:");
		console.log(vm.$store.state.chat.cmd_msg);
	}
}

export default CmdHandler;
