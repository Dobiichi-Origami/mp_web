/**
    2017-4-14 yuicer
    undo:
        CMD message
        gift message
		redpack message
    //通知
    好友通知：
        某某想加你为好友
        某某向你发起求婚
        某某向你发起离婚

    群通知
        某某申请加入某群 group_join (群主，管理员皮所属账户能收)
        某某邀请你加某群 group_invite
        某某退出某群 group_quit (群主，管理员皮所属账户能收)
        某群已将某某移出群 group_kick (被移出的皮所属的账户能收)
        某群将某某设置为管理员 admin_setting (被设置的皮所属账户能收)
        某群已取消某某管理员身份 admin_cancel (被取消的皮所属账户能收)
        某某已成为某群新群主 group_transfer (被设置的皮所属账户能收)

    消息
        某群管理员开启了全员禁言 group_silenced (通知类型，但在消息栏显示，只有其他管理员或群主能收到)
        某群管理员关闭了全员禁言 group_silenced (通知类型，但在消息栏显示，同上)
        群主授予某某专属头衔 (txt)
        礼物消息 某某送给你一份礼物  (txt)
        
**/

require('../../static/qiniu.js')
import vm from 'src/main.js'
var con = vm.$store.state.chat.conversation
import mpIM from './mpIM/mpIM.js'
import base64 from './mpIM/tools/base64.js'
// structure
import Msg from './data_structure/Msg'
import Conversation from './data_structure/Conversation'
//send msg
import Revoke from './mpIM/revoke_msg'


//对外暴露的唯一对象。
var chat = {
	deviceInfo: {
		token: '',
		type: 'WEB',
		mac: ''
	},
	login: function (deviceid) {
		this.deviceInfo.token = localStorage.getItem('access_token');
		this.mac = deviceid;
		this.getgroup(mpIM.init, this.deviceInfo);
	},
	logout: function () {
		mpIM.close();
		console.log('关闭')
	},
	conversationExist: function (meId, otherId, con, meno, otherno) {
		var flag = false;
		//判断该会话是否存在
		if (otherno) { //otherno存在，为私聊情况
			for (var i = 0; i < con.length; i++) {
				if (meId == con[i].me.id && meno == con[i].me.no && otherId == con[i].other.id && otherno == con[i].other.no) {
					flag = true;
					break;
				}
			}
			if (flag)
				return i;
		} else { //为群聊情况
			for (var i = 0; i < con.length; i++) {
				if (meId == con[i].me.id && meno == con[i].me.no && otherId == con[i].other.id) {
					flag = true;
					break;
				}
			}
			if (flag)
				return i;
		}
	},

	start: function (info, isreseive) {
		var con = vm.$store.state.chat.conversation,
			me = {},
			other = {},
			group_details = {},
			conExist, //标识会话是否在会话数组中存在，在的话为对应索引index,不在的话为undefined
			conversation; //自定义conversation
		//先判断收发类型
		if (isreseive) {
			//收消息情况下，判断会话类型
			if (!info.target_type) { //私聊
				//判断发消息的人是否就是本人, 判断发送方的deviceId是否与当前账户的deviceId相同(该情况出现在多端登录时)

				if (!info.chat_body.direction) {
					me.id = info.chat_body.sender.id;
					me.no = info.chat_body.sender.no;
					other.id = info.target_id;
					other.no = info.target_no;
				} else {
					me.id = info.target_id;
					me.no = info.target_no;
					other.id = info.chat_body.sender.id;
					other.no = info.chat_body.sender.no;
				}

				//判断该会话是否存在
				conExist = this.conversationExist(me.id, other.id, con, me.no, other.no);
				if (conExist != undefined) { //
					//显示消息提示
					if (!vm.$store.state.unread_msg(vm.$store.state.chat.conversation[conExist].other.id, vm.$store.state)) {
						vm.$store.state.chat.conversation[conExist].set_unreadCount();
					}
					if (info.chat_body.direction) {
						vm.$store.state.openfriend(vm.$store.state, info, chat);
					}
					return conExist;
				} else {
					other.headimg = info.chat_body.sender.head_img;
					other.name = info.chat_body.sender.name;
					me.headimg = info.chat_body.chat_current_user.head_img;
					me.name = info.chat_body.chat_current_user.name;
				}
				//产生会话
				conversation = new Conversation(me, other);
				if (!vm.$store.state.unread_msg(other.id, vm.$store.state)) {
					conversation.set_unreadCount();
				}
			} else if (info.target_type == 1) { //群聊

				var groupList = vm.$store.state.chat.messages.grouplist;
				var currPi;
				//遍历用户的所有群信息，找到和收到的群消息对应的群
				for (var gindex = 0, glength = groupList.length; gindex < glength; gindex++) {
					if (info.target_id == groupList[gindex]._id) {
						//找到后取该群中对应的当前皮信息
						currPi = groupList[gindex].member;
						me.id = currPi._id;
						me.no = currPi.no;
						break;
					}
				}
				other.id = info.target_id;
				//判断该会话是否存在
				conExist = this.conversationExist(me.id, other.id, con, me.no);
				for (var i = 0; i < vm.$store.state.chat.messages.grouplist.length; i++) {
					if (other.id == vm.$store.state.chat.messages.grouplist[i]._id) {
						group_details = vm.$store.state.chat.messages.grouplist[i];
						break;
					}
				}
				if (conExist != undefined) {
					vm.$store.state.message_window[conExist].show = 1;
					if (!vm.$store.state.unread_msg(vm.$store.state.chat.conversation[conExist].other.id, vm.$store.state)) {
						vm.$store.state.chat.conversation[conExist].set_unreadCount()
					}
					if (info.chat_body.direction) {
						vm.$store.state.opengroup(vm.$store.state, group_details._id, group_details, chat);
					}
					return conExist;
				} else {
					me.headimg = currPi.headimg;
					me.name = currPi.name;
					other.headimg = info.chat_body.chat_head_img;
					other.name = info.chat_body.chat_name;
					other.no = info.target_no;
					//添加
				}
				conversation = new Conversation(me, other);
				conversation.set_group(true);
				var selfTitle;
				console.log(conversation)
				switch (currPi.group_member_type) {
					case 10:
						selfTitle = "管理员";
						break;
					case 20:
						selfTitle = "群主";
						break;
					default:
						selfTitle = "";
						break;
				}
				//设置群头衔
				conversation.set_title(selfTitle, currPi.group_member_type);
				if (!vm.$store.state.unread_msg(other.id, vm.$store.state)) {
					conversation.set_unreadCount();
				}
			}
		} else {
			//发消息情况下，判断会话类型
			if (!info.description) { //私聊
				if (info.target_id) {
					me.id = info.target_id;
					me.no = info.target_no;
					other.id = info.chat_body.sender.id;
					other.no = info.chat_body.sender.no;
				} else {
					me.id = vm.$store.state.current_user._id;
					me.no = vm.$store.state.current_user.no;
					other.id = info.user._id;
					other.no = info.no;
				}
				conExist = this.conversationExist(me.id, other.id, con, me.no, other.no);
				if (!isNaN(conExist))
					return conExist;
				else {
					if (info.target_id) {
						other.headimg = info.chat_body.sender.head_img;
						other.name = info.chat_body.sender.name;
						me.headimg = info.chat_body.chat_current_user.head_img;
						me.name = info.chat_body.chat_current_user._name;
					} else {
						me.headimg = vm.$store.state.current_user.headimg;
						me.name = vm.$store.state.current_user.name;
						other.headimg = info.headimg;
						other.name = info.name;
						other.deviceid = info.device._id;
					}
				}
				conversation = new Conversation(me, other);
			} else { //群聊
				me.id = info.member._id;
				me.no = info.member.no;
				other.id = info._id;
				conExist = this.conversationExist(me.id, other.id, con, me.no);
				if (!isNaN(conExist))
					return conExist;
				else {
					me.headimg = info.member.headimg;
					me.name = info.member.name;
					other.headimg = info.headimg;
					other.name = info.name;
					other.no = info.no;
					other.deviceid = info._id;
				}
				conversation = new Conversation(me, other);
				conversation.set_group(true);

				switch (info.member.group_member_type) {
					case 1:
						conversation.set_title("", 1);
						break;
					case 10:
						conversation.set_title("管理员", 10);
						break;
					case 20:
						conversation.set_title("群主", 20);
						break;
				}
			}
		} //初始化未读消息数目为0
		con.push(conversation);
		if (conversation && isreseive) {
			if (!conversation.isGroup) {
				vm.$store.state.openfriend(vm.$store.state, info, chat);
			} else {
				vm.$store.state.opengroup(vm.$store.state, group_details._id, group_details, chat);
			}
		}
		return (con.length - 1); //创建新对话后返回对话数组最后一个索引值，此处需要修正
	},
	send: function (index, type, content_url, chat_type, group_at_users, defaultcontent) {
		var targetType = con[index].isGroup ? 1 : 0;
		if (type == 1) {
			content_url = JSON.stringify({
				localUrl: '',
				remoteUrl: content_url
			})
		} else if (type == 2) {
			content_url = JSON.stringify(content_url)
		}
		var body = {
			chat_body: {
				sender: {
					id: con[index].me.id,
					no: con[index].me.no,
					name: con[index].me.name,
					head_img: con[index].me.headimg
				},
				content_type: type,
				group_at_users: group_at_users,
				content: base64.toBase64(JSON.stringify({
					speakType: chat_type,
					content: content_url,
					defaultContent: defaultcontent,
				})),
			},
			type: 0,
			time: Date.now(),
			target_type: targetType,
			target_id: con[index].other.id,
			target_no: con[index].other.no - 0,
		}
		mpIM.send(body);
	},
	//根据以后接口改参数，礼物类型等等
	send_gift: function (index) {
		var gift = this.get_gift();
		this.send(index, 4, gift.name, 0, 0, gift);
	},
	send_magicimg: function (index, type) {
		//0骰子1猜拳
		var magicimg = this.get_magicimg(type)
		this.send(index, 2, magicimg, 0, [], magicimg.magicPicDesc);
	},
	send_revoke: function (conversation_index, msg_index, content) {
		Revoke.send_revoke(conversation_index, msg_index, content);
	},
	//获取群数据
	getgroup: function (callback, param) {
		var allgroup;
		//查看所有群信息
		vm.$http({
			method: 'get',
			url: vm.$store.state.domain + '/group/groups_by_me',
			params: {
				'access_token': localStorage.getItem('access_token'),
			},
			emulateJSON: true,
		}).then(
			res => {
				if (res.body.error) {
					vm.$store.state.plugin.f_error(vm.$store.state, res.body.error);
				} else if (res.body.items) {
					vm.$store.state.chat.messages.grouplist = res.body.items;
					allgroup = res.body.items;
					//获取所有群详细
					var details = [];
					if (allgroup) {
						for (var i = 0, l = allgroup.length; i < l; i++) {
							//对每个群的群id获取其群详细
							vm.$http({
								method: 'get',
								url: vm.$store.state.domain + '/group/details',
								params: {
									'access_token': localStorage.getItem('access_token'),
									'id': allgroup[i]._id
								},
								emulateJSON: true,
							}).then(
								res => {
									if (res.body.error) {
										vm.$store.state.plugin.f_error(vm.$store.state, res.body.error);
									} else if (res.body.group) {
										details.push(res.body.group);
										if (details.length == vm.$store.state.chat.messages.grouplist.length) {
											vm.$store.state.chat.messages.groupsDetail = details;
											callback(param);
										}
									}
								},
								res => { //500报错
									vm.$store.state.plugin.f_error(vm.$store.state, "服务器正在开小差。。。");
								})
						}
						if (i == 0)
							callback(param)
					}
				}
			},
			res => { //500报错
				vm.$store.state.plugin.f_error(vm.$store.state, "服务器正在开小差。。。");
			})
	},
	uploadeimg: function (index) {
		var me = this;
		Qiniu.uploader({
			runtimes: 'html5,flash,html4', //上传模式,依次退化
			browse_button: 'pickfiles' + index, //上传选择的点选按钮，**必需**
			uptoken_url: vm.$store.state.domain + '/qiniu', //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
			// uptoken : 'TUo-Zhi8ICQGKqHVuIzL1rYdb5itNEF4F6fQzJjr:kgY7N3pZmmaSISiqDa-5Z1K694s=:eyJzY29wZSI6Im1yd2VjaGF0IiwiZGVhZGxpbmUiOjE0OTU1MzA4OTV9', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
			// unique_names: true, 					   // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
			// save_key: true,   					  // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
			domain: 'http://7x2wk4.com2.z0.glb.qiniucdn.com/', //bucket 域名，下载资源时用到，**必需**
			get_new_uptoken: false, //设置上传文件的时候是否每次都重新获取新的token
			container: 'container' + index, //上传区域DOM ID，默认是browser_button的父元素，
			max_file_size: '100mb', //最大文件体积限制
			flash_swf_url: './js/Moxie.swf', //引入flash,相对路径
			max_retries: 2, //上传失败最大重试次数
			dragdrop: false, //开启可拖曳上传
			// drop_element: 'container',     //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
			chunk_size: '4mb', //分块上传时，每片的体积
			auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
			save_key: false,
			unique_names: false,
			init: {
				'FilesAdded': function (up, files) {
					// plupload.each(files, function(file) {
					//     // 文件添加进队列后,处理相关的事情
					//    for (var i = 0; i < files.length; i++) {
					//                   var fileItem = files[i].getNative(),
					//                         url = window.URL || window.webkitURL || window.mozURL;
					//                   var src = url.createObjectURL(fileItem);
					//                   var msg=new Msg(index,1,src+'?',0, 0,new Date().getTime(),true);
					//       	 }
					// });
				},
				'BeforeUpload': function (up, file) {
					if (navigator.onLine) {
						var fileItem = file.getNative(),
							url = window.URL || window.webkitURL || window.mozURL;
						var src = url.createObjectURL(fileItem);
						for (var i = 0; i < vm.$store.state.chat.conversation[index].msg.length; i++) {
							if (vm.$store.state.chat.conversation[index].msg[i].id == file.id) {
								return;
							}
						}
						new Msg(index, 1, {
							url: src,
							id: file.id
						}, 0, new Date().getTime(), true, 0);
					} else {
						vm.$store.state.plugin.f_error(vm.$store.state, "您的设备已断开连接，请检查网络");
					}
				},
				'UploadProgress': function (up, file) {},
				'FileUploaded': function (up, file, info) {
					if (navigator.onLine) {
						for (var i = 0; i < vm.$store.state.chat.conversation[index].msg.length; i++) {
							if (vm.$store.state.chat.conversation[index].msg[i].id == file.id) {
								var message = vm.$store.state.chat.conversation[index].msg[i];
								message.send_success = true;
								message.url = 'http://7x2wk4.com2.z0.glb.qiniucdn.com/' + JSON.parse(info).key;
								vm.$store.state.chat.conversation[index].msg.splice(i, 1, message);
								break;
							}
						}

						me.send(index, 1, 'http://7x2wk4.com2.z0.glb.qiniucdn.com/' + JSON.parse(info).key, 0)
					} else {
						vm.$store.state.plugin.f_error(vm.$store.state, "您的设备已断开连接，请检查网络");
					}
				},
				'Error': function (up, err, errTip) {
					console.log(err)
				},
				'UploadComplete': function () {
					//队列文件处理完毕后,处理相关的事情
				},
				'Key': function (up, file) {
					// 若想在前端对每个文件的key进行个性化处理，可以配置该函数
					// 该配置必须要在 unique_names: false , save_key: false 时才生效
					var key = new Date().getTime();
					return key
				}
			}
		})
	},
	get_magicimg: function (type) {
		if (!type) {
			//点数
			var random_dice = Math.ceil(Math.random() * 6),
				dice = {
					animatedPicLocalUri: "asset:///magic_pic/dice/dice_anim_" + random_dice + ".gif",
					animatedPicUrl: "http://7x2wk4.com2.z0.glb.qiniucdn.com/magic_pic/dice/dice_anim_" + random_dice + ".gif",
					magicPicDesc: "[骰子]",
					magicPicType: "DICE",
					staticPicLocalUri: "asset:///magic_pic/dice/dice_" + random_dice + ".gif",
					staticPicUrl: "http://7x2wk4.com2.z0.glb.qiniucdn.com/magic_pic/dice/dice_" + random_dice + ".gif",
				}
			return dice;
		} else {
			//1石头2剪刀3布
			var random_roshambo = Math.ceil(Math.random() * 3),
				roshambo = {
					animatedPicLocalUri: "asset:///magic_pic/roshambo/roshambo_anim_" + random_roshambo + ".gif",
					animatedPicUrl: "http://7x2wk4.com2.z0.glb.qiniucdn.com/magic_pic/roshambo/roshambo_anim_" + random_roshambo + ".gif",
					magicPicDesc: "[猜拳]",
					magicPicType: "ROSHAMBO",
					staticPicLocalUri: "asset:///magic_pic/roshambo/roshambo_" + random_roshambo + ".gif",
					staticPicUrl: "http://7x2wk4.com2.z0.glb.qiniucdn.com/magic_pic/roshambo/roshambo_" + random_roshambo + ".gif",
				}
			return roshambo;
		}
	},
}
export default chat;
