import vm from 'src/main.js'
import base64 from '../../mpIM/tools/base64.js'

var chat = vm.$store.state.chat
var Cmd = {
	//cmdBody的部分信息需要解密，时间字符串转换等预处理
	pre_handle(cmdBody) {
		//cmd_msg的apply_info需要base64解密
		var apply_info = cmdBody.apply_info;
		if (apply_info) {
			cmdBody.apply_info = base64.base64ToString(apply_info);
		}
		//毫秒数转字符串
		var date = new Date();
		date.setTime(cmdBody.apply_date);
		cmdBody.timeString = date.toLocaleString();
	},
	dereplication(cmd, type) {
		//去重函数
		var flag = false;
		var sender = cmd.apply_user,
			receiver = cmd.target_user,
			action = cmd.action;
		if (type == 0) { //好友cmd
			var friendCmd = chat.cmd_msg.friendCmd;
			for (var i in friendCmd) {
				if (friendCmd[i].action == action && friendCmd[i].apply_user.id == sender.id && friendCmd[i].apply_user.no == sender.no &&
					friendCmd[i].target_user.id == receiver.id && friendCmd[i].target_user.no == receiver.no) {
					flag = true;
					break;
				}
			}
			if (!flag) { //不存在则左插
				friendCmd.unshift(cmd);

				chat.cmd_msg.count++;
			} else { //存在则替换
				friendCmd.splice(i, 1, cmd);
			}

		} else { //群cmd
			//暂未处理
		}
	},
	handle_cmd(msg) {
		var cmd_body = msg.cmd_body;
		//cmd_body的apply_info需要base64解密
		Cmd['pre_handle'](cmd_body);

		for (let i in chat.cmd_msg.friendCmdType) {
			if (chat.cmd_msg.friendCmdType[i] == cmd_body.action) {
				Cmd[cmd_body.action](cmd_body);
				break;
			}
		}

		for (let i in chat.cmd_msg.groupCmdType) {
			if (chat.cmd_msg.groupCmdType[i] == cmd_body.action) {
				Cmd[cmd_body.action](cmd_body);
				break;
			}
		}
		chat.cmd_msg.count++;

		console.log('friendCmd:', chat.cmd_msg.friendCmd);
		console.log('groupCmd:', chat.cmd_msg.groupCmd);
	},

	friend_apply(cmd) {
		//申请加好友通知
		//去重处理
		cmd.option = ["同意", "忽略"];
		console.log(cmd)
		Cmd['dereplication'](cmd, 0);
	},
	handle_friend_apply() {
		//同意或者忽略
	},

	friend_delete(cmd) {
		//删除好友的通知暂不做任何处理
	},
	couple_apply(cmd) {
		cmd.option = ["同意", "拒绝"];
		Cmd['dereplication'](cmd, 0);
	},
	couple_divorce(cmd) {
		Cmd['dereplication'](cmd, 0);
	},
	couple_force_divorce(cmd) {
		Cmd['dereplication'](cmd, 0);
	}
}
export default Cmd;
