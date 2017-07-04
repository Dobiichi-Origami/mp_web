import vm from 'src/main.js'
var chat = vm.$store.state.chat
var Cmd = {
	handle_cmd(msg) {
		var cmd_body = msg.cmd_body;
		for (let i in chat.cmd_msg.friendCmdType) {
			if (chat.cmd_msg.friendCmdType[i] == cmd_body.action) {
				chat.cmd_msg.friendCmd.unshift(cmd_body);
				Cmd[cmd_body.action](cmd_body);
				break;
			}
		}
		for (let i in chat.cmd_msg.groupCmdType) {
			if (chat.cmd_msg.groupCmdType[i] == cmd_body.action) {
				chat.cmd_msg.groupCmd.unshift(cmd_body);
				Cmd[cmd_body.action](cmd_body);
				break;
			}
		}
	},
	couple_apply(cmd) {
		console.log(cmd);
	},
	couple_divorce(cmd) {
		console.log(cmd);
	},
	couple_force_divorce(cmd) {
		console.log(cmd);
	}
}

export default Cmd;
