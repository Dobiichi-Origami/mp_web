<template>
    <div id="box">
    	<h1>聊天demo</h1>
    	<p @click="test(0)">给index0发消息</p>
    	<p @click="test(1)">给index1发消息</p>
    	<p @click="test(2)">给index0发魔法表情</p>
   		<input type="file" accept="image/jpeg,image/jpg,image/png"  @change="change($event)">
   		<p @click="test(4)">向index0撤回消息</p>
   		<p @click="test(5)">向cmd_msg[0]同意求婚</p>
   		<p @click="test(6)">向cmd_msg[0]拒绝求婚</p>
   		<p @click="test(7)">向cmd_msg[0]同意离婚</p>
   		<p @click="test(8)">向cmd_msg[0]拒绝离婚</p>
		<br>
   		<h1>新IM聊天demo</h1>
		<p @click="newTest(0)">给</p>
    </div>
</template>

<script>
	import chat from "src/chat"

	export default {
		data() {
			return {

			}
		},
		methods: {
			//index0对应的conversation为群组conversation
			test: function(index) {
				if (index == 0)
					chat.send(0, 0, "可爱", 0, 0);
				if (index == 1)
					chat.send(1, 0, "可爱", 0, 0);

				if (index == 2)
					chat.send_magicimg(0, 1);

				if (index == 4)
					chat.cmd_sender("msg_revoke", 0, 1, "")

				if (index == 5)
					chat.cmd_sender("couple_apply_reply", 0, "accept")

				if (index == 6)
					chat.cmd_sender("couple_apply_reply", 0, "reject", "对不起，你是个好人")

				if (index == 7)
					chat.cmd_sender("couple_divorce_reply", 0, "accept")

				if (index == 8)
					chat.cmd_sender("couple_divorce_reply", 0, "reject", "当然是选择原谅我啊")

			},
			// newTest: function(index) {
			// 	if (index == 0) {
			// 		var data={
			// 		    sender_id:'550d6af6fbe78e1ec58b95ca',
			// 		    sender_no:219,
			// 		    sender_name:'abc',
			// 		    sender_head_img:'http://7x2wk4.com2.z0.glb.qiniucdn.com/FjSVAW5sjDmeort4fXB6OZ5JLlJ7-head',
			// 		    msg_type:0,
			// 		    msg_time:new Date().getTime(),
			// 		    msg_content_type:0,
			// 		    msg_content:mp.toBase64(JSON.stringify({
			// 		      speakType:0,
			// 		      content:'一个测试test',
			// 		      atList:[],
			// 		      temp:0
			// 		    })),
			// 		    target_type:0,
			// 		    target_id:'551d812efbe78e6ec27b1049',
			// 		    target_no:230
			// 		}
			// 		chat.newIMSend(data);
			// 	}
			// },
			change: function(e) {
				chat.send_img(e)
			}
		},

	}

</script>

<style scoped="true">
	div #box {
		width: 660px;
		margin-top: 0;
		min-height: 800px;
		background: #aaa;
		font-size: 22px;
	}
	
	h1 {
		text-align: center;
	}
	
	p {
		width: 250px;
		border-bottom: 1px solid #333;
	}

</style>
