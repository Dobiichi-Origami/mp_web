<template>
  <div id="out_box">
  <seeimg></seeimg>
    <header>
      <div id="title">
        <a href="http://test.mrpyq.com/" target="_blank" @click="logo_click">
          <div id="logo">

            <img src="~assets/Main_page/logo.png" alt="logo"> 名人朋友圈
          </div>
        </a>
        <span id="title_name">
					{{$store.state.title}}
				</span>
        <span id="logout" @click='logout'>登出</span>
      </div>
    </header>
    <div id="box">
      <div id="left">
        <div id="user_info" class="border_box">
          <p id="headimg">
            <img data-router='个人主页' v-show='this.$store.state.current_user' :src="$store.state.current_user.headimg" alt="用户头像" @click="personal_click">
          </p>
          <div class="user_scroll_box">
            <div class="user_scroll name_s">
              <P id="name">{{$store.state.current_user.name}}</P>
            </div>
          </div>
          <p id="level">Lv.{{level}}</p>
          <div class="user_scroll_box">
            <div class="user_scroll des_s dec">
              <p id="descript">
                {{$store.state.current_user.description}}
              </p>
            </div>
          </div>
        </div>
        <div id="func_scroll_box">
          <div id="func" class="border_box">
<!--     消息    -->
            <div id="msg" class="func_box ul" data-router='消息' @click="news_click">
              消息
              <div v-show="$store.state.news !=0" class="new_message">{{$store.state.news}}</div>

              <img src="~assets/Main_page/msg.png" alt="消息" class="func_img" data-router='消息'>
            </div>
<!--    切换专区        -->
            <ul id="zone" class="ul">
              <div class="func_box" @click="change_arrow" data-arrow='arrow1'>切换专区

                <img src="~assets/Main_page/change_zone.png" alt="切换专区" class="func_img" data-arrow='arrow1'>
                <div :class="[{func_arrow_right:!arrow1},{func_arrow_down:arrow1}]" data-arrow='arrow1'></div>
              </div>
              <transition name="ul">
                <div id="li1" class="ul_scroll dec" v-show="li1">
                  <transition-group name="ul_li">
                    <li v-for="item in this.$store.state.rooms" :key="item._id" v-show="li1" :class="{current_select:item._id==$store.state.current_room._id}" :id="item._id" @click="change_room">
                      <img :src=item.headimg alt="专区头像" class="li_img">
                      <div class="omit">
                        {{item.name}}
                      </div>
                    </li>
                  </transition-group>
                </div>
              </transition>
            </ul>
<!--     切换身份       -->
            <ul id="identity" class="ul">
              <div class="func_box" @click="change_arrow" data-arrow='arrow2'>切换身份

                <img src="~assets/Main_page/identity.png" alt="切换身份" class="func_img" data-arrow='arrow2'>
                <div :class="[{func_arrow_right:!arrow2},{func_arrow_down:arrow2}]" data-arrow='arrow2'></div>
              </div>
              <transition name="ul">
                <div id="li2" class="ul_scroll dec" v-show="li2">
                  <transition-group name="ul_li">
                    <li v-for="item in this.$store.state.users" :key="item._id" v-show="li2" :class="{current_select:item._id==$store.state.current_user._id}" :id="item._id" @click="change_identity">
                      <img :src=item.headimg alt="名人头像" class="li_img">
                      <div class="omit">
                        {{item.name}}
                      </div>
                    </li>
                  </transition-group>
                </div>
              </transition>
            </ul>

            <ul  @click="jump_to_Addresslist" class="ul">
              <div class="func_box" >通讯录
              <img src="../assets/Main_page/identity.png" alt="切换身份" class="func_img" data-arrow='arrow2'>
              </div>
            </ul>

          </div>
        </div>
      </div>
      <div id="main">
        <div id="vue_model">
          <transition name="fade" mode="out-in">
            <router-view>
            </router-view>
          </transition>
        </div>
      </div>
      <activity id="right" class="border_box"></activity>
    </div>
    <btn id="btn" class="border_box"></btn>
    <message v-for="(list,index) in this.$store.state.message_window" :index="index" :list="list" v-show="list.show"></message>
    <system></system>
  </div>
</template>
<script>
  import message from "./page_func/message"
  import system from "./page_func/system_message"
	import chat from 'src/chat'
	import activity from "./page_func/activity"
	import btn from "./page_func/btn"
  import seeimg from "./page_func/seeimg.vue"
	export default {
		updated: function() {},
		components: {
			activity,
			btn,
      message,
      seeimg,
      system
		},
		mounted: function() {
			this.$http.get("http://test.mrpyq.com/api/qiniu", {
				}).then(
					(res) => {
						console.log(res.body)
					})
			var me = this,
				ele1 = document.getElementById("li1"),
				ele2 = document.getElementById("li2"),
				ele3 = document.getElementsByClassName("des_s")[0];
			//获取当前皮，专区等信息
			me.get_info();
			//me.level_bgcolor(); 重复
			me.$store.state.no_scroll(ele1);
			me.$store.state.no_scroll(ele2);
			me.$store.state.no_scroll(ele3);
		},
		name: 'Main_page',
		data() {
			return {
				level: 0,
				arrow1: false,
				arrow2: false,

				li1: false,
				li2: false,

			}
		},

		methods: {
			logout: function() {
				_czc.push(["_trackEvent", "功能", "登出"]);
				TDAPP.onEvent("功能", "登出");
				localStorage.clear();
				this.$router.push('/Login');
				//强制刷新页面
				window.location.reload();
			},
			logo_click: function() {
				_czc.push(["_trackEvent", "功能", "名朋logo点击"]);
				TDAPP.onEvent("功能", "名朋logo点击");
			},
			personal_click: function() {
				_czc.push(["_trackEvent", "功能", "点击个人头像"]);
				TDAPP.onEvent("功能", "点击个人头像");
				this.$store.state.current_user_pe = this.$store.state.current_user;
				if (/personal/i.exec(location.href) != null) {
					this.$store.state.personal_mounted(this.$store.state, this);
				} else {
					this.$router.push('/Main_page/Personal');
				}
			},
			news_click: function() {
				_czc.push(["_trackEvent", "功能", "点击查看消息"]);
				TDAPP.onEvent("功能", "点击查看消息");
				this.$store.state.news = 0;
				if (location.href.match('/Main_page/News') != null) {
					this.$store.state.news_mounted(this.$store.state, this);
				} else
					this.$router.push('/Main_page/News');
			},
			change_arrow: function(e) {
				var a = e.target.dataset.arrow,
					me = this;
				switch (a) {
					case 'arrow1':
						me.arrow1 = !me.arrow1;
						me.li1 = !me.li1;
						me.li2 = false;
						me.arrow2 = false;
						break;
					case 'arrow2':
						me.arrow2 = !me.arrow2;
						me.li2 = !me.li2;
						me.li1 = false;
						me.arrow1 = false;
						break;
					default:
						break;
				}
			},
			change_room: function(e) {
				_czc.push(["_trackEvent", "功能", "切换专区"]);
				TDAPP.onEvent("功能", "切换专区");
				var id = e.target.id || e.target.parentNode.id,
					me = this;
				me.$http.get("http://test.mrpyq.com/api/room/set_room", {
					params: {
						access_token: localStorage.getItem('access_token'),
						roomid: id,
					}
				}).then(
					(res) => {
						if (res.body.user && res.body.room) {
							var re = res.body;
							me.$store.commit('set', {
								obj: ['current_user', 'current_room', ],
								value: [re.user, re.room]
							})
							if (location.href.match('/Main_page/Home') == null) {
								this.$router.push('/Main_page/Home');
							} else {
								this.$store.state.home_mounted(this.$store.state, this);
							}
							me.level = me.$store.state.current_user.level_exp.level;
							me.level_bgcolor();
							me.arrow1 = !me.arrow1;
							me.li1 = !me.li1;
							me.current_room_first();
							//获取这个专区的皮
							me.$http.get("http://test.mrpyq.com/api/room/members_by_me", {
								params: {
									//page: 0,    先不传用默认，后去判断pagemore
									access_token: localStorage.getItem('access_token'),
									id: re.room._id,
								}
							}).then(
								(res1) => {
									if (res1.body.items) {
										var re1 = res1.body;
										me.$store.commit('set', {
											obj: ['users'],
											value: [re1.items]
										})
										//获取后几页的皮
										if (re1.pagemore) {
											me.user_page_more(2, re.room._id);
										}

										me.current_identity_first();
									} else if (res1.body.error)
										this.$store.state.f_error(this.$store.state, res1.body.error);
								}, (res1) => {
									this.$store.state.f_error(this.$store.state, "服务器正在开小差。。。");
								})
						} else if (res.body.error)
							this.$store.state.f_error(this.$store.state, res.body.error);
					}, (res) => {
						this.$store.state.f_error(this.$store.state, "服务器正在开小差。。。");
					})
			},
			change_identity: function(e) {
				_czc.push(["_trackEvent", "功能", "切换身份"]);
				TDAPP.onEvent("功能", "切换身份");
				var id = e.target.id || e.target.parentNode.id,
					me = this;
				me.$http.get('http://test.mrpyq.com/api/account/set_user', {
					params: {
						access_token: localStorage.getItem('access_token'),
						userid: id,
					}
				}).then(
					(res) => {
						if (res.body.user) {
							var re = res.body;
							me.$store.commit('set', {
								obj: ['current_user'],
								value: [re.user]
							})

							me.level = me.$store.state.current_user.level_exp.level;
							me.level_bgcolor();
							me.arrow2 = !me.arrow2;
							me.li2 = !me.li2;
							me.current_identity_first();
							//切换专区身份更改帖子下身份
							if (location.href.match(/Main_page\/Personal/i) != null) {
								for (var i = 0; i < this.$store.state.per_items.length; i++) {
									if (!this.$store.state.per_items[i].play) {
										this.$store.state.per_datas[i].play_user = this.$store.state.current_user;
									}
								}
							} else if (location.href.match(/Main_page\/News/i) != null) {
								for (var i = 0; i < this.$store.state.news_items.length; i++) {
									if (!this.$store.state.news_items[i].play) {
										this.$store.state.news_datas[i].play_user = this.$store.state.current_user;
									}
								}
							} else if (location.href.match(/Main_page\/Detail/i) != null) {
								//this.$store.state.detail_mounted(this.$store.state, this);
							} else {
								for (var i = 0; i < this.$store.state.home_items.length; i++) {
									if (!this.$store.state.home_items[i].play) {
										this.$store.state.home_datas[i].play_user = this.$store.state.current_user;
									}
								}
							}
						} else if (res.body.error) {
							this.$store.state.f_error(this.$store.state, res.body.error);
						}
					}, (res) => {
						this.$store.state.f_error(this.$store.state, "服务器正在开小差。。。");
					}
				)
			},
			jump_to_Addresslist: function() {
				this.$router.push('/Main_page/Addresslist');
				this.$store.state.title = "通讯录";
			},
			level_bgcolor: function() {
				var me = this,
					level = document.querySelector("#level"),
					level_color = me.level;
				if (level_color == 0)
					level.style.background = "#fff"
				else if (level_color < 4)
					level.style.background = "#7de0bf"
				else if (level_color < 10)
					level.style.background = "#55cde7"
				else if (level_color < 16)
					level.style.background = "#ffa559"
				else
					level.style.background = "#f6c302"
			},
			current_room_first: function() {
				var me = this,
					flag = 0,
					arr = me.$store.state.rooms,
					id = me.$store.state.current_room._id;
				for (let i = 0, l = arr.length; i < l; i++) {
					if (arr[i]._id == id) {
						flag = i;
						break;
					}
				}
				var a = arr[flag];
				me.$store.state.rooms.splice(flag, 1);
				me.$store.state.rooms.unshift(a);
			},
			//使当前身份保存在数组中的第一个
			current_identity_first: function() {
				var me = this,
					flag = 0,
					arr = me.$store.state.users,
					id = me.$store.state.current_user._id;
				for (let i = 0, l = arr.length; i < l; i++) {
					if (arr[i]._id == id) {
						flag = i;
						break;
					}
				}
				var a = arr[flag];
				me.$store.state.users.splice(flag, 1);
				me.$store.state.users.unshift(a);
			},
			//获取第page页的数据
			user_page_more: function(page, id) {
				var me = this;
				me.$http.get('http://test.mrpyq.com/api/room/members_by_me', {
					params: {
						page: page,
						access_token: localStorage.getItem('access_token'),
						id: id,
					}
				}).then(
					(resmore) => {
						if (resmore.body.items) {
							for (let i = 0, l = resmore.body.items.length; i < l; i++)
								me.$store.state.users.push(resmore.body.items[i])
						} else if (resmore.body.error) {

							me.$store.state.f_error(me.$store.state, resmore.body.error);
						}
						//判断pagemore
						if (resmore.body.pagemore) {
							page++;
							me.user_page_more(page, id);
						}
					}, (resmore) => {

						me.$store.state.f_error(me.$store.state, "服务器正在开小差。。。");
					})
			},
			get_info: function() {
				var me = this;

				//取不到access_token，直接去login页面
				if (!localStorage.getItem('access_token')) {
					me.$router.push('/Login')
					return;
				}
				//为显示身份列表，获取当前专区当前皮
				me.$http.get('http://test.mrpyq.com/api/account/current_account', {
					params: {
						access_token: localStorage.getItem('access_token')
					}
				}).then(
					(res) => {
						if (res.body.room && res.body.user) {
							console.log(res.body)
							var re = res.body,
								flag = 0;
							//获取当前专区的所有皮
							me.$http.get('http://test.mrpyq.com/api/room/members_by_me', {
								params: {
									//page: 0,    先不传用默认，后去判断pagemore
									access_token: localStorage.getItem('access_token'),
									id: re.room._id,
								}
							}).then(
								(res1) => {
									if (res1.body.items) {
										var re1 = res1.body;
										me.$store.commit('set', {
											obj: ['current_user', 'current_room', 'users'],
											value: [re.user, re.room, re1.items]
										})
										//开启即时通讯
										chat.login(me.$store.state.current_user.device._id);
										// me.$http.get('http://test.mrpyq.com/api/account/get_rongcloud_token', {
										// 	params: {
										// 		access_token: localStorage.getItem('access_token'),
										// 	}
										// }).then(
										// 	(res) => {
										// 		if (res.body.token) {
										// 			me.$store.state.chat.token = res.body.token;
										// 			me.$store.state.chat.deviceid = me.$store.state.current_user.device._id;
										// 			//调用login
										// 			chat.login(me.$store.state.chat.deviceid)
										// 		} else if (res.body.error) {
										// 			me.$store.state.f_error(me.$store.state, resmore.body.error);
										// 		}
										// 	},
										// 	(res) => {
										// 		me.$store.state.f_error(me.$store.state, "服务器正在开小差。。。");
										// 	}
										// )
										//获取后几页的皮
										if (re1.pagemore) {
											me.user_page_more(2, re.room._id);
										}
										me.level = me.$store.state.current_user.level_exp.level;
										me.current_identity_first();
										me.level_bgcolor();

										//personal_mounted 刷新个人主页避免person页面先执行接口传参取不到值
										//放在这里请求带参数之后再调用
										if (location.href.match(/Main_page\/Personal/i) != null) {
											this.$store.state.personal_mounted(this.$store.state, this);
										} else if (location.href.match(/Main_page\/News/i) != null) {
											this.$store.state.news_mounted(this.$store.state, this);
										} else if (location.href.match(/Main_page\/Detail/i) != null) {
											//this.$store.state.detail_mounted(this.$store.state, this);
										} else if (location.href.match(/Main_page\/Addresslist/i) != null) {
											if(this.$store.state.messages.groupsDetail.length){
												this.$store.state.friendcenter_mounted(this.$store.state, this);
											}
										} else {
											this.$store.state.home_mounted(this.$store.state, this);
										}
										//
									} else if (res1.body.error)
										this.$store.state.f_error(this.$store.state, res1.body.error);
								}, (res1) => {
									this.$store.state.f_error(this.$store.state, "服务器正在开小差。。。");
								}
							)
						} else if (res.body.error)
							this.$store.state.f_error(this.$store.state, res.body.error);

					}, (res) => {
						this.$store.state.f_error(this.$store.state, "服务器正在开小差。。。");
					}
				)
				//为显示专区列表，获取所有专区
				me.$http.get('http://test.mrpyq.com/api/room/rooms_by_me', {
					params: {
						access_token: localStorage.getItem('access_token')
					}
				}).then(
					(res) => {
						if (res.body.items) {
							var re = res.body;
							me.$store.commit('set', {
								obj: ['rooms'],
								value: [re.items]
							})
							me.current_room_first();
						} else if (res.body.error)
							this.$store.state.f_error(this.$store.state, res.body.error);
					}, (res) => {
						this.$store.state.f_error(this.$store.state, "服务器正在开小差。。。");
					}
				)
			},

		}
	}

</script>
<style scoped>
	.current_select {
		background: #323238 !important;
		color: white !important;
		border-bottom: 1px inset #bbb !important;
		position: relative;
	}
	
	.current_select:after {
		content: url("~assets/Main_page/selected.png");
		color: black;
		position: absolute;
		top: 2px;
		right: 10px;
	}
	
	.new_message {
		position: absolute;
		right: 10px;
		top: 17px;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: #ea4c4c;
		font-size: 16px;
		color: white;
		text-align: center;
		line-height: 2;
	}
	
	#out_box {
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
	
	#box{
		margin: 0 auto;
		margin-top: 72px;
		width: 1100px;
		overflow: auto;
	}
	
	#main {
		float: left;
		margin: 0 15px;
	}
	
	header {
		cursor: default;
		background: #323238;
		color: white;
		position: fixed;
		top: 0;
		width: 100vw;
		height: 40px;
		line-height: 40px;
		font-size: 28px;
		padding: 10px 0;
		text-align: center;
		overflow: hidden;
		z-index: 998;
		border-radius: 2px;
		box-shadow: 0 0 10px #666;
		transform: translateZ(0);
		-moz-transform: translateZ(0);
		-webkit-transform: translateZ(0);
		-ms-transform: translateZ(0);
		-o-transform: translateZ(0);
	}
	
	#title {
		width: 1100px;
		margin: 0 auto;
		position: relative;
	}
	
	#title_name {
		margin-left: 1em;
	}
	
	#logo {
		position: absolute;
		font-size: 20px;
		margin-left: 10px;
	}
	
	#logo img {
		float: left;
		margin-right: 15px;
	}
	
	#logout {
		position: absolute;
		font-size: 20px;
		right: 15px;
		cursor: pointer;
	}
	
	.border_box {
		border: 1px solid #ddd;
		border-radius: 2px;
		background: white;
		box-shadow: 1px 1px 6px #666;
	}
	
	#left {
		width: 200px;
		float: left;
	}
	
	#user_info {
		word-break: break-all;
		margin-bottom: 20px;
		padding: 0 10px;
		max-height: 380px;
	}
	
	#headimg {
		width: 100px;
		height: 100px;
		margin: 30px auto 10px auto;
	}
	
	#headimg img {
		width: 100px;
		border-radius: 100%;
		cursor: pointer;
	}
	
	#name {
		text-align: center;
		font-size: 22px;
		color: #4c4c4c;
		width: 178px;
		min-height: 33px;
		cursor: default;
	}
	
	#level {
		cursor: default;
		text-align: center;
		margin: 0 auto;
		font-size: 16px;
		width: 44px;
		height: 20px;
		line-height: 20px;
		border-radius: 4px;
		color: white;
	}
	
	#descript {
		width: 150px;
		font-size: 14px;
		color: #808080;
		user-select: text;
		margin: 0 auto;
		padding-right: calc(100% - 171px);
	}
	
	.user_scroll_box {
		overflow: hidden;
		width: 178px;
	}
	
	.user_scroll {
		overflow: auto;
		width: 198px;
	}
	
	.des_s {
		max-height: 130px;
		margin: 10px 0 22px 5px;
	}
	
	.name_s {
		max-height: 66px;
	}
	
	.ul {
		position: relative;
		overflow: hidden;
	}
	
	.dec {
		background: linear-gradient(white 15px, hsla(0, 0%, 100%, 0)) 0 0 / 100% 50px, radial-gradient(at top, rgba(0, 0, 0, .2), transparent 80%) 0 0 / 100% 10px, linear-gradient(to top, white 15px, hsla(0, 0%, 100%, 0)) bottom / 100% 50px, radial-gradient(at bottom, rgba(0, 0, 0, .2), transparent 80%) bottom / 100% 10px;
		background-repeat: no-repeat;
		background-attachment: local, scroll, local, scroll;
	}
	
	.li {
		display: none;
	}
	
	.omit {
		margin-left: 50px;
		width: 100px;
		padding-left: 10px;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		cursor: pointer;
	}
	
	.func_box {
		font-size: 22px;
		border-bottom: 1px solid #ddd;
		text-align: center;
		line-height: 3;
		overflow: hidden;
		cursor: default;
		transition: all 0.2s;
		cursor: pointer;
	}
	
	.func_box:hover {
		color: white;
		background: #bbb;
	}
	
	.ul_scroll {
		width: 220px;
		max-height: 300px;
		overflow: auto;
	}
	
	#func {
		background: white;
		border: none;
	}
	
	#identity>div {
		border-bottom: 1px solid #bbb;
	}
	
	#func ul li {
		position: relative;
		text-align: center;
		line-height: 3;
		font-size: 20px;
		color: #999;
		background: rgba(0, 0, 0, .05);
		width: 200px;
		border-bottom: 1px inset #e5e5e5;
		padding: 0 10px;
		box-sizing: border-box;
		cursor: default;
		overflow: hidden;
	}
	
	#func ul li:hover {
		color: white;
		border-bottom: 1px inset #bbb;
		background: #bbb;
		transition: 0.3s;
	}
	
	.li_img {
		width: 36px;
		height: 36px;
		border-radius: 100%;
		position: absolute;
		left: 25px;
		top: 15px;
	}
	
	.selected {
		position: absolute;
		right: 20px;
		top: 20px;
	}
	
	.func_img {
		position: absolute;
		left: 20px;
		top: 20px;
	}
	
	.func_arrow_right {
		position: absolute;
		right: 9px;
		top: 27px;
		border-top: 8px solid transparent;
		border-left: 10px solid #4e4e4e;
		border-bottom: 8px solid transparent;
	}
	
	.func_arrow_down {
		position: absolute;
		right: 9px;
		top: 30px;
		border-left: 8px solid transparent;
		border-top: 10px solid #4e4e4e;
		border-right: 8px solid transparent;
	}
	
	#right {
		float: left;
		width: 205px;
		overflow: hidden;
		position: relative;
	}
	
	#btn {
		position: fixed;
		transform: translateZ(0);
		-moz-transform: translateZ(0);
		-webkit-transform: translateZ(0);
		-ms-transform: translateZ(0);
		-o-transform: translateZ(0);
		bottom: 50px;
		right: calc((100vw - 1100px)/2);
		margin-right: calc(100% - 100vw);
	}
	
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.3s
	}
	
	.fade-enter,
	.fade-leave-active {
		opacity: 0;
	}
	
	.ul-enter-active {
		animation: ul-in .7s;
	}
	
	.ul-leave-active {
		animation: ul-out .5s;
	}
	
	.ul_li-enter-active {
		transition: opacity 0.7s
	}
	
	.ul_li-leave-active {
		transition: opacity 0.5s
	}
	
	@keyframes ul-in {
		0% {
			max-height: 0px;
			opacity: 0;
		}
		100% {
			max-height: 300px;
			opacity: 1;
		}
	}
	
	@keyframes ul-out {
		0% {
			max-height: 300px;
			opacity: 1;
		}
		100% {
			max-height: 0px;
			opacity: 0;
		}
	}

</style>
