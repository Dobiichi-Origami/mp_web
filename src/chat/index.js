/**
    2017-4-14 yuicer
    undo:
        系统消息
        
    example:
        import chat from "src/chat"
        //文本,图片发送
        chat.send(index, type, content_url, chat_type, temp)
            index 发送目标序号
            type 发送类型，0为文本，1为图片，2为魔法表情，3为红包，4为礼物。
            content_url 发送内容，文本或url
            chat_type 聊天类型 0为角色说，1为本人说，2为剧情
            temp 0 普通消息 1 临时消息
            
        //魔法表情
        chat.send_magicimg(index,type)
            index 发送目标序号
            type 0 骰子 1猜拳
            
        //消息撤回，传参cmd_sender(a,b,c,d)
        a 系统消息类型    b msg所在conversation，c msg 的序列号，d 撤回发送的内容
        cmd_sender("msg_revoke",0,1,"chehui")
        
        //礼物这版本不做，只接收提示
        
        //红包当前版本不做，只接收提示    

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
import vm from 'src/main.js'
import MpIM from './mpIM/mpIM.js'
//import RongIM from './RongSDK_helper/RongIM'
// import CmdHandler from './CmdHandler'
import Extra from './data_structure/Extra'
import GroupExtra from './data_structure/GroupExtra'
import Msg from './data_structure/Msg'
import Conversation from './data_structure/Conversation'
// require('./mpIM/plupload.js')
require('./mpIM/qiniu.js')
    // import uploadimg from './RongSDK_helper/uploadimg'
var mpIM = new MpIM();

//对外暴露的唯一对象。
var chat = {
	//获取群数据
	getgroup:function(){
		var allgroup;
		//查看所有群信息
		vm.$http({
				method: 'get',
				url: 'http://test.mrpyq.com/api/group/groups_by_me',
				params: {
					'access_token': localStorage.getItem('access_token'),
				},
				emulateJSON: true,
			}).then(
				res => {
					if (res.body.error) {
						vm.$store.state.f_error(vm.$store.state, res.body.error);
					}
					else if (res.body.items) {
						vm.$store.state.messages.grouplist = res.body.items;
						allgroup = res.body.items;
						//console.log(res.body);
						//获取所有群详细
						var details=[];
						if (allgroup) {
							for (var i = 0,l = allgroup.length;i < l;i++) {
								//对每个群的群id获取其群详细
								vm.$http({
									method: 'get',
									url: 'http://test.mrpyq.com/api/group/details',
									params: {
										'access_token': localStorage.getItem('access_token'),
										'id': allgroup[i]._id
									},
									emulateJSON: true,
								}).then(
									res => {
										if (res.body.error) {
											vm.$store.state.f_error(vm.$store.state, res.body.error);
										}
										else if (res.body.group) {
											details.push(res.body.group);
											if(details.length==vm.$store.state.messages.grouplist.length){
												vm.$store.state.messages.groupsDetail=details;
												vm.$store.state.group_switch=true;
											}
										}
									},
									res => {//500报错
										vm.$store.state.f_error(vm.$store.state, "服务器正在开小差。。。");
								})
							}
						}
					}
				},
				res => {//500报错
					vm.$store.state.f_error(vm.$store.state, "服务器正在开小差。。。");
			})
	},
	deviceInfo:{
		token:'',
		type:'WEB',
		mac:''
	},
	login:function (deviceid) {
		//AppKey
		//Debug:  x18ywvqf8mcmc
		//Release:  x4vkb1qpvszsk
		this.deviceInfo.token=localStorage.getItem('access_token');
		this.mac=deviceid;
		mpIM.init(this.deviceInfo);
		// RongIMLib.RongIMEmoji.init();
		this.getgroup();
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
	// start: function (info,local){
	// 	var con = vm.$store.state.chat.conversation;
	// 	var me = {},
	// 		other = {},
	// 		group_details={};
	// 	var conExist; //标识会话是否在会话数组中存在，在的话为对应索引index,不在的话为undefined
	// 	// var type; //标识会话类型，1私聊，3群聊
	// 	var conversation; //自定义conversation
	// 	var sendIsMe;
	// 	if(local){
	// 		if(info.description){
	// 			//群聊
	// 			me.id=vm.$store.state.current_user._id;
	// 			me.no=vm.$store.state.current_user.no;
	// 			other.id=info._id;
	// 			other.no=info.no；
	// 		}else{
	// 			//私聊
	// 			me.id=vm.$store.state.current_user._id;
	// 			me.no=vm.$store.state.current_user.no;
	// 			other.id=info.user._id;
	// 			other.no=info.no；
	// 		}
	// 		//本地发起会话
	// 	}else{
	// 		//接受会话
	// 		if (info.me) {
	// 			me.id = info.sender_id;
	// 			me.no = info.sender_id;
	// 			other.id = info.target_id;
	// 			other.no = info.target_no;
	// 		} else {
	// 			me.id = info.target_id;
	// 			me.no = info.target_no;
	// 			other.id = info.sender_id;
	// 			other.no = info.sender_no;
	// 		}
	// 	}
	// 	//先判断收发类型
	// 	//if (isreseive){
	// 	//var extra = JSON.parse(info.content.extra);
	// 	//收消息情况下，判断会话类型
	// 	if (!info.target_type) { //私聊
	// 		//判断发消息的人是否就是本人, 判断发送方的deviceId是否与当前账户的deviceId相同(该情况出现在多端登录时)
	// 		// console.log("***********检查current_user对象");
	// 		//console.log(vm.$store.state.current_user.device._id);

	// 		//sendIsMe = (info.senderUserId == vm.$store.state.current_user.device._id);
	// 		console.log('收私聊消息时是否是本人发:', info.me);
	// 		console.log("当前皮ID为:");
	// 		console.log(vm.$store.state.current_user._id);
	// 		//判断该会话是否存在
	// 		conExist = this.conversationExist(me.id, other.id, con, me.no, other.no);
	// 		if (conExist!=undefined){//
	// 			//显示消息提示
	// 			vm.$store.state.message_window[conExist].show=1;
	// 			return conExist;
	// 		}
	// 		else{
	// 			if (info.me) {
	// 				me.headimg = info.sender_head_img;
	// 				me.name = info.sender_name;
	// 				other.headimg = info.chat_current_head_img;
	// 				other.name = info.chat_current_name;
	// 			} else {
	// 				other.headimg = info.sender_head_img;
	// 				other.name = info.sender_name;
	// 				me.headimg = info.chat_current_head_img;
	// 				me.name = info.chat_current_name;
	// 			}
	// 		}
	// 		//产生会话
	// 		conversation = new Conversation(me, other);

	// 	}else if (info.target_type == 1) { //群聊
	// 		if(vm.$store.state.group_switch){
	// 			//console.log(vm.$store.state.messages.grouplist)
	// 			var groupList = vm.$store.state.messages.grouplist;
	// 			//console.log(groupList);
	// 			var currPi;
	// 			//遍历用户的所有群信息，找到和收到的群消息对应的群
	// 			for (var gindex = 0, glength = groupList.length; gindex < glength; gindex++) {
	// 				if (info.target_id == groupList[gindex]._id) {
	// 					//找到后取该群中对应的当前皮信息
	// 					currPi = groupList[gindex].member;
	// 					me.id = currPi._id;
	// 					me.no = currPi.no;
	// 					break;
	// 				}
	// 			}
	// 			/*me.id = extra.selfId;
	// 			me.no = extra.selfNo;*/
	// 			other.id = info.target_id;
	// 			//判断该会话是否存在
	// 			conExist = this.conversationExist(me.id, other.id, con, me.no);
	// 			console.log(conExist + '***************');
	// 			if (conExist!=undefined){
	// 				vm.$store.state.message_window[conExist].show=1;
	// 				return conExist;
	// 			}
	// 			else {
	// 				//console.log(currPi);
	// 				me.headimg = currPi.headimg;
	// 				me.name = currPi.name;
	// 				other.headimg = info.chat_current_head_img;
	// 				other.name = info.chat_current_name;
	// 				other.no = info.target_no;
	// 				// other.deviceid = info.targetId;
	// 				//添加
	// 			}
	// 			conversation = new Conversation(me, other);
	// 			conversation.set_group(true); //conversation的isGroup为true
	// 			var selfTitle;
	// 			console.log(conversation)
	// 			switch (currPi.group_member_type) {
	// 				case 10:selfTitle = "管理员";break;
	// 				case 20:selfTitle = "群主";break;
	// 				default:selfTitle = "";break;
	// 			}
	// 			//设置群头衔
	// 			conversation.set_title(selfTitle, currPi.group_member_type);
	// 			//
	// 			//设置会话禁言状态,取当前会话对应的群组的禁言状态进行设置
	// 			this.setSilenced(conversation);

	// 			for(var i=0;i<vm.$store.state.messages.grouplist.length;i++){
	// 				if(other.id==vm.$store.state.messages.grouplist[i]._id){
	// 					group_details=vm.$store.state.messages.grouplist[i];
	// 					break;
	// 				}
	// 			}
	// 		}else{
	// 			var th=this;
	// 			var time=setInterval(function(){
	// 				if(vm.$store.state.group_switch){
	// 					th.receive(info);
	// 					clearInterval(time);
	// 				}
	// 			},300)
	// 			return conExist;
	// 		}
	// 	}
	// 	conversation.unreadCount = 0;//初始化未读消息数目为0
	// 	con.push(conversation);	
	// 	console.log(conversation,conExist);
	// 	// if(conversation && isreseive){
	// 	// 	if(!conversation.isGroup){
	// 	// 		vm.$store.state.openfriend(vm.$store.state,other.id,other,chat);
	// 	// 	}else{
	// 	// 		vm.$store.state.opengroup(vm.$store.state,group_details._id,group_details,chat);
	// 	// 	}
	// 	// }
	// 	console.log('会话数组:');
	// 	console.log(con);
	// 	return (con.length - 1);//创建新对话后返回对话数组最后一个索引值，此处需要修正
	// },
	start: function (info, isreseive){
		var con = vm.$store.state.chat.conversation;
		var me = {},
			other = {},
			group_details={};
		var conExist; //标识会话是否在会话数组中存在，在的话为对应索引index,不在的话为undefined
		var type; //标识会话类型，1私聊，3群聊
		var conversation; //自定义conversation
		//先判断收发类型
		if (isreseive){
			//收消息情况下，判断会话类型
			if (!info.target_type) { //私聊
				//判断发消息的人是否就是本人, 判断发送方的deviceId是否与当前账户的deviceId相同(该情况出现在多端登录时)
				// console.log("***********检查current_user对象");
				//console.log(vm.$store.state.current_user.device._id);

				//sendIsMe = (info.senderUserId == vm.$store.state.current_user.device._id);
				console.log('收私聊消息时是否是本人发:', info.me);
				console.log("当前皮ID为:");
				console.log(vm.$store.state.current_user._id);
				if (info.me) {
					me.id = info.sender_id;
					me.no = info.sender_no;
					other.id = info.target_id;
					other.no = info.target_no;
				} else {
					me.id = info.target_id;
					me.no = info.target_no;
					other.id = info.sender_id;
					other.no = info.sender_no;
				}
				//判断该会话是否存在
				conExist = this.conversationExist(me.id, other.id, con, me.no, other.no);
				console.log(info)
				if (conExist!=undefined){//
					//显示消息提示
					//vm.$store.state.message_window[conExist].show=1;
					return conExist;
				}else{
					if (info.me) {
						me.headimg = info.sender_head_img;
						me.name = info.sender_name;
						other.headimg = info.chat_current_head_img;
						other.name = info.chat_current_name;
					} else {
						other.headimg = info.sender_head_img;
						other.name = info.sender_name;
						me.headimg = info.chat_current_head_img;
						me.name = info.chat_current_name;
					}
				}
				//产生会话
				conversation = new Conversation(me, other);
			}else if (info.target_type == 1) { //群聊
				if(vm.$store.state.group_switch){
					//console.log(vm.$store.state.messages.grouplist)
					var groupList = vm.$store.state.messages.grouplist;
					//console.log(groupList);
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
					/*me.id = extra.selfId;
					me.no = extra.selfNo;*/
					other.id = info.target_id;
					//判断该会话是否存在
					conExist = this.conversationExist(me.id, other.id, con, me.no);
					console.log(conExist + '***************');
					if (conExist!=undefined){
						vm.$store.state.message_window[conExist].show=1;
						return conExist;
					}
					else {
						//console.log(currPi);
						me.headimg = currPi.headimg;
						me.name = currPi.name;
						other.headimg = info.chat_current_head_img;
						other.name = info.chat_current_name;
						other.no = info.target_no;
						// other.deviceid = info.targetId;
						//添加
					}
					conversation = new Conversation(me, other);
					conversation.set_group(true); //conversation的isGroup为true
					var selfTitle;
					console.log(conversation)
					switch (currPi.group_member_type) {
						case 10:selfTitle = "管理员";break;
						case 20:selfTitle = "群主";break;
						default:selfTitle = "";break;
					}
					//设置群头衔
					conversation.set_title(selfTitle, currPi.group_member_type);
					//
					//设置会话禁言状态,取当前会话对应的群组的禁言状态进行设置
					this.setSilenced(conversation);

					for(var i=0;i<vm.$store.state.messages.grouplist.length;i++){
						if(other.id==vm.$store.state.messages.grouplist[i]._id){
							group_details=vm.$store.state.messages.grouplist[i];
							break;
						}
					}
				}else{
					var th=this;
					var time=setInterval(function(){
						if(vm.$store.state.group_switch){
							th.receive(info);
							clearInterval(time);
						}
					},300)
					return conExist;
				}
			}
			//type = info.conversationType;
		} else {
			//发消息情况下，判断会话类型
			console.log(info)
			if (!info.description) { //私聊
				type = 1;
				me.id = vm.$store.state.current_user._id;
				me.no = vm.$store.state.current_user.no;
				other.id = info.user._id;
				other.no = info.no;
				conExist = this.conversationExist(me.id, other.id, con, me.no, other.no);
				if (!isNaN(conExist))
					return conExist;
				else {
					me.headimg = vm.$store.state.current_user.headimg;
					me.name = vm.$store.state.current_user.name;
					//me.no = vm.$store.state.current_user.no;
					other.headimg = info.headimg;
					other.name = info.name;
					//other.no = info.no;
					other.deviceid = info.device._id;
				}
				conversation = new Conversation(me, other);
			} else { //群聊
				//
				type = 3;
				me.id = info.member._id;
				me.no = info.member.no;
				console.log(info)
				other.id = info._id;
				conExist = this.conversationExist(me.id, other.id, con, me.no);
				console.log(conExist)
				if (!isNaN(conExist))
					return conExist;
				else {
					me.headimg = info.member.headimg;
					me.name = info.member.name;
					//me.no = info.member.no;
					other.headimg = info.headimg;
					other.name = info.name;
					other.no = info.no;
					other.deviceid = info._id;
				}
				conversation = new Conversation(me, other);
				conversation.set_group(true);

				//设置会话群禁言状态,取当前会话对应的群组的禁言状态进行设置
				// console.log('我的当前身份类型:',this.checkMemberType(other.id, me.id))
				// if (this.checkMemberType(other.id, me.id) == 1) {//我的当前身份为普通用户
				// 	if (this.findGroupDetail(other.id).silenced) {//群处于禁言状态
				// 		conversation.set_silenced(1);
				// 	} else {
				// 		conversation.set_silenced(0);
				// 	}
				// } else {
				// 	conversation.set_silenced(0);
				// }
				// conversation.set_silenced(this.findGroupDetail(other.id).silenced);	

				this.setSilenced(conversation);

				console.log(info.member.group_member_type);
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
		}
		conversation.unreadCount = 0;//初始化未读消息数目为0
		con.push(conversation);	
		console.log(conversation,conExist);
		if(conversation && isreseive){
			if(!conversation.isGroup){
				vm.$store.state.openfriend(vm.$store.state,other.id,other,chat);
			}else{
				vm.$store.state.opengroup(vm.$store.state,group_details._id,group_details,chat);
			}
		}
		console.log('会话数组:');
		console.log(con);
		return (con.length - 1);//创建新对话后返回对话数组最后一个索引值，此处需要修正
	},

	send: function (index, type, content_url, chat_type, temp, atList,title,defaultcontent) {
		var targetType;
		
        //找到index对应的会话，设置该会话中消息的target_type
        if (vm.$store.state.chat.conversation[index].isGroup) {
            targetType = 1;
        } else {
            targetType = 0;
        }	
		var body={
			sender_id:vm.$store.state.chat.conversation[index].me.id,
		    sender_no:vm.$store.state.chat.conversation[index].me.no,
		    sender_name:vm.$store.state.chat.conversation[index].me.name,
		    sender_head_img:vm.$store.state.chat.conversation[index].me.headimg,
		    msg_type:0,
		    msg_time:new Date().getTime(),
		    msg_content_type:type,
		    msg_content:mpIM.toBase64(JSON.stringify({
		      speakType:chat_type,   
		      content:content_url,
		      atList:[],     
		      defaultContent: defaultcontent, 
		      temp:temp
		    })),
		    target_type:targetType,
		    target_id:vm.$store.state.chat.conversation[index].other.id,
		    target_no:vm.$store.state.chat.conversation[index].other.no-0,
		    group_member_title:title,
		}
		mpIM.send(body)
	},
	uploaderimg:function(index){
		var me=this;
		console.log('运行'+index)
		var qiniu=Qiniu.uploader({
		    runtimes: 'html5,flash,html4',                 //上传模式,依次退化
		    browse_button: 'pickfiles'+index,             //上传选择的点选按钮，**必需**
		  	uptoken_url: 'http://test.mrpyq.com/api/qiniu',//Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
		   // uptoken : 'TUo-Zhi8ICQGKqHVuIzL1rYdb5itNEF4F6fQzJjr:kgY7N3pZmmaSISiqDa-5Z1K694s=:eyJzY29wZSI6Im1yd2VjaGF0IiwiZGVhZGxpbmUiOjE0OTU1MzA4OTV9', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
		    // unique_names: true, 					   // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
		    // save_key: true,   					  // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
		    domain: 'http://7x2wk4.com2.z0.glb.qiniucdn.com/',   //bucket 域名，下载资源时用到，**必需**
		    get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
		    container: 'container'+index,          //上传区域DOM ID，默认是browser_button的父元素，
		    max_file_size: '100mb',               //最大文件体积限制
		    flash_swf_url: './js/Moxie.swf',     //引入flash,相对路径
		    max_retries: 2,                     //上传失败最大重试次数
		    dragdrop: false,                   //开启可拖曳上传
		    // drop_element: 'container',     //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
		    chunk_size: '4mb',               //分块上传时，每片的体积
		    auto_start: true, 				//选择文件后自动上传，若关闭需要自己绑定事件触发上传
		    save_key: false,
		    unique_names: false,         
		    init: {
		        'FilesAdded': function(up, files) {
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
		        'BeforeUpload': function(up, file) {
		        	var fileItem = file.getNative(),
	                url = window.URL || window.webkitURL || window.mozURL;
	                var src = url.createObjectURL(fileItem);
	               	var msg=new Msg(index,1,{url:src,id:file.id},0, 0,new Date().getTime(),true);
	               	console.log('上传前')
		        },
		        'UploadProgress': function(up, file){
		        },
		        'FileUploaded': function(up, file, info) {
		        	// 	chat.send(index, type, content_url, chat_type, temp)
					// index 发送目标序号
					// type 发送类型，0为文本，1为图片，2为魔法表情，3为红包，4为礼物。
					// content_url 发送内容，文本或url
					// chat_type 聊天类型 0为角色说，1为本人说，2为剧情
					// temp 0 普通消息 1 临时消息
					console.log('上传后')
	                for(var i=0;i<vm.$store.state.chat.conversation[index].msg.length;i++){
	                	console.log(vm.$store.state.chat.conversation[index].msg[i].id,file.id)
	                	if(vm.$store.state.chat.conversation[index].msg[i].id==file.id){
	                		var message=vm.$store.state.chat.conversation[index].msg[i];
	                		message.send_success=true;
	                		message.url='http://7x2wk4.com2.z0.glb.qiniucdn.com/'+JSON.parse(info).key;
	                		vm.$store.state.chat.conversation[index].msg.splice(i,1,message);
	                		break;
	                	}
	                }
					// var msg=new Msg(index,1,'http://7x2wk4.com2.z0.glb.qiniucdn.com/'+JSON.parse(info).key,0, 0,new Date().getTime(),true);
					// msg.set_send_success();
		   			me.send(index,1,'http://7x2wk4.com2.z0.glb.qiniucdn.com/'+JSON.parse(info).key,0,0)
		        },
		        'Error': function(up, err, errTip) {
		        	console.log(err)
		        },
		        'UploadComplete': function() {
		               //队列文件处理完毕后,处理相关的事情
		        },
		        'Key': function(up, file) {
		            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
		            // 该配置必须要在 unique_names: false , save_key: false 时才生效
		            var key = new Date().getTime();
		            return key
		        }
		    }
		})
	},
	//根据以后接口改参数，礼物类型等等
	send_gift: function (index) {
		var gift = this.get_gift();
		this.send(index, 4, gift.name, 0, 0, gift);
	},
	send_magicimg: function (index, type) {
		//0骰子1猜拳
		var magicimg = this.get_magicimg(type)
		// this.send(index, 2, magicimg.magicPicDesc, 0, 0, magicimg);
		this.send(index, 2, magicimg, 0, 0, undefined, magicimg.magicPicDesc);
	},

	//找到群详细数组中指定群ID的群详细项
	findGroupDetail: function (groupId) {
		var groupDetail;
		var groupsDetail = vm.$store.state.messages.groupsDetail;
		console.log("当前账号所有群的群详细");
		console.log(groupsDetail);
		for (var i = 0,l = groupsDetail.length;i < l;i++) {
			if (groupId == groupsDetail[i]._id) {
				groupDetail = groupsDetail[i];
				break;
			}
		}
		return groupDetail;
	},

	//根据群id和皮id判断此皮在群中的身份
	checkMemberType: function (groupId, userId) {
        
        
		//根据groupId找到对应群的群详细
		var memberType = 1;
		// var groupDetail;
		// var groupsDetail = vm.$store.state.messages.groupsDetail;
		// console.log("当前账号所有群的群详细");
		// console.log(groupsDetail);
		// for (var i = 0,l = groupsDetail.length;i < l;i++) {
		// 	if (groupId == groupsDetail[i]._id) {
		// 		groupDetail = groupsDetail[i];
		// 		break;
		// 	}
		// }
		// console.log("发言人所属群的群详细");
		var groupDetail = this.findGroupDetail(groupId);

		console.log(groupDetail);
		if (groupDetail) {
			//先判断此皮是否是群主
			if (userId == groupDetail.owner._id) {
				memberType = 20;
                
			}
			//再判断此皮是否属于管理员组
			for (var j = 0,jl = groupDetail.admins.length;j < jl;j++) {
				if (groupDetail.admins[j]._id == userId) {
					memberType = 10;
					break;
				}
			}
		}
		return memberType;
	},

	setSilenced: function (con, status) {
		var conversation = con;
		var otherId = con.other.id;
		var meId = con.me.id;
		//设置会话禁言状态,取当前会话对应的群组的禁言状态进行设置
		console.log('我的当前身份类型:',this.checkMemberType(otherId, meId))
		console.log("status为:", status);
		if (status === undefined) {//status不存在时，属于取群详细设置会话禁言的情形
			if (this.checkMemberType(otherId, meId) == 1) {//我的当前身份为普通用户
				if (this.findGroupDetail(otherId).silenced) {//群处于禁言状态
					conversation.set_silenced(1);
				} else {
					conversation.set_silenced(0);
				}
			} else {//群主，管理员不受影响
				conversation.set_silenced(0);
			}
		} else { //status存在时，属于消息通知的情形
			if (this.checkMemberType(otherId, meId) == 1) {//我的当前身份为普通用户

				// if (status) {//群处于禁言状态
				// 	conversation.set_silenced(1);
				// } else {
				// 	conversation.set_silenced(0);
				// }
				conversation.set_silenced(status);
			} else {//群主，管理员不受影响
				conversation.set_silenced(0);
			}
		}
		
	},
	//接收消息
	//消息体：
	//////******************属性为零的属性会被省略******************//////
	/*string target_id = 2;
    int64 target_no = 3;
    string sender_id = 4;
    int64 sender_no = 5;
    string sender_name = 6;
    string sender_head_img = 7;
    TargetType target_type:{
        PRIVATE = 0;
        GROUP = 1;
        CHATROOM = 2;
    }
    MsgType msg_type:
    {
        CHAT = 0;
        CMD = 1;
        SYSTEM = 2;
    }
    int64 msg_time:new Date().getTime();
    int32 msg_content_type：
    {
        SCMessageContentTypeText,0
        SCMessageContentTypeImage,1
        魔法表情
        SCMessageContentTypeAnimation,2
        红包
        SCMessageContentTypeEnvelope,3
        SCMessageContentTypeGif,4
    }
    bytes msg_content：
    {
        "speakType"         :SCMessageSpeakType,
        "content"           :String 原rongmsgcontent的exta中的content字段 可能是json字符串,
        "atList"            :Array, 
        "defaultContent"    :String(新的消息类型，解析不了的时候，默认是SCMessageContentTypeText类型，这个类型默认从这个字段读取content)原rongmsgcontent的content字段，用作兼容,
        "temp"              :Int
    }*/
    receivetext: function(message) {
        //首先构建一条msg
        // this.content
        // this.content_type
        // this.url
        // this.chat_type
        // this.temp
        // this.time
        // this.revoke
        // this.extra_content
        // this.speaker
        // this.revoke
        // this.revoke_user
        // this.atList
        var index = this.start(message, 1);
        console.log('index=' + index);
        if (index === undefined) {
            return;
        }

        var msg = new Msg(index, message.msg_content_type, message.msg_content.content, message.msg_content.speakType, message.msg_content.temp, message.msg_time, message.me);


        //对收到的消息设置uid
        msg.set_uid(message.msg_uid);

        //群消息需要设置发言人
        if (message.target_type == 1) {//为群会话消息，需要在msg中添加发言人信息
            var speaker = {
                speakerName: message.sender_name,
                speakerHeadimg: message.sender_head_img,
                speakerId: message.sender_id,
                speakerNo: message.sender_no,
                speakerTitle: message.group_member_title,
            }

            speaker.memberType = this.checkMemberType(message.target_id,message.sender_id);
            msg.set_from(speaker);
        }
        console.log('本地會話数组:', vm.$store.state.chat.conversation);

    },
    //发通知消息
    cmd_sender: function() {
        if (arguments[0] == "msg_revoke")
            CmdHandler.S_revoke(arguments[1], arguments[2], arguments[3])

        if (arguments[0] == "couple_apply_reply" || arguments[0] == "couple_divorce_reply")
            CmdHandler.couple_reply(arguments[0], arguments[1], arguments[2], arguments[3])

        // if (arguments[0] == "enter_group") {

        // }//进群
    },

    //判断数组中是否有某个元素
    in_array: function(item, itemArray) {
        for (var i = 0; i < itemArray.length; i++) {
            if (item == itemArray[i]) {
                return true;
            }
        }
        return false;
    },

    //通知消息较多，单独拿出来
    cmd_receiver: function(message) {
        if (message.content.name == "msg_revoke") //消息撤回通知
            CmdHandler.R_revoke(message)
        else if (message.content.name == "couple_apply" || message.content.name == "couple_divorce")
            CmdHandler.R_couple(message)
        else if (this.in_array(message.content.name, vm.$store.state.messages.group_cmds)) {
            CmdHandler.R_group(message)
        } //判断是否属于群组通知


        // if (message.content.name == "group_join" || message.content.name == "group_invite" ||
        //  message.content.name == "group_kick" || message.content.name == "admin_cancel" || 
        //  message.content.name == "admin_setting" || message.content.name == "group_transfer")//群通知
        //  CmdHandler.R_group(message)







        //      "group_join"
        //      "group_kick"
        //      "group_quit"
        //      "group_invite"
        //      "admin_setting" 
        //      "admin_cancel"
        //      "group_transfer"
        //      "friend_apply"
        //      "friend_delete"
        //      "couple_apply"
        //      "couple_divorce"
        //      "group_silenced" //
        //      "group_title"
        //      "group_admin_changed"
        //      "msg_transmit"
    },
    //需要接口
    get_gift: function() {
        var gift = {
            count: 1,
            gid: "583ceb995b5eac57aa0846ee",
            name: "棒棒糖",
            senderDeviceID: "58252d066e998f6bfd67f783",
            senderHeadimg: "http://7x2wk4.com2.z0.glb.qiniucdn.com/Fq6Uxh4S3SkNlEcAEsTLPs08QlcW-head",
            senderName: "折原临也",
            senderUserID: "551d812efbe78e6ec27b1049",
            senderUserNo: 230,
            type: 0,
            url: "http://7x2wk4.com1.z0.glb.clouddn.com/gift/002.png",
        }
        return gift;
    },
    //需要动态更改
    get_magicimg: function(type) {
        if (!type) {
            //点数
            var random_dice = Math.ceil(Math.random() * 6),
                dice = {
                    animatedPicLocalUri: "asset:///magic_pic/dice/dice_anim_" + random_dice + ".webp",
                    animatedPicUrl: "http://7x2wk4.com2.z0.glb.qiniucdn.com/magic_pic/dice/dice_anim_" + random_dice + ".webp",
                    magicPicDesc: "[骰子]",
                    magicPicType: "DICE",
                    staticPicLocalUri: "asset:///magic_pic/dice/dice_" + random_dice + ".webp",
                    staticPicUrl: "http://7x2wk4.com2.z0.glb.qiniucdn.com/magic_pic/dice/dice_" + random_dice + ".webp",
                }
            return dice;
        } else {
            //1石头2剪刀3布
            var random_roshambo = Math.ceil(Math.random() * 3),
                roshambo = {
                    animatedPicLocalUri: "asset:///magic_pic/roshambo/roshambo_anim_" + random_roshambo + ".webp",
                    animatedPicUrl: "http://7x2wk4.com2.z0.glb.qiniucdn.com/magic_pic/roshambo/roshambo_anim_" + random_roshambo + ".webp",
                    magicPicDesc: "[猜拳]",
                    magicPicType: "ROSHAMBO",
                    staticPicLocalUri: "asset:///magic_pic/roshambo/roshambo_" + random_roshambo + ".webp",
                    staticPicUrl: "http://7x2wk4.com2.z0.glb.qiniucdn.com/magic_pic/roshambo/roshambo_" + random_roshambo + ".webp",
                }
            return roshambo;
        }
    },
}
export default chat;
