import chat from '../index.js'
import base64 from './tools/base64.js'
import vm from 'src/main.js'
// msg
import Revoke from './revoke_msg'
import Text from './text_msg'
import Cmd from './cmd_msg'
var MpIMClient = {
	seq: 1,
	DeviceInfo: '',
	ws: {},
	time: 0,
	reconnect_: 0,
	heart_: 0,
	init(DeviceInfo) {
		var me = MpIMClient;
		me.DeviceInfo = DeviceInfo;
		me.connect();
	},
	connect() {
		var me = MpIMClient;
		me.ws = new WebSocket('ws://101.37.28.77:8090/sub');
		console.log('正在连接')
		me.ws.onopen = function () {
			if (this.readyState == 1) {
				console.log('链接成功', me.DeviceInfo);
				if (location.href.match(/Main_page\/Addresslist/i) != null)
					vm.$store.state.mounted.addresslist_mounted(vm.$store.state, vm);

				me.login(me.DeviceInfo)
				//如果是重练，登录成功关闭重练
				if (me.reconnect_) {
					clearInterval(me.reconnect_)
				}
				//主动关闭连接
				window.onbeforeunload = function () {
					me.ws.close();
				}
				//错误代码
				me.ws.onerror = function (res) {
					console.log('websocket错误代码：')
					console.log(res)
					vm.$store.state.plugin.f_error(vm.$store.state, "您的设备链接异常，请刷新尝试重新连接");
					vm.$store.state.IM_switch = false;
				}
			} else {
				console.log('链接失败，重新连接中')
				var time = Date.now();
				if (time - me.time > 1000) {
					me.connect();
					me.time = time;
				}
			}
			me.reconnect();
		}
	},
	reconnect() {
		//重新连接
		var me = MpIMClient;
		vm.$store.state.chat.close_by_me = false;
		me.ws.onclose = function () {
			if (!vm.$store.state.chat.close_by_me) {
				console.log('已断开连接，正在重新连接');
				vm.$store.state.plugin.f_error(vm.$store.state, "您的设备已断开连接，请检查网络");
				vm.$store.state.IM_switch = false;
			}
		}
	},
	login() {
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
	send(body) {
		var data = {
			'ver': 1,
			'op': 4,
			'seq': this.seq++,
			'body': body
		}
		console.log('发送消息', body)
		data = JSON.stringify(data);
		this.ws.send(data)
	},
	close() {
		if (this.ws.close) {
			this.ws.close();
			vm.$store.state.chat.close_by_me = true;
		}
	},
	receiver() {
		var me = MpIMClient,
			msg;
		me.ws.onmessage = function (evt) {
			var data = evt.data;
			data = JSON.parse(data)[0];
			if (data.op == 14) {
				console.log('登陆成功');
				vm.$store.state.IM_switch = true;
				//清除上一个心跳
				if (me.heart_) {
					clearInterval(me.heart_);
				}
				//开启心跳
				me.heart_ = setInterval(() => {
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
						console.log(msg);

						if (!msg.type) {
							//聊天消息
							msg.chat_body.content = JSON.parse(base64.base64ToString(msg.chat_body.content));
							Text.handle_text(msg)
						} else if (msg.type == 1) {
							//Cmd.handle_cmd();
						} else if (msg.type == 3) {
							//System.handle_system(msg)
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
					console.log(msg);
					if (!msg.type) {
						msg.chat_body.content = JSON.parse(base64.base64ToString(msg.chat_body.content));
						Text.handle_text(msg)
					} else if (msg.type == 1) {
						Cmd.handle_cmd(msg)
					} else if (msg.type == 2) {
						Revoke.handle_revoke(msg)
					} else if (msg.type == 3) {
						System.handle_system(msg)
					}
				}
			}
		}
	},
}

export default MpIMClient;
