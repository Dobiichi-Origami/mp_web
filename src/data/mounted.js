const Plugin = {
	state: {
		addresslist_mounted: function (state, th) {
			state.chat.messages.friendlist = [];
			state.title = '通讯录';
			state.loader = true;
			th.$http({
				method: 'get',
				url: state.domain + 'friend/list',
				params: {
					'access_token': localStorage.getItem('access_token'),
					'userid': state.current_user._id,
					'no': state.current_user.no,
				},
				emulateJSON: true,
			}).then((res) => {
				state.chat.messages.friendlist = res.body.items;
				if (state.chat.messages.grouplist)
					state.loader = false;
			})
			th.$http({
				method: 'get',
				url: state.domain + 'group/groups_by_me',
				params: {
					'access_token': localStorage.getItem('access_token'),
				},
				emulateJSON: true,
			}).then((res) => {
				state.chat.messages.grouplist = res.body.items;
				if (state.chat.messages.friendlist)
					state.loader = false;
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
				url: state.domain + 'feed/messages',
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
					state.plugin.f_error(state, res.body.error);
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
				state.plugin.f_error(state, "服务器正在开小差");
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
			};
			state.loader = true;
			state.title = "帖子详情";
			th.$http({
				method: 'get',
				url: state.domain + 'feed/comments_by_feed',
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
					state.plugin.f_error(state, res.body.error);
					th.$router.push('/Main_page/News');
				}
			}, (res) => {
				state.plugin.f_error(state, "服务器正在开小差。。。");
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
				url: state.domain + 'feed/feeds_by_member',
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
					state.plugin.f_error(state, res.body.error);

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
				state.plugin.f_error(state, "服务器正在开小差");
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
					state.plugin.f_error(state, res.body.error);
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
				state.plugin.f_error(state, "服务器正在开小差");
			})
		},
	}
}
export default Plugin;
