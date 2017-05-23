//构造融云content下extra结构体
import vm from 'src/main.js'
var con = vm.$store.state.chat.conversation;
class Extra {
	constructor(index, content_type, chat_type, tmp, extra_content) {
		//取最新一条数据
		// var last;
		// if (vm.$store.state.chat.conversation[index].msg.length)
		// 	last = vm.$store.state.chat.conversation[index].msg.length - 1;
		// else
		// 	last = 0;

		// this.contentType = con[index].msg[last].content_type//
		this.contentType = content_type;
		// this.customType = con[index].msg[last].chat_type//
		this.customType = chat_type;
		this.receiptHeadimg = con[index].other.headimg
		this.receiptId = con[index].other.id
		this.receiptName = con[index].other.name
		this.receiptNo = con[index].other.no
		this.selfHeadimg = con[index].me.headimg
		this.selfId = con[index].me.id
		this.selfName = con[index].me.name
		this.selfNo = con[index].me.no
		// this.temp = con[index].msg[last].temp//
		this.temp = tmp;
		//magicimg redpack gift有额外的content
		if (extra_content) {
			// this.content = con[index].msg[last].extra_content//
			this.content = extra_content;
		}
	}
}

export default Extra;
