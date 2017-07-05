import vm from 'src/main.js'
import mpIM from '../mpIM'
var con = vm.$store.state.chat.conversation

var Revoke = {
	handle_revoke(message) {
		var uid = message.revoke_body.msg_uid,
			flag = 0;
		//查找匹配的uid并设置,需要优化
		for (var i = 0, l = con.length; i < l; i++) {
			for (var im = 0, jm = con[i].msg.length; im < jm; im++) {
				if (con[i].msg[im].uid) {
					if (con[i].msg[im].uid == uid && con[i].msg[im].revoke == false) {
						flag = 1;
						break;
					}
				}
			}
			if (flag)
				break;
		}
		if (flag) {
			//设置此条消息已撤回
			con[i].msg[im].set_revoke(message.revoke_body.sender, message.revoke_body.content);
		}
	},
	send_revoke(conversation_index, msg_index, content) {
		var targetType = con[conversation_index].isGroup ? 1 : 0,
			body = {
				revoke_body: {
					msg_uid: con[conversation_index].msg[msg_index].uid,
					sender: {
						id: con[conversation_index].me.id,
						no: con[conversation_index].me.no,
						name: con[conversation_index].me.name,
						head_img: con[conversation_index].me.headimg
					},
					content: content,
				},
				type: 2,
				time: Date.now(),
				target_type: targetType,
				target_id: con[conversation_index].other.id,
				target_no: con[conversation_index].other.no - 0,
			}
		mpIM.send(body);
		con[conversation_index].msg[msg_index].set_revoke(body.revoke_body.sender, body.revoke_body.content)
	},

}

export default Revoke;
