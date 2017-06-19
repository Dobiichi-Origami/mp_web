import chat from '../index.js'
import base64 from './base64.js'
var MpIMClient = {
	seq: 1,
	DeviceInfo: '',
	ws: {},
	time: 0,
	init: function (DeviceInfo) {
		var me = MpIMClient;
		me.DeviceInfo = DeviceInfo;
		me.connect();
		me.reconnect();
	},
	connect: function () {
		var me = MpIMClient;
		me.ws = new WebSocket('ws://101.37.28.77:8090/sub');
		console.log('正在连接')
		me.ws.onopen = function () {
			if (this.readyState == 1) {
				console.log('链接成功', me.DeviceInfo);
				me.login(me.DeviceInfo)
			} else {
				console.log('链接失败，重新连接中')
				var time = new Date().getTime();
				if (time - me.time > 1000) {
					me.connect();
					me.time = time;
				}
			}
		}
	},
	reconnect: function () {
		//重新连接
		var me = MpIMClient;
		me.ws.onclose = function () {
			console.log('已断开连接，正在重新连接')
			me.connect();
		}
	},
	login: function () {
		//登录之后发一条消息
		var me = this;
		var data = {
			'ver': 1,
			'op': 13,
			'seq': this.seq++,
			'body': me.DeviceInfo
		}
		data = JSON.stringify(data);
		me.ws.send(data)
		me.receiver();
	},
	heart: function () {
		var me = MpIMClient;
		setInterval(function () {
			me.ws.send(JSON.stringify({
				'ver': 1,
				'op': 2,
				'seq': this.seq++
			}))
		}, 288000)
	},
	receiver: function () {
		var me = MpIMClient;
		me.ws.onmessage = function (evt) {
			var data = evt.data;
			console.log(data)
			data = JSON.parse(data)[0];
			var msg;

			if (data.op == 14) {
				console.log('登陆成功');
				me.heart();
				return;
			} else if (data.op == 12) {
				console.log("您已在其他设备登陆")
				return;
			} else if (data.op == 5) {
				//此处调用消息处理的方法
				if (data.body) {
					if (data.body.msg) {
						msg = data.body.msg;
						msg.msg_content = JSON.parse(base64.base64ToString(msg.msg_content));
						msg.me = true;
						console.log('发送成功:')
						// console.log(msg)
						if (!msg.msg_type) {
							//聊天消息
							chat.receivetext(msg)
						} else if (msg.msg_type == 1) {
							//cmd消息
							chat.receivecmd(msg)
						} else if (msg.msg_type == 2) {
							//系统消息
							chat.receivesystem(msg)
						}
					} else {
						console.log('数据错误');
						return;
					}
				} else {
					console.log('发送数据格式错误')
					return;
				}
			} else if (data.op == 9) {
				if (data.body) {
					msg = data.body;
					msg.msg_content = JSON.parse(base64.base64ToString(msg.msg_content));
					msg.me = false;
					console.log('收到服务器的原消息:')
					console.log(msg)
					if (!msg.msg_type) {
						//聊天消息
						chat.receivetext(msg)
					} else if (msg.msg_type == 1) {
						//cmd消息
						chat.receivecmd(msg)
					} else if (msg.msg_type == 2) {
						//系统消息
						chat.receivesystem(msg)
					}
				}
			}
		}
	},
	send: function (body) {
		var data = {
			'ver': 1,
			'op': 4,
			'seq': this.seq++,
			'body': body
		}
		console.log('发送消息')
		console.log(data)
		data = JSON.stringify(data);
		this.ws.send(data)
	}
}

export default MpIMClient;
