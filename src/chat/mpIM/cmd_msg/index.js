import vm from 'src/main.js'
var chat = vm.$store.state.chat
var Cmd = {
	handle_cmd(msg) {
		var cmd_body = msg.CMDBody;
		for (let i in chat.friendCmdType) {
			if (chat.friendCmdType[i] == cmd_body.action) {
				chat.friendCmd.unshift(msg);
				Cmd[action];
				break;
			}
		}
		for (let i in chat.groupCmdType) {
			if (chat.groupCmdType[i] == cmd_body.action) {
				chat.groupCmd.unshift(msg);
				Cmd[action];
				break;
			}
		}
	},

}

export default Cmd;
