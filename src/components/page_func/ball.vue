<template>
   <div class="content" id="window_container" @mousedown="down($event)" @click="select">
   		<p class="all_unread" v-show="$store.state.unread" @click.stop @mousedown.stop>{{$store.state.unread<99?$store.state.unread:'n+'}}</p>
   		<div class="container" @mousedown.stop :class="{act:$store.state.act}">
   			<div class="container_box">
   				<div class="container_content">
			   	<ul>
			   		<li @click.stop="open_system()">
			   			<i></i>
			   			<div class="unread_tishi" v-show="$store.state.chat.cmd_msg.count">{{$store.state.chat.cmd_msg.count<99?$store.state.chat.cmd_msg.count:'n+'}}</div>
			   			<p class="name_no">
					    	<span style="color:#956969">系统通知</span>
				    	</p>
				    	<p class="lastest_msg" style="color:#777">好友通知 / 群通知</p>
			   		</li>
			    	<li v-for="(list,index) in this.$store.state.message_ball" v-show="list.show"  @click.stop="openwindow($event,list.user?list.user.user._id:list.group._id,list.index,index)"><img :src="list.user?list.user.headimg:list.group.headimg" alt="">
			    		<span v-show="$store.state.chat.conversation[list.index].msg.length?$store.state.chat.conversation[list.index].msg[0].temp:0">临</span>
			    		<div class="unread_tishi" v-show="$store.state.chat.conversation[list.index].unreadCount">{{$store.state.chat.conversation[list.index].unreadCount<99?$store.state.chat.conversation[list.index].unreadCount:'n+'}}</div>
				    	<p class="name_no">
					    	<span>{{list.user?list.user.name:list.group.name}}</span>
					    	<span :style="list.group?'line-height:26px;color:rgb(149, 105, 105)':''">{{list.user?'NO.'+list.user.no:'(群组)'}}</span>
				    	</p>
				    	<p class="lastest_msg" v-if="list.group&& $store.state.chat.conversation[list.index].msg.length && $store.state.chat.conversation[list.index].msg[$store.state.chat.conversation[list.index].msg.length-1].chat_type!='SYSTEM'">
				    		{{$store.state.chat.conversation[list.index].msg[$store.state.chat.conversation[list.index].msg.length-1].me?'我':$store.state.chat.conversation[list.index].msg[$store.state.chat.conversation[list.index].msg.length-1].speaker.speakerName}}：{{$store.state.chat.conversation[list.index].msg[$store.state.chat.conversation[list.index].msg.length-1].content}}
				    	</p>
				    	<p class="lastest_msg" v-if="$store.state.chat.conversation[list.index].msg.length && $store.state.chat.conversation[list.index].msg[$store.state.chat.conversation[list.index].msg.length-1].chat_type=='SYSTEM' ">
				    		{{$store.state.chat.conversation[list.index].msg[$store.state.chat.conversation[list.index].msg.length-1].content}}
				    	</p>
				    	<p class="lastest_msg" v-if="list.user && $store.state.chat.conversation[list.index].msg.length">
				    		{{$store.state.chat.conversation[list.index].msg[$store.state.chat.conversation[list.index].msg.length-1].content}}
				    	</p>
			    	</li>
			    </ul>
			   <!--  <div contenteditable="true" @click.stop style="height:80px;overflow-y:scroll;overflow-x:hidden" @input="getvalue"><input type="text" value="25412"></div> -->
			    </div>
			</div>
	   </div>  
   </div>
</template>

<script>
	//导航按钮
	export default {
		data() {
			return {
				isclick:true,
			}
		},
		mounted:function(){
			var dom=document.querySelector('#window_container');
			this.$store.state.pageX=parseInt(dom.offsetLeft);			
			this.$store.state.pageY=parseInt(window.getComputedStyle(dom).top);
			this.$store.state.pageY=parseInt(dom.offsetTop);
			var me=this;
			document.onmouseup=function(){
				document.onmousemove=null;

				this.isclick=true;
				me.$store.state.pageX=parseInt(dom.offsetLeft);
				me.$store.state.pageY=parseInt(dom.offsetTop);
			}
		},
		methods: {
			open_system:function(){
				this.$store.state.unread-=this.$store.state.chat.cmd_msg.count;
				this.$store.state.chat.cmd_msg.count=0;
				var dom=document.querySelector('#system_msg');
				var w=parseInt(window.getComputedStyle(dom).width);
				if(w!=500){
					dom.style.height='611px';
					dom.style.width='500px';
					dom.style.borderRadius="8px";
					dom.style.opacity=1;
					dom.style.top='100px';
					dom.style.left=document.body.clientWidth/2-250+'px';
				}
				dom.style.zIndex=++this.$store.state.message_window_index;
			},
			getvalue:function(event){
				console.log(event.target.innerText)
			},
			openwindow:function(event,id,index,sindex){
				var a=this.$store.state.message_ball[sindex];
				console.log(a)
				this.$store.state.message_ball.splice(sindex,1);
				this.$store.state.message_ball.unshift(a);
				this.$store.state.act=false;
				this.$store.state.unread-=this.$store.state.chat.conversation[index].unreadCount;
				this.$store.state.chat.conversation[index].unreadCount=0;
				var dom=document.querySelector('#win'+id);
				var w=parseInt(window.getComputedStyle(dom).width);
				if(w!=500){
					dom.style.height='611px';
					dom.style.width='500px';
					dom.style.borderRadius="8px";
					dom.style.opacity=1;
					dom.style.top='100px';
					dom.style.left=document.body.clientWidth/2-250+'px';
				}
				dom.style.zIndex=++this.$store.state.message_window_index;
			},
			select:function(){
				if(this.isclick){
					this.$store.state.act=!this.$store.state.act;
					// for(var i=0;i<this.$store.state.chat.conversation.length;i++){
					// 	console.log(this.$store.state.unread_msg(this.$store.state.chat.conversation[i].other.id))
					// }
				}
			},
			down:function(event){
				this.isclick=true;
				var dom=event.target;
					var x=parseInt(dom.offsetLeft),
					y=parseInt(dom.offsetTop),
					x1=event.clientX,y1=event.clientY;
					this.notransition=true;
					var me=this;
					document.onmousemove=function(event){
						var evt=window.event||event,
						x2=evt.clientX,y2=evt.clientY;
						var a=x2-(x1-x),b=y2-(y1-y);
						evt.preventDefault();
						if(x2!=x1 || y2!=y1){
							me.isclick=false;
						}
						if(a<0){
							a=0;
						}else if(a>parseInt(window.innerWidth)-50){
							a=parseInt(window.innerWidth)-50
						}
						if(b<0){
							b=0;
						}else if(b>parseInt(window.innerHeight)-50){
							b=parseInt(window.innerHeight)-50
						}
						me.$store.state.pageX=a;
						me.$store.state.pageY=b;
						dom.style.left=a+'px';
						dom.style.top=b+'px';
						var win=document.querySelectorAll('.window_select');
						for(var i=0;i<win.length;i++){
							// console.log(win[i].offsetLeft)
							if(parseInt(window.getComputedStyle(win[i]).width)==0){
								win[i].style.top=b+25+'px';
								win[i].style.left=a+25+'px';
							}
						}
						me.$store.state.pageX=parseInt(dom.offsetLeft);
						me.$store.state.pageY=parseInt(dom.offsetTop);
					}
			},
		}
	}

</script>

<style scoped>
.all_unread{
	position: absolute;
	height:20px;
	width:20px;
	line-height:20px;
	text-align:center;
	font-size:14px;
	background:red;
	color:#fff;
	top:-3px;
	left:37px;
	border-radius:50%;
}
.lastest_msg{
	padding-left:10px;
	line-height: 18px;
	width:150px;
	text-align:left;
	font-size:12px;
	color:#956969;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
.unread_tishi{
	position: absolute;
	height:16px;
	width:16px;
	line-height:16px;
	text-align:center;
	font-size:12px;
	background:red;
	color:#fff;
	top:5px;
	left:45px;
	border-radius:50%;
}
.content{
	cursor: pointer;
	position: fixed;
	width:50px;
	height:50px;
	border-radius: 50%;
	right:150px;
	bottom:50px;
	background: url(./../../assets/chat/ball_bg.png) center center no-repeat #333;
	background-size:27px;
	z-index:999999;
}
.container{
	position: absolute;
	left:50px;
	top:-94px;
	height:250px;
	width:260px;
	overflow:hidden;
	background:url(~assets/chat/ball_content.png) no-repeat;
	transition: all .5s;
	background-size:260px;
}
.container_box{
	width:225px;
	height:220px;
	overflow:hidden;
	margin-left:20px;
	margin-top:9px;
	border-radius:12px;
}
.container_content{
	width:300px;
	height:225px;
	overflow:auto;
}
ul{
	width:225px;
	overflow:hidden;
}
.container.act{
	top:25px;
	left:50px;
	width:0;
	height:0;
	opacity: 0;
	background-size:0;
}
li{
	float: left;
	width:215px;
	height:50px;
	text-align: center;
	line-height: 50px;
	overflow:hidden;
	padding:5px 0 5px 10px;
	border-bottom:1px solid #ddd;
	color:#333;
	position: relative;

}
li:hover{
	background: #ccc;
	color:#333;
}
li>img,li>i{
	float:left;
	width:50px;
	height:50px;
	border-radius:50%;
}
li>span{
	position: absolute;
	top:0;
	left:0;
	display: block;
	background: #000;
	font-size:20px;
	color:#fff;
	top:5px;
	left:10px;
	width:50px;
	height:50px;
	border-radius:50%;
	opacity: .6;
}
li>i{
	background: url(~assets/chat/tongzhi.png) center center no-repeat #999;
}
li>p{
	float: left;
}
.name_no{
	float:left;
	padding-left:10px;
	line-height: 26px;
}
.name_no>span:nth-child(1){
	float:left;
	max-width:86px;
	text-overflow: ellipsis;
	overflow:hidden;
	white-space :nowrap;
}
.name_no>span:nth-child(2){
	float:left;
	font-size:12px;
	color:#999;
	padding-left:6px;
	line-height: 30px;
}
</style>
