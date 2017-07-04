const Chat = {
	state: {
		//连接融云，main_page页面赋值
		token: '',
		//自己的账号id，main_page页面赋值
		deviceid: '',
		//每一个消息有一个conversation，如果有插入，没有新建
		conversation: [], //eval(localStorage.getItem(localStorage.getItem('access_token')))
		// //群@选皮标识
		// show_at_pi: false,
		//用户@时处于的当前会话index
		at_current_con_index: "",
		//好友中心数据
		messages: {
			friendlist: [],
			grouplist: [], //群列表，存储我的所有群(含有我在群中的身份信息)
			groupsDetail: [], //所有群的详细信息(方便查看成员类型)
		},
		//系统消息
		cmd_msg: {
			"friendCmd": [],
			"groupCmd": [],
			"friendCmdType": ['friend_apply', 'friend_delete', 'couple_apply', 'couple_divorce', 'couple_force_divorce'],
			"groupCmdType": ['group_join', 'group_kick', 'group_quit', 'admin_setting', 'admin_cancel', 'group_transfer', 'group_title', 'group_silenced', 'group_admin_changed'],
			"count": 0 //通知总数
		},
		close_by_me: false,
		emojis: [],
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
