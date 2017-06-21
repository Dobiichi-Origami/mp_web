//构造conversation的msg对象结构体
import vm from 'src/main.js'
class Msg {
	constructor(index, type, content_url, chat_type, temp, time, me) {
		this.me=me;
		console.log(index, type, content_url, chat_type, temp, time, me);
		if (!type) {
			this.content = content_url;
			this.content_type = "TXT";
		}
		//图片格式没有content，有额外的url
		else if (type == 1) {
			//添加本地图片id
			if(content_url.url){
				this.url = content_url.url;
				this.id=content_url.id;
			}else{
				this.url=JSON.parse(content_url).remoteUrl;
			}
			this.content_type = "IMAGE"
			//如果图片已经存在，就删除该消息(不生成此条消息)
			if(me){
				for(var i=0;i<vm.$store.state.chat.conversation[index].msg.length;i++){
					console.log(vm.$store.state.chat.conversation[index].msg[i].url, this.url)
					if(vm.$store.state.chat.conversation[index].msg[i].url==this.url){
						return;
					}
				}
			}
		} else if (type == 2) {
			this.content = JSON.parse(content_url)
			this.content_type = "MAGIC_PIC"
		} else if (type == 3) {
			this.content = content_url
			this.content_type = "REDPACK"
		} else if (type == 4) {
			this.content = content_url
			this.content_type = "gift_message"
		}
		if (chat_type == 0)
			this.chat_type = "MEMBER"
		else if (chat_type == 1)
			this.chat_type = "SELF"
		else if (chat_type == 2)
			this.chat_type = "SYSTEM"
		else if (chat_type == 3) {
			this.chat_type = "DESCRIPTION"
		}
		this.temp = temp;
		this.time = time;
		//响应revoke;
		this.revoke=false;
	
		//存储	
		vm.$store.state.chat.conversation[index].msg.push(this);
		console.log(this)
		console.log(index,vm.$store.state.chat.conversation)
	}
	//谁发的消息
	set_from(who) {
		if (who) {
			this.speaker = who;
		} else {
			this.me = true;
		}
	}
	//接受的消息的uid
	set_uid(uid) {
		this.uid = uid;
	}
	//是否撤回
	set_revoke(user) {
		this.revoke = true;
		if (user) {
			this.revoke_user = {
				name: user.applyUserName,
				no: user.applyUserNo,
				id: user.applyUserId,
				content: user.applyContent,
			}
		}
	}

	//设置此条消息的atList数组
	set_atList(atList) {
		this.atList = atList;
	}

	set_timeout() {
		this.isTimeout = true;
	}
	set_send_success() {
		this.send_success = true;
	}
}


export default Msg;
