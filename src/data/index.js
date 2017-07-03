import Vue from 'vue'
import Vuex from 'vuex'

//全局状态管理
Vue.use(Vuex)
import Chat from './chat.js'
import Plugin from './plugin.js'
import Mounted from './mounted.js'

const store = new Vuex.Store({
	//暂时用不到module，等数据大了再用  
	modules: {
		chat: Chat,
		plugin: Plugin,
		mounted: Mounted,
	},
	state: {
		domain: "http://test.mrpyq.com/api/",
		AwesomeMessage: false,
		unread: 0,
		show_at: false,
		//atid
		group_id: '',
		// //群at成员
		// at_list:[],
		//创建聊天窗口
		opengroup: function (state, id, grouplist, chat2) {
			var index = chat2.start(grouplist);
			if (state.message_window.length == 0) {
				state.message_window.push({
					group: grouplist,
					show: 1,
					index: index,
					not_open: true
				});
				state.message_ball.unshift({
					group: grouplist,
					show: 1,
					index: index,
					not_open: true
				});
			} else {
				for (var i = 0; i < state.message_window.length; i++) {
					if (state.message_window[i].group) {
						if (id == state.message_window[i].group._id) {
							var a = state.message_window[i];
							a.show = 1;
							state.message_window.splice(i, 1, a);
							for (var j = 0; j < state.message_ball.length; j++) {
								if (state.message_ball[j].index == index) {
									var b = state.message_ball[j];
									b.show = 1;

									state.message_ball.splice(j, 1);
									state.message_ball.unshift(b);
									break;
								}
							}
							return;
						} else if (i == state.message_window.length - 1) {
							state.message_window.push({
								group: grouplist,
								show: 1,
								index: index,
								not_open: true
							});
							state.message_ball.unshift({
								group: grouplist,
								show: 1,
								index: index,
								not_open: true
							});
							return;
						}
					} else if (i == state.message_window.length - 1) {
						state.message_window.push({
							group: grouplist,
							show: 1,
							index: index,
							not_open: true
						});
						state.message_ball.unshift({
							group: grouplist,
							show: 1,
							index: index,
							not_open: true
						});
						return;
					}
				}
			}
		},
		openfriend: function (state, info, chat2) {
			alert('openfriend')
			var friends = {
				name: info.chat_body.sender.name,
				no: info.chat_body.sender.no,
				headimg: info.chat_body.sender.head_img,
				user: {
					_id: info.chat_body.sender.id,
				}
			}
			var index = chat2.start(info);
			if (state.message_window.length == 0) {
				state.message_window.push({
					user: friends,
					show: 1,
					index: index,
					not_open: true
				});
				state.message_ball.unshift({
					user: friends,
					show: 1,
					index: index,
					not_open: true
				});
			} else {
				for (var i = 0; i < state.message_window.length; i++) {
					if (state.message_window[i].user) {
						if (friends.user._id == state.message_window[i].user.user._id && friends.no == state.message_window[i].user.no) {
							var a = state.message_window[i];
							a.show = 1;
							state.message_window.splice(i, 1, a);
							for (var j = 0; j < state.message_ball.length; j++) {
								if (state.message_ball[j].index == index) {
									var b = state.message_ball[j];
									b.show = 1;
									state.message_ball.splice(j, 1);
									state.message_ball.unshift(b);
									break;
								}
							}
							return;
						} else if (i == state.message_window.length - 1) {
							state.message_window.push({
								user: friends,
								show: 1,
								index: index,
								not_open: true
							});
							state.message_ball.unshift({
								user: friends,
								show: 1,
								index: index,
								not_open: true
							});
							return;
						}
					} else if (i == state.message_window.length - 1) {
						state.message_window.push({
							user: friends,
							show: 1,
							index: index,
							not_open: true
						});
						state.message_ball.unshift({
							user: friends,
							show: 1,
							index: index,
							not_open: true
						});
						return;
					} else {
						alert('linshi')
					}
				}
			}
			alert('out')
		},
		//判断未读消息数目
		unread_msg: function (id, state) {
			if (id == 'system') {
				var dom = document.querySelector('#system_msg');
				var w = parseInt(window.getComputedStyle(dom).width);
				if (w > 0) {
					return 1;
				} else {
					return 0;
				}
			} else {
				for (var i = 0; i < state.message_ball.length; i++) {
					var _id = state.message_ball[i].user ? state.message_ball[i].user.user._id : state.message_ball[i].group._id;
					if (_id == id) {
						var a = state.message_ball[i];
						state.message_ball.splice(i, 1);
						state.message_ball.unshift(a);
						break;
					}
				}
				var dom = document.querySelector('#win' + id);
				console.log('(((((((((((((((((((((((((((' + id)
				if (dom) {
					var w = parseInt(window.getComputedStyle(dom).width);
					if (w > 0) {
						return 1;
					} else {
						return 0;
					}
				} else {
					return 0;
				}
			}
		},
		//表情库
		//窗口加载
		windowchat: false,
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
		message_ball: [],
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
		IM_switch: false,
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
	},
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
