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
			console.log('已断开连接，正在重新连接');
			//关闭重练定时器
			if(me.reconnect){
				clearInterval(me.reconnect)
			}
			//每五秒重练一次
			me.reconnect=setInterval(function(){
				me.connect;
			},50000);
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
	receiver: function () {
		var me = MpIMClient;
		me.ws.onmessage = function (evt) {
			var data = evt.data;
			console.log(data)
			data = JSON.parse(data)[0];
			var msg;
			if (data.op == 14){
				console.log('登陆成功');
				//如果是重练，登录成功关闭重练
				if(me.reconnect){
					clearInterval(me.reconnect)
				}
				//清除上一个心跳
				if(me.heart){
					clearInterval(me.heart);
				}
				//开启心跳
				me.heart=setInterval(function () {
					me.ws.send(JSON.stringify({
						'ver': 1,
						'op': 2,
						'seq': this.seq++
					}))
				}, 288000);
				return;
			} else if (data.op == 12) {
				console.log("您已在其他设备登陆")
				return;
			} else if (data.op == 5) {
				// 此处调用消息处理的方法
				if (data.body) {
					if (data.body.msg) {
						msg = data.body.msg;

						console.log('发送成功:op5')
						if (!msg.type){
							//聊天消息
							msg.chat_body.content = JSON.parse(base64.base64ToString(msg.chat_body.content));
							msg.me = true;
							console.log(msg)
							chat.receivetext(msg)
						} else if (msg.type == 1) {
							//cmd消息
							chat.receivecmd(msg)
						} else if (msg.type == 2) {
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
				console.log('收到消息:op9')
				if (data.body) {
					msg = data.body;
					if (!msg.msg_type) {
						msg.chat_body.content = JSON.parse(base64.base64ToString(msg.chat_body.content));
						msg.me = false;
						console.log(msg)
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
