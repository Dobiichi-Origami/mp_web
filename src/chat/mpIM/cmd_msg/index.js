import vm from 'src/main.js'
import base64 from '../../mpIM/tools/base64.js'

var chat = vm.$store.state.chat
var Cmd = {
	//cmdBody的部分信息需要解密，时间字符串转换等预处理
	pre_handle(cmdBody) {
		//cmd_msg的apply_info需要base64解密
		var apply_info = cmdBody.apply_info;
		if(apply_info){
			cmdBody.apply_info = base64.base64ToString(apply_info);
		}
		
		//毫秒数转字符串
		var date = new Date();
		date.setTime(cmdBody.apply_date);
		cmdBody.timeString = date.toLocaleString();

		//设置cmd的状态，分为未处理0，已处理1，已忽略2，已拒绝3，收到消息默认都设置未处理
		cmdBody.cmdStatus = 0;
	},
	dereplication(cmd, type) {
		//去重函数
		var flag = false;
		// var cmdKey = cmd.action + '_' + cmd.apply_user.id + '_' + cmd.apply_user.no + '_' + cmd.target_user.id + '_' + cmd.target_user.no;
		var sender = cmd.apply_user,
			receiver = cmd.target_user,
			action = cmd.action;

		if(type == 0){//好友cmd
			var friendCmd = chat.cmd_msg.friendCmd;
			// var friendCmdMap = chat.cmd_msg.friendCmdMap;
			for(var i in friendCmd){
				if(friendCmd[i].action == action && friendCmd[i].apply_user.id == sender.id && friendCmd[i].apply_user.no == sender.no &&
					friendCmd[i].target_user.id == receiver.id && friendCmd[i].target_user.no == receiver.no){
					flag = true;
					break;
				}
			}
			if(!flag){//不存在则左插
				friendCmd.unshift(cmd);
				chat.cmd_msg.count++;
				vm.$store.state.chat.unread++;
			}else{//存在则替换
				friendCmd.splice(i,1,cmd);
			}
		}else{//群cmd
			

		}
	},
	handle_cmd(msg) {
		console.log('收到的cmd消息:', msg);
		
		var cmd_body = msg.cmd_body;
		//cmd_body的apply_info需要base64解密
		Cmd['pre_handle'](cmd_body);

		var friendCmdKeys = Array.from(chat.cmd_msg.friendCmdType.keys());
		var groupCmdKeys = Array.from(chat.cmd_msg.groupCmdType.keys());

		for (let i in friendCmdKeys) {
			if (friendCmdKeys[i] == cmd_body.action) {
				Cmd[cmd_body.action](cmd_body);
				break;
			}
		}
		for (let i in groupCmdKeys) {
			if (groupCmdKeys[i] == cmd_body.action) {
				Cmd[cmd_body.action](cmd_body);
				break;
			}
		}
		console.log('friendCmd:', chat.cmd_msg.friendCmd);
		console.log('groupCmd:', chat.cmd_msg.groupCmd);
	},

	friend_apply(cmd){
		//申请加好友通知
		//去重处理
		Cmd['dereplication'](cmd, 0);
	},
	handle_friend_apply(cmd, flag){
		//取到索引对应的cmd消息数据
		// var friendCmd = chat.cmd_msg.friendCmd[index];
		var friendCmd = cmd;
		//同意或者忽略
		if(!flag){//同意
			//调用接口处理
			vm.$http({
				method: 'get',
				url: vm.$store.state.domain + 'friend/add',
				params: {
					'access_token': localStorage.getItem('access_token'),
					'userid': friendCmd.apply_user.id,
					'no': friendCmd.apply_user.no,
					'selfuserid': friendCmd.target_user.id,
					'selfno': friendCmd.target_user.no,
					'invite_time': friendCmd.apply_date,
					'invite_key': friendCmd.invite_key,
					'send_cmd': true
				},
				emulateJSON: true,
			}).then(
				res => {
					if (res.body.error) {
						vm.$store.state.plugin.f_error(vm.$store.state, res.body.error);
					} else if (res.body.item) {
						console.log('item********', res.body.item);
						//返回的数据暂未处理
						friendCmd.cmdStatus = 1;//状态为已处理 
						console.log('friendCmd数组为：', chat.cmd_msg.friendCmd);
					}
				},
				res => {
					vm.$store.state.plugin.f_error(vm.$store.state, "服务器正在开小差。。。");
				}
			)
		}else{//忽略
			friendCmd.cmdStatus = 2;
			console.log('friendCmd数组为：', chat.cmd_msg.friendCmd);
		}	
	},

	friend_delete(cmd){
		//删除好友的通知暂不做任何处理
	},
	couple_apply(cmd){
		console.log(cmd);
	},
	couple_divorce(cmd){
		console.log(cmd);
	},
	couple_force_divorce(cmd){
		console.log(cmd);
	},

	group_invite(cmd){
		Cmd['dereplication'](cmd, 1);
	}





}
export default Cmd;

