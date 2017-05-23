<template>
	<div class="home_content">
		<seeimg></seeimg>
		<select_pi></select_pi>
		<div class="form_list">
			<small-content v-for="(item,itemindex) in $store.state.home_items" :item="item" :itemindex="itemindex"></small-content>
		</div>
	</div>
</template>
<script>
	import smallContent from "./small_content"
	import seeimg from "../../page_func/seeimg.vue"
	import select_pi from "../../page_func/select_pi.vue"
	export default ({
		data() {
			return {}
		},
		beforeCreate: function() {
			this.like = '../../../assets/i_like_32b7cd5a.png';
		},
		methods: {

		},
		components: {
			smallContent,
			seeimg,
			select_pi
		},
	})

</script>
<style>
	.home_content * {
		word-wrap: break-word;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}
	
	button {
		border: 0;
		background: none;
		overflow: visible;
		font-size: 14px;
	}
	
	.home_content .user_list:after,
	.home_content .user_list>div>div:nth-child(1):after,
	.home_content .text_content>p.active:after,
	.home_content .content>div:nth-child(2):after,
	.home_content .result_in>div:nth-child(1):after {
		display: block;
		clear: both;
		content: "";
		visibility: hidden;
		height: 0
	}
	
	.home_content .form_list {
		width: 660px;
	}
	
	.home_content .user_list {
		width: 100%;
		background: #fff;
		border-radius: 2px;
		margin-bottom: 20px;
		box-shadow: 1px 1px 6px #666;
	}
	
	.home_content .user_list>div {
		padding: 14px 34px 14px 20px;
	}
	
	.home_content .user_list>div>div:nth-child(1) {
		width: 100%;
	}
	
	.home_content .toBigger {
		cursor: zoom-in;
	}
	
	.home_content .headimg {
		float: left;
		width: 57px;
		height: 57px;
		cursor: pointer;
		border-radius: 50%;
	}
	
	.home_content .user_inform {
		float: left;
		margin-left: 23px;
	}
	
	.home_content .user_inform>h3 {
		font-weight: normal;
		margin-top: 15px;
		font-size: 16px;
		display: table;
	}
	
	.home_content .user_inform>p {
		font-size: 12px;
		color: #aaa8a8;
		display: table;
	}
	
	.home_content .i_like {
		margin-top: 18px;
		float: right;
		height: 21px;
	}
	
	.home_content .i_like>img {
		float: left;
		margin-top: 2px;
		margin-right: 10px;
		cursor: pointer;
	}
	
	.home_content .i_like>span {
		float: left;
		height: 21px;
		line-height: 21px;
	}
	
	.home_content .like_users_name {
		float: left;
		width: 585px;
	}
	
	.home_content .text_content>p {
		white-space: pre-wrap;
		word-wrap: break-word;
		margin: 14px 0;
		font-size: 16px;
		line-height: 22px;
		transition: all .2s;
	}
	
	.home_content .text_content>p.active {
		height: 132px;
		overflow: hidden;
	}
	
	.home_content .text_content a {
		color: rgb(72, 153, 237);
	}
	
	.home_content .text_content a.active {
		display: block;
	}
	
	.home_content .content>div:nth-child(2) {
		width: 100%;
		border-top: 1px solid #eee;
	}
	
	.home_content .content>div img {
		float: left;
		width: 178px;
		height: 178px;
		margin-left: 5px;
		padding: 10px 0;
	}
	
	.home_content .result {
		background: #fafafa;
		;
	}
	
	.home_content .result img {
		float: left;
	}
	
	.home_content .like_users_name span {
		float: left;
		line-height: 17px;
		margin-left: 12px;
		color: #54a1e9;
		cursor: pointer;
	}
	
	.home_content .like_users_name span.me_like {
		color: #dd6f5a;
	}

</style>
