const Chat = {
	state: {
		//连接融云，main_page页面赋值
		token: '',
		//自己的账号id，main_page页面赋值
		deviceid: '',
		//每一个消息有一个conversation，如果有插入，没有新建
		conversation: [], //eval(localStorage.getItem(localStorage.getItem('access_token')))
		//当前选择的图片
		selected_img: "",
		// //群@选皮标识
		// show_at_pi: false,
		//用户@时处于的当前会话index
		at_current_con_index: "",
		//好友中心数据
		messages: {
			friendlist: [],
			grouplist:[],//群列表，存储我的所有群(含有我在群中的身份信息)
			groupsDetail:[],//所有群的详细信息(方便查看成员类型)
			group_cmds:["group_join","group_quit","group_invite","group_kick","admin_cancel","admin_setting","group_transfer","group_silenced","group_admin_changed"],//群通知
		},
		//系统消息
		cmd_msg: {
			"friendCmd": [],
			"groupCmd": [],
			"count": 0 //通知总数
		},
		emojis:[],
		emoji: {
			"yan_emoji": [
		    "┭┮﹏┭┮", // 呜呜呜
		    "ヾ(￣▽￣)Bye~Bye~", // bye bye
		    "( ﹁ ﹁ ) ~→", // 斜眼
		    "Ψ(￣∀￣)Ψ", //美味
		    "✧(≖ ◡ ≖✿)", // 闪
		    "━━(￣ー￣*|||━━", //淡定
		    "(；′⌒`)", //伤心
		    "X﹏X", // 糟糕
		    "（＝。＝）", // 厌恶
		    "o(*^＠^*)o", // 乖
		    "o(￣ヘ￣o＃)", // 哼哼
		    "~~( ﹁ ﹁ ) ~~~", // 切
		    "┑(￣Д ￣)┍", // 恐怖
		    "(⊙﹏⊙)", // 呃呃呃
		    "o( =•ω•= )m", //喵星人
		    "┗( T﹏T )┛", // 投降
		    "(✿◡‿◡)", // 害羞
		    "（づ￣3￣）づ╭❤～", // 亲
		    "Σ( ° △ °|||)︴", // 汗
		    "Hi~ o(*￣▽￣*)ブ", //hi
		    "┗|｀O′|┛ 嗷~~", //嗷
		    "(☄⊙ω⊙)☄", //吓到
		    "( *￣▽￣)((≧︶≦*)", //蹭
		  ],
			"wen_emoji": [
		    "平身",
		    "你妈喊你回家吃饭",
		    "臣妾做不到啊!"
		  ],
			"magic_emoji": []
		}
	}
}
export default Chat;

//					headimg: "http://7x2wk4.com2.z0.glb.qiniucdn.com/Fn1WCby4LcrZgFgc-AWimeh5lQ0d-head",
//					id: "550cade1fbe78e19d5f868ab",
//					name: "王俊凯",
//					no: 1059,
//					//device id    15207185099 123456   皮：王俊凯
//					deviceid: "58b6204f1893be3ab01aa5a0",


//					headimg: "http://7x2wk4.com2.z0.glb.qiniucdn.com/FjSVAW5sjDmeort4fXB6OZ5JLlJ7-head",
//					id: "550d6af6fbe78e1ec58b95ca",
//					name: "蒙奇·D·路飞",
//					no: 219,
//					//device id     18851661055  123456   皮：路飞
//					deviceid: "58298c1e6e998f25af9c4cc6",
