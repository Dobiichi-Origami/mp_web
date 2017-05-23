import vm from 'src/main.js'
import chat from '../index.js'
class RongIM {
	sendMessageTxt(extra, content, conversation, msg_) {
		var msg = new RongIMLib.TextMessage({
			content: content,
			extra: extra
		});
		var targetId = conversation.other.deviceid;
		var conversationtype;
		if (conversation.isGroup)
			conversationtype = RongIMLib.ConversationType.GROUP; // 群聊,其他会话选择相应的消息类型即可。
		else
			conversationtype = RongIMLib.ConversationType.PRIVATE; // 私聊,其他会话选择相应的消息类型即可。

		this.send(conversationtype, targetId, msg, msg_)
	}

	sendMessageImg(extra, url, conversation, msg_) {
		var msg = new RongIMLib.ImageMessage({
			imageUri: url,
			extra: extra,
		});
		var targetId = conversation.other.deviceid;
		var conversationtype;
		if (conversation.isGroup)
			conversationtype = RongIMLib.ConversationType.GROUP; // 群聊,其他会话选择相应的消息类型即可。
		else
			conversationtype = RongIMLib.ConversationType.PRIVATE; // 私聊,其他会话选择相应的消息类型即可。

		this.send(conversationtype, targetId, msg, msg_)
	}
	sendMessageCmdRevoke(data, name, conversation) {
		var msg = new RongIMLib.CommandMessage({
			data: data,
			name: name,
		});
		var conversationtype = RongIMLib.ConversationType.PRIVATE;
		if (conversation.isGroup)
			conversationtype = RongIMLib.ConversationType.GROUP;

		var targetId = conversation.other.deviceid;
		this.sendCmd(conversationtype, targetId, msg)
	}

	sendMessageCmdCouple(data, name, targetId) {
		var msg = new RongIMLib.CommandMessage({
			data: data,
			name: name,
		});
		var conversationtype = RongIMLib.ConversationType.PRIVATE;
		this.sendCmd(conversationtype, targetId, msg)
	}

	send(conversationtype, targetId, msg, msg_) {
		RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
			onSuccess: function (message) {
				msg_.set_uid(message.messageUId)
				console.log("Send successfully", message);
			},
			onError: function (errorCode, message) {
				var info = '';
				switch (errorCode) {
					case RongIMLib.ErrorCode.TIMEOUT:
						info = '超时';
						msg_.set_timeout();
						break;
					case RongIMLib.ErrorCode.UNKNOWN_ERROR:
						info = '未知错误';
						break;
					case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
						info = '在黑名单中，无法向对方发送消息';
						break;
					case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
						info = '不在讨论组中';
						break;
					case RongIMLib.ErrorCode.NOT_IN_GROUP:
						info = '不在群组中';
						break;
					case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
						info = '不在聊天室中';
						break;
					default:
						info = '未知错误';
						break;
				}
				vm.$store.state.f_error(vm.$store.state, '发送失败:' + info);
								
			}
		});
	}

	sendCmd(conversationtype, targetId, msg) {

		RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
			onSuccess: function (message) {
				console.log("Send successfully", message);
			},
			onError: function (errorCode, message) {
				var info = '';
				switch (errorCode) {
					case RongIMLib.ErrorCode.TIMEOUT:
						info = '超时';
						break;
					case RongIMLib.ErrorCode.UNKNOWN_ERROR:
						info = '未知错误';
						break;
					case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
						info = '在黑名单中，无法向对方发送消息';
						break;
					case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
						info = '不在讨论组中';
						break;
					case RongIMLib.ErrorCode.NOT_IN_GROUP:
						info = '不在群组中';
						break;
					case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
						info = '不在聊天室中';
						break;
					default:
						info = '未知错误';
						break;
				}
				vm.$store.state.f_error(vm.$store.state, '发送失败:' + info);
			}
		});
	}

	connect() {
		var token = vm.$store.state.chat.token;
		// 连接融云服务器。
		RongIMClient.connect(token, {
			onSuccess: function (userId) {
				console.log("Login successfully." + userId);
			},
			onTokenIncorrect: function () {
				console.log('token无效');
			},
			onError: function (errorCode) {
				var info = '';
				switch (errorCode) {
					case RongIMLib.ErrorCode.TIMEOUT:
						info = '超时';
						break;
					case RongIMLib.ErrorCode.UNKNOWN_ERROR:
						info = '未知错误';
						break;
					case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
						info = '不可接受的协议版本';
						break;
					case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
						info = 'appkey不正确';
						break;
					case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
						info = '服务器不可用';
						break;
				}
				console.log(errorCode);
			}
		});
	}

	watcher() {
		// 设置连接监听状态 （ status 标识当前连接状态）
		// 连接状态监听器
		RongIMClient.setConnectionStatusListener({
			onChanged: function (status) {
				var info;
				switch (status) {
					//链接成功
					case RongIMLib.ConnectionStatus.CONNECTED:
						console.log('链接成功');
						break;
						//正在链接
					case RongIMLib.ConnectionStatus.CONNECTING:
						console.log('正在链接');
						break;
						//重新链接
					case RongIMLib.ConnectionStatus.DISCONNECTED:
						info = '断开连接';
						break;
						//其他设备登录
					case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
						info = '其他设备登录';
						break;
						//网络不可用
					case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
						info = '网络不可用';
						break;
				}
				if (info)
					vm.$store.state.f_error(vm.$store.state, info);
			}
		});

		// 消息监听器
		RongIMClient.setOnReceiveMessageListener({
			// 接收到的消息
			onReceived: function (message) {
				console.log(message)
				// 判断消息类型
				switch (message.messageType) {
					case RongIMClient.MessageType.TextMessage:
						// 发送的消息内容将会被打印
						chat.receive(0, message)
						break;
					case RongIMClient.MessageType.VoiceMessage:
						// 对声音进行预加载                
						// message.content.content 格式为 AMR 格式的 base64 码
						RongIMLib.RongIMVoice.preLoaded(message.content.content);
						break;
					case RongIMClient.MessageType.ImageMessage:
						// do something...
						chat.receive(1, message)
						break;
					case RongIMClient.MessageType.DiscussionNotificationMessage:
						// do something...
						break;
					case RongIMClient.MessageType.LocationMessage:
						// do something...
						break;
					case RongIMClient.MessageType.RichContentMessage:
						// do something...
						break;
					case RongIMClient.MessageType.DiscussionNotificationMessage:
						// do something...
						break;
					case RongIMClient.MessageType.InformationNotificationMessage:
						// do something...
						break;
					case RongIMClient.MessageType.ContactNotificationMessage:
						// do something...
						break;
					case RongIMClient.MessageType.ProfileNotificationMessage:
						// do something...
						break;
					case RongIMClient.MessageType.CommandNotificationMessage:
						// do something...
						break;
					case RongIMClient.MessageType.CommandMessage:
						chat.cmd_receiver(message)
						break;
					case RongIMClient.MessageType.UnknownMessage:
						// do something...
						break;
					default:
						// 自定义消息
						// do something...
				}
			}
		});
	}
}

export default RongIM;
