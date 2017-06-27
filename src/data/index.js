import Vue from 'vue'
import Vuex from 'vuex'

//全局状态管理
Vue.use(Vuex)
import Chat from './chat.js'
import Plugin from './plugin.js'

const store = new Vuex.Store({
	//暂时用不到module，等数据大了再用  
	modules: {
		chat: Chat,
		plugin: Plugin,
	},
	state: {
		AwesomeMessage:false,
		unread:0,
		//获取群数据开关
		group_switch:false,
		show_at:false,
		//atid
		group_id:'',
		// //群at成员
		// at_list:[],
		//创建聊天窗口
		opengroup: function(state,id,grouplist,chat2){
				var index = chat2.start(grouplist);
				if (state.message_window.length == 0) {
					state.message_window.push({
						group: grouplist,
						show: 1,
						index: index,
						not_open:true
					});
					state.message_ball.unshift({
						group: grouplist,
						show: 1,
						index: index,
						not_open:true
					});
				} else {
					for (var i = 0; i < state.message_window.length; i++) {
						if(state.message_window[i].group){
							if (id == state.message_window[i].group._id) {
								// var dom = document.querySelector('#win' + id);
								// var w = parseInt(window.getComputedStyle(dom).width);
								// dom.style.transition = "width 1s,height 1s,top 1s,left 1s,border-radius 1s,opacity 1s";
								// dom.style.height = '0';
								// dom.style.width = '0';
								// dom.style.borderRadius = "50%";
								// dom.style.top = this.$store.state.pageY + 40 + 'px';
								// dom.style.left = this.$store.state.pageX + 40 + 'px';
								// console.log(this.$store.state.pageX)
								// dom.style.opacity = '0';
								// dom.style.zIndex = ++state.message_window_index;
								var a = state.message_window[i];
								a.show = 1;
								state.message_window.splice(i, 1, a);
								return;
							}else if (i == state.message_window.length - 1) {
							state.message_window.push({
								group: grouplist,
								show: 1,
								index: index,
								not_open:true
							});
							state.message_ball.unshift({
								group: grouplist,
								show: 1,
								index: index,
								not_open:true
							});
							return;
						}
						}
						 else if (i == state.message_window.length - 1) {
							state.message_window.push({
								group: grouplist,
								show: 1,
								index: index,
								not_open:true
							});
							state.message_ball.unshift({
								group: grouplist,
								show: 1,
								index: index,
								not_open:true
							});
							return;
						}
					}
				}
			},
			openfriend: function(state,info,chat2){
				var friends={
					name:info.chat_body.sender.name,
					no:info.chat_body.sender.no,
					headimg:info.chat_body.sender.head_img,
					user:{
						_id:info.chat_body.sender.id,
					}
				}
				var index = chat2.start(info);
				if (state.message_window.length == 0) {
					state.message_window.push({
						user: friends,
						show: 1,
						index: index,
						not_open:true
					});
					state.message_ball.unshift({
						user: friends,
						show: 1,
						index: index,
						not_open:true
					});
				} else {
					for (var i = 0; i < state.message_window.length; i++) {
						if(state.message_window[i].user){
							if (friends.user._id == state.message_window[i].user.user._id) {
								// var dom = document.querySelector('#win' + id);
								// var w = parseInt(window.getComputedStyle(dom).width);
								// dom.style.transition = "width 1s,height 1s,top 1s,left 1s,border-radius 1s,opacity 1s";
								// dom.style.height = '0';
								// dom.style.width = '0';
								// dom.style.borderRadius = "50%";
								// dom.style.top = this.$store.state.pageY + 40 + 'px';
								// dom.style.left = this.$store.state.pageX + 40 + 'px';
								// console.log(this.$store.state.pageX)
								// dom.style.opacity = '0';
								// dom.style.zIndex = ++state.message_window_index;
								var a = state.message_window[i];
								a.show = 1;
								state.message_window.splice(i, 1, a);
								return;
							} else if (i == state.message_window.length - 1) {
								state.message_window.push({
									user: friends,
									show: 1,
									index: index,
									not_open:true
								});
								state.message_ball.unshift({
									user: friends,
									show: 1,
									index: index,
									not_open:true
								});
								return;
							}
						}else if (i == state.message_window.length - 1) {
							state.message_window.push({
								user: friends,
								show: 1,
								index: index,
								not_open:true
							});
							state.message_ball.unshift({
								user: friends,
								show: 1,
								index: index,
								not_open:true
							});
							return;
						}
					}
				}
			},
		//判断未读消息数目
		unread_msg:function(id,state){
			if(id=='system'){
				var dom=document.querySelector('#system_msg');
				var w=parseInt(window.getComputedStyle(dom).width);
				if(w>0){
					return 1;
				}else{
					return 0;
				}
			}else{
				for(var i=0;i<state.message_ball.length;i++){
					var _id=state.message_ball[i].user?state.message_ball[i].user.user._id:state.message_ball[i].group._id;
					if(_id==id){
						var a=state.message_ball[i];
						state.message_ball.splice(i,1);
						state.message_ball.unshift(a);
						break;
					}
				}
				var dom=document.querySelector('#win'+id);
				console.log('((((((((((((((((((((((((((('+id)
				if(dom){
					var w=parseInt(window.getComputedStyle(dom).width);
					if(w>0){
						return 1;
					}else{
						return 0;
					}
				}else{
					return 0;
				}
			}
		},
		//表情库
		//窗口加载
		windowchat:false,
		//好友中心数据
		// messages: {
		// 	friendlist: [],
		// 	grouplist:[],//群列表，存储我的所有群(含有我在群中的身份信息)
		// 	groupsDetail:[],//所有群的详细信息(方便查看成员类型)
		// 	group_cmds:["group_join","group_quit","group_invite","group_kick","admin_cancel","admin_setting","group_transfer","group_silenced","group_admin_changed"],//群通知
		// },
		//details数据
		detail: [1],
		//聊天小窗位置
		pageX: 0,
		pageY: 0,
		act: true,
		message_window: [],
		message_ball:[],
		message_window_index: 999,
		//当前用户
		current_user: false,
		//当前用户身份
		current_user_pe: false,
		//当前专区
		current_room: false,
		//所有专区
		rooms: false,
		//用户在当前专区下的所有身份
		users: false,
		//刷新
		fresh: false,
		//删
		//add_number: 0

		//删除的帖子数
		per_number: 0,
		//个人主页帖子页数
		per_pagenumber: 1,
		//帖子是否有更多页
		per_pagemore: false,
		//个人主页的所有帖子
		per_items: [],
		//个人主页的所有帖子(封装后的数据)
		per_datas: [],

		//消息数目
		news: 0,
		//消息页数
		news_pagenumber: 1,
		//消息是否有更多页
		news_pagemore: false,
		//所有消息
		news_items: [],
		//所有消息(封装后的数据)
		news_datas: [],
		//消息时间
		news_date: false,

		//首页帖子页数
		pagenumber: 1,
		//首页帖子是否有更多页
		pagemore: false,
		//首页所有帖子
		home_items: [],
		//首页所有帖子(封装后的数据)
		home_datas: [],
		//回复消息提示????
		su_re: false,
		date: false,
		//大标题
		title: '',
		//转圈
		loader: false,


		//显示时间
		cheTime: function (historyTime, nowTime) {
			var _day, _hour, _min, _month, _week, _year, day, diffValue, halfamonth, hour, minute, month, now, result, year;
			now = nowTime ? nowTime : new Date().getTime();
			diffValue = now - historyTime;
			result = '';
			minute = 1000 * 60;
			hour = minute * 60;
			day = hour * 24;
			halfamonth = day * 15;
			month = day * 30;
			year = month * 12;
			_year = diffValue / year;
			_month = diffValue / month;
			_week = diffValue / (7 * day);
			_day = diffValue / day;
			_hour = diffValue / hour;
			_min = diffValue / minute;
			if (_year >= 1) {
				result = parseInt(_year) + "年前";
			} else if (_month >= 1) {
				result = parseInt(_month) + "个月前";
			} else if (_week >= 1) {
				result = parseInt(_week) + "周前";
			} else if (_day >= 1) {
				result = parseInt(_day) + "天前";
			} else if (_hour >= 1) {
				result = parseInt(_hour) + "个小时前";
			} else if (_min >= 1) {
				result = parseInt(_min) + "分钟前";
			} else {
				result = "刚刚";
			}
			return result;
		},
		//seeimg组件
		img_show: false,
		img_index: -1,
		img_photos: false,
		photos_show: [],
		see_img: function (state, index, photos) {
			state.img_show = true;
			console.log(state.img_show)
			state.img_index = index;
			state.img_photos = photos;
			state.photos_show[state.img_index] = true;
		},
		//error组件
		show_error: false,
		error: '',
		f_error: function (state, data) {
			state.error = data;
			state.show_error = true;
		},
		//select-pi组件
		show_select_pi: false,
		pi_index: 0,
		f_add_pi: function (state, index) {
			state.pi_index = index;
			state.show_select_pi = true;
		},
		//帖子详情
		details: {
			item: false,
			comments_pagemore: false,
			like_inform: false,
			me_inform: false,
			my_pi_like: false,
			play_user: false,
			comments: false,
		},
		//内部滑动，外部不滑动
		no_scroll: function (a) {
			var ff = window.navigator.userAgent,
				ffe = /firefox/i;
			if (ffe.exec(ff)) {
				//ff
				a.addEventListener("DOMMouseScroll", f2)

				function f2(e) {
					if (a.scrollTop == 0 && e.detail < 0) {
						e.preventDefault();
						a.removeEventListener("DOMMouseScroll", f2)
						a.addEventListener("DOMMouseScroll", f2)
						return;
					}
					if (a.scrollTop == a.scrollHeight - a.clientHeight && e.detail > 0) {
						e.preventDefault();
						a.removeEventListener("DOMMouseScroll", f2)
						a.addEventListener("DOMMouseScroll", f2)
						return;
					}
				}
			} else {
				//非ff
				a.onmousewheel = function (e) {
					if (a.scrollTop == 0 && e.wheelDelta > 0)
						return false;
					if (a.scrollTop == a.scrollHeight - a.clientHeight && e.wheelDelta < 0)
						return false;
				}
			}
		},
		friendcenter_mounted: function (state, th) {
			state.chat.messages.friendlist=[];
			state.title='通讯录';
			state.loader = true;
			th.$http({
				method: 'get',
				url: 'http://test.mrpyq.com/api/friend/list',
				params: {
					'access_token': localStorage.getItem('access_token'),
					'userid': state.current_user._id,
					'no': state.current_user.no,
				},
				emulateJSON: true,
			}).then((res) => {
				state.chat.messages.friendlist = res.body.items;
				console.log(res.body);
				console.log(0)
				state.loader = false;
			})
			th.$http({
				method: 'get',
				url: 'http://test.mrpyq.com/api/group/groups_by_me',
				params: {
					'access_token': localStorage.getItem('access_token'),
				},
				emulateJSON: true,
			}).then((res) => {
				state.chat.messages.grouplist = res.body.items;
				console.log(res.body);
			})
		},
		news_mounted: function (state, th) {
			_czc.push(["_trackEvent", "消息", "消息页面打开次数"]);
			TDAPP.onEvent("消息", "消息页面打开次数");
			//更换title
			state.title = "消息";
			state.loader = true;
			state.news_items = [];
			state.news_datas = [];
			state.news_pagemore = false;
			state.news_pagenumber = 1;
			state.news_date = new Date().getTime();
			//我的消息
			th.$http({
				method: 'get',
				url: 'http://test.mrpyq.com/api/feed/messages',
				params: {
					'access_token': localStorage.getItem('access_token'),
					'page': 1,
					't': state.news_date,
				},
				emulateJSON: true
			}).then((res) => {
				//items为消息数目
				if (res.body.items) {
					state.news_pagemore = res.body.pagemore;
					state.news_pagenumber++;
					state.news_items = res.body.items;
					for (var i = 0; i < res.body.items.length; i++) {
						var it = {
							dis: true,
							head_img_show: false,
							pi_show: false,
							play_user: res.body.items[i].feed ? (res.body.items[i].feed.play ? res.body.items[i].feed.play.user : state.current_user) : state.current_user,
						};
						state.news_datas.push(it);
					}
					state.loader = false;
				} else if (res.body.error) {
					state.f_error(state, res.body.error);
				}

				function fn(state, th) {
					for (var i = 0; i < state.news_items.length; i++) {
						state.news_datas[i].dis = true;
						state.news_datas[i].head_img_show = false;
						state.news_datas[i].pi_show = false;
					}
					var val = document.querySelectorAll('.me_comment div');
					for (let i = 0; i < val.length; i++) {
						val[i].innerHTML = '';
					}
				}
				document.onclick = function () {
					fn(state, th);
				}
			}, (res) => {
				state.f_error(state, "服务器正在开小差");
			})
		},
		detail_mounted: function (state, th) {
			state.details = {
					item: false,
					comments_pagemore: false,
					like_inform: false,
					me_inform: false,
					my_pi_like: false,
					play_user: false,
					comments: false,
				},
				state.loader = true;
			th.$http({
				method: 'get',
				url: 'http://test.mrpyq.com/api/feed/comments_by_feed',
				params: {
					'access_token': localStorage.getItem('access_token'),
					'id': state.feed_id ? state.feed_id : localStorage.getItem('feed_id'),
				},
				emulateJSON: true,
			}).then((res) => {
				if (res.body.feed) {
					state.details.item = res.body.feed;
					state.details.comments_pagemore = res.body.pagemore;
					state.details.like_inform = state.details.item.likeusers ? state.details.item.likeusers : [];
					state.details.me_inform = state.current_user;
					state.details.my_pi_like = false;
					state.details.play_user = state.details.item.play ? state.details.item.play.user : state.current_user;
					state.details.comments = res.body.items;
					state.loader = false;
				} else if (res.body.error) {
					if (res.body.error == "该帖子不存在") {
						_czc.push(["_trackEvent", "消息", "点击-帖子不存在"]);
						TDAPP.onEvent("消息", "点击-帖子不存在");
					}
					state.f_error(state, res.body.error);
					th.$router.push('/Main_page/News');
				}
			}, (res) => {
				state.f_error(state, "服务器正在开小差。。。");
			})
		},
		personal_mounted: function (state, th) {
			_czc.push(["_trackEvent", "个人中心", "个人中心页面打开次数"]);
			TDAPP.onEvent("个人中心", "个人中心页面打开次数");
			//更换title
			state.title = "个人中心"
			state.loader = true;
			state.per_number = 0;
			state.per_pagenumber = 1;
			state.per_pagemore = false;
			state.per_items = [];
			state.per_datas = [];
			if (!state.current_user_pe) {
				if (localStorage.getItem('current_user_pe')) {
					state.current_user_pe = JSON.parse(localStorage.getItem('current_user_pe'));
				}
			}
			localStorage.setItem('current_user_pe', JSON.stringify(state.current_user_pe));
			//请求个人主页的数据
			th.$http({
				method: 'get',
				url: 'http://test.mrpyq.com/api/feed/feeds_by_member',
				params: {
					'access_token': localStorage.getItem('access_token'),
					'no': state.current_user_pe.no,
					'page': state.per_pagenumber,
					'userid': state.current_user_pe._id,
				},
				emulateJSON: true
			}).then((res) => {
				if (res.body.items) {
					state.current_user_pe = res.body.user;
					//统计进入别人的个人主页
					if (state.current_user_pe._id != state.current_user._id) {
						_czc.push(["_trackEvent", "功能", "点击别人头像进别人主页"]);
						TDAPP.onEvent("功能", "点击别人头像进别人主页");
					}
					state.per_pagenumber++;
					state.per_pagemore = res.body.pagemore;
					state.per_items = res.body.items;
					for (var i = 0; i < state.per_items.length; i++) {
						var ob = {
							//本人是否赞
							me_if_like: false,
							//图片显示
							head_img_show: false,
							//控制按钮是否可点击
							dis: true,
							//我的评论内容
							me_co_con: '',
							//本人说
							myself_say: 0,
							//被回复者id
							replyuserid: '',
							//被回复者名
							replyusername: '',
							//被恢复者编号
							replyuserno: '',
							//帖子评论是否有更多页
							comments_pagemore: state.per_items[i].stat ? state.per_items[i].stat.comment > 20 : false,
							//帖子评论页数,默认2
							comments_page: 2,
							//帖子下的所有评论
							comments: state.per_items[i].comments,
							//内容高度过高而收起
							slideup: false,
							//????
							swi: true,
							//帖子内容高度
							con_height: 0,
							//给帖子点赞的人信息
							like_inform: state.per_items[i].likeusers ? state.per_items[i].likeusers : [],
							//当前用户身份
							me_inform: state.current_user_pe,
							//帖子下的扮演者赞帖
							my_pi_like: false,
							//帖子下的扮演
							play_user: state.per_items[i].play ? state.per_items[i].play.user : state.current_user,
							//帖子下扮演的所有角色
							feed_items: false,
							//是否显示在帖子下的扮演皮
							pi_show: false,
							//评论备份
							comment_beifen: [],
						}
						//判断帖子下的扮演者是否自己赞帖
						for (var j = 0; j < ob.like_inform.length; j++) {
							ob.like_inform[j].is_me = ob.like_inform[j]._id == ob.play_user._id;
							if (ob.like_inform[j].is_me) {
								ob.my_pi_like = true;
								break;
							}
						}
						//
						state.per_datas.push(ob);
					}
					state.loader = false;
				} else if (res.body.error)
					state.f_error(state, res.body.error);

				function fn(state) {
					if (state.per_datas) {
						for (var j = 0; j < state.per_datas.length; j++) {
							state.per_datas[j].pi_show = false;
							state.per_datas[j].dis = true;
							state.per_datas[j].head_img_show = false;
						}
					}
					var del = document.querySelectorAll('.de');
					for (let i = 0; i < del.length; i++) {
						del[i].children[0].className = '';
					}
					var del_ti = document.querySelectorAll('.de_my_title');
					for (let i = 0; i < del_ti.length; i++) {
						del_ti[i].children[1].className = '';
					}
					var val = document.querySelectorAll('.me_comment div');
					for (let i = 0; i < val.length; i++) {
						val[i].innerHTML = '';
					}
				}
				document.onclick = function () {
					fn(state);
				};
			}, (res) => {
				state.f_error(state, "服务器正在开小差");
			})
		},
		home_mounted: function (state, th) {
			_czc.push(["_trackEvent", "专区首页", "专区首页打开次数"]);
			TDAPP.onEvent("专区首页", "专区首页打开次数");
			//mounted更换title
			state.title = state.current_room.name;
			state.loader = true;
			//state.add_number = 0;
			state.pagenumber = 1;
			state.pagemore = false;
			state.home_items = [];
			state.home_datas = [];
			state.date = new Date().getTime();
			//获取首页帖子列表
			th.$http({
				method: 'get',
				url: 'http://test.mrpyq.com//api/feed/feeds_by_room',
				params: {
					'access_token': localStorage.getItem('access_token'),
					'page': state.pagenumber,
					't': state.date,
				},
				emulateJSON: true
			}).then((res) => {
				//items为帖子列表
				if (res.body.items) {
					state.pagenumber++;
					state.pagemore = res.body.pagemore;
					state.home_items = res.body.items;
					for (var i = 0; i < state.home_items.length; i++) {
						var ob = {
							head_img_show: false,
							//不允许评论
							dis: true,
							me_co_con: '',
							myself_say: 0,
							replyuserid: '',
							replyusername: '',
							replyuserno: '',
							comments_pagemore: state.home_items[i].stat ? state.home_items[i].stat.comment > 20 : false,
							comments_page: 2,
							comments: state.home_items[i].comments,
							slideup: false,
							//帖子展开或收起
							swi: true,
							con_height: 0,
							like_inform: state.home_items[i].likeusers ? state.home_items[i].likeusers : [],
							me_inform: state.current_user,
							my_pi_like: false,
							play_user: state.home_items[i].play ? state.home_items[i].play.user : state.current_user,
							feed_items: false,
							pi_show: false,
							comment_beifen: [],
						}
						for (var j = 0; j < ob.like_inform.length; j++) {
							ob.like_inform[j].is_me = ob.like_inform[j]._id == ob.play_user._id;
							if (ob.like_inform[j].is_me) {
								ob.my_pi_like = true;
								break;
							}
						}
						state.home_datas.push(ob);
					}
					state.loader = false;
				} else if (res.body.error) {
					state.f_error(state, res.body.error);
				}

				function fn(state) {
					if (state.home_datas) {
						for (var j = 0; j < state.home_datas.length; j++) {
							state.home_datas[j].pi_show = false;
							state.home_datas[j].dis = true;
							state.home_datas[j].head_img_show = false;
						}
					}
					var del = document.querySelectorAll('.de');
					for (let i = 0; i < del.length; i++) {
						del[i].children[0].className = '';
					}
					var del_ti = document.querySelectorAll('.de_my_title');
					for (let i = 0; i < del_ti.length; i++) {
						del_ti[i].children[1].className = '';
					}
					var val = document.querySelectorAll('.me_comment div');
					for (let i = 0; i < val.length; i++) {
						val[i].innerHTML = '';
					}
				}
				document.onclick = function () {
					fn(state);
				}
			}, (res) => {
				state.f_error(state, "服务器正在开小差");
			})
		},

	},
	//此为同步方法
	mutations: {
		set(state, {
			obj,
			value
		}) {
			for (let i = 0, l = obj.length; i < l; i++)
				state[obj[i]] = value[i];
		},
	},
})

export default store;
