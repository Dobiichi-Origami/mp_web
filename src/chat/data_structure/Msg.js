//构造conversation的msg对象结构体
import vm from 'src/main.js'
class Msg {
	constructor(index, type, content, speak_type, time, me, temp, uid) {
		if (!type) {
			this.content = content;
			this.content_type = "TXT";
		} else if (type == 1) {
			this.content_type = "IMAGE"
			if (content.url) {
				this.url = content.url;
				this.id = content.id;
			} else {
				this.url = JSON.parse(content).remoteUrl;
			}
			//不存自己发的图片的reply
			if (me) {
				for (var i = 0; i < vm.$store.state.chat.conversation[index].msg.length; i++) {
					if (vm.$store.state.chat.conversation[index].msg[i].url == this.url) {
						vm.$store.state.chat.conversation[index].msg[i].uid = uid;
						return;
					}
				}
			}
		} else if (type == 2) {
			this.content = JSON.parse(content)
			this.content_type = "MAGIC_PIC"
		} else if (type == 3) {
			this.content = JSON.parse(content)
			this.content_type = "REDPACK"
		} else if (type == 4) {
			this.content = JSON.parse(content)
			this.content_type = "gift_message"
		}
		if (speak_type == 0)
			this.chat_type = "MEMBER"
		else if (speak_type == 1)
			this.chat_type = "SELF"
		else if (speak_type == 2)
			this.chat_type = "SYSTEM"
		else if (speak_type == 3) {
			this.chat_type = "DESCRIPTION"
		}
		this.me = me;
		this.time = time;
		if (uid)
			this.uid = uid;
		if (temp && !vm.$store.state.chat.conversation[index].temp) {
			vm.$store.state.chat.conversation[index].temp = temp;
		}
		this.revoke = false;
		//存储	
		vm.$store.state.chat.conversation[index].msg.push(this);
		console.log(index, vm.$store.state.chat.conversation)
	}

	//谁发的消息
	set_from(who) {
		if (who) {
			this.speaker = who;
		} else {
			this.me = true;
		}
	}

	//是否撤回
	set_revoke(sender, content) {
		console.log(this, '% % % % %')
		this.revoke = true;
		this.revoke_user = sender;
		this.revoke_content = content ? content : '';
	}

	//设置此条消息的atList数组
	set_atList(atList) {
		this.atList = atList;
	}
}


export default Msg;
