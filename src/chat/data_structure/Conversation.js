//构造conversation结构体
import vm from 'src/main.js'
class Conversation {
	constructor(me, other) {
		this.me = {
			headimg: me.headimg,
			id: me.id,
			name: me.name,
			no: me.no,
		};
		this.other = {
			headimg: other.headimg, //私聊时为对方头像,群聊时为群头像
			id: other.id, //私聊时为对方id,群聊时为群id
			name: other.name, //私聊时为对方名字,群聊时为群名
			no: other.no, //私聊时为对方皮编号,群聊时为群编号
			deviceid: other.deviceid, //发送方设备id
		}
		this.msg = [];
		this.unreadCount=0;
	}
	set_title(title, group_member_type) {//设置本人的群头衔(和成员类型)
		this.me.selfTitle = title;
		this.me.member_type = group_member_type;
	}
	set_unreadCount() {
		this.unreadCount++;
		console.log('%%%%%%%%%%'+this.unreadCount+'%%%%%%%%%%%%%%%%%%%')
		vm.$store.state.unread++;
	}
	set_group(type) {
		this.isGroup = type;//是否是群组
	}
	set_silenced(status) {
		this.silenced = status;//会话中是否处于禁言状态(群组，管理员不需要禁言) ,0 未禁言，1 禁言中
	}
}
export default Conversation;
