<template>
    <div id="box">
    	<h1>聊天demo</h1>
    </div>
</template>

<script>
	import chat from "./../chat/mpIM/client.js"

	export default {
		data() {
			return {

			}
		},
		mounted:function(){
			var cha=new chat();
			console.log(localStorage.getItem('access_token'))
			var deviceinfo={
				token:localStorage.getItem('access_token'),
				type:'web',
				mac:'123'
			}
			cha.init(deviceinfo)
		},
		methods: {
			//index0对应的conversation为群组conversation

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
