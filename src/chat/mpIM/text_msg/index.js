import vm from 'src/main.js'
import chat from 'src/chat/index.js'
import Msg from 'src/chat/data_structure/Msg'
var Text = {
	handle_text: function (message) {
		var index = chat.start(message, 1);
		if (index === undefined) {
			return;
		}
		var is_me_speak = message.chat_body.direction ? false : true,
			temp = message.chat_body.chat_is_friend ? 0 : 1;
		var msg = new Msg(index, message.chat_body.content_type, message.chat_body.content.content, message.chat_body.content.speakType, message.time, is_me_speak, temp, message.uid);

		//群消息需要设置发言人
		if (message.target_type == 1) { //为群会话消息，需要在msg中添加发言人信息
			var speaker = {
				speakerName: message.chat_body.sender.name,
				speakerHeadimg: message.chat_body.sender.head_img,
				speakerId: message.chat_body.sender.id,
				speakerNo: message.chat_body.sender.no,
				speakerTitle: message.chat_body.group_member_title,
			}

			speaker.memberType = Text.checkMemberType(message.target_id, message.sender_id);
			msg.set_from(speaker);
			if (message.chat_body.group_at_users) {
				msg.set_atList(message.chat_body.group_at_users);
			}
		}
		console.log('本地會話数组:', vm.$store.state.chat.conversation);
	},
	//根据群id和皮id判断此皮在群中的身份
	checkMemberType: function (groupId, userId) {
		//根据groupId找到对应群的群详细
		var memberType = 1;
		var groupDetail = this.findGroupDetail(groupId);

		if (groupDetail) {
			//先判断此皮是否是群主
			if (userId == groupDetail.owner._id) {
				memberType = 20;

			}
			//再判断此皮是否属于管理员组
			for (var j = 0, jl = groupDetail.admins.length; j < jl; j++) {
				if (groupDetail.admins[j]._id == userId) {
					memberType = 10;
					break;
				}
			}
		}
		return memberType;
	},
	//找到群详细数组中指定群ID的群详细项
	findGroupDetail: function (groupId) {
		var groupDetail;
		var groupsDetail = vm.$store.state.chat.messages.groupsDetail;
		for (var i = 0, l = groupsDetail.length; i < l; i++) {
			if (groupId == groupsDetail[i]._id) {
				groupDetail = groupsDetail[i];
				break;
			}
		}
		return groupDetail;
	},
}
export default Text;
