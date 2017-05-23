<template>
   <div class="content" id="window_container" @mousedown="down($event)" @click="select">
   <div class="container" :class="{act:$store.state.act}">
	   	<ul>
	    	<li v-for="(list,index) in this.$store.state.message_window" v-show="list.show"  @click.stop="openwindow($event,list.user.user._id)"><img :src="list.user.headimg" alt=""></li>
	    </ul>
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
			var me=this;
			document.onmouseup=function(){
				document.onmousemove=null;
				me.$store.state.pageX=parseInt(window.getComputedStyle(dom).left);
				me.$store.state.pageY=parseInt(window.getComputedStyle(dom).top);
				console.log(window.getComputedStyle(dom).left);
			}
		},
		methods: {
			openwindow:function(event,id){
				// this.$store.state.act=false;
				var dom=document.querySelector('#win'+id);
				var w=parseInt(window.getComputedStyle(dom).width);
				if(w!=500){
					dom.style.height='600px';
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
				}
			},
			down:function(event){
				this.isclick=true;
				var dom=event.target,
				x=parseInt(dom.offsetLeft),
				y=parseInt(dom.offsetTop),
				x1=event.clientX,y1=event.clientY;
				this.notransition=true;
				var me=this;
				document.onmousemove=function(event){
					me.isclick=false;
					var evt=window.event||event,
					x2=evt.clientX,y2=evt.clientY;
					var a=x2-(x1-x),b=y2-(y1-y);
					evt.preventDefault();
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
						if(parseInt(window.getComputedStyle(win[i]).width)!=500){
							win[i].style.top=b+25+'px';
							win[i].style.left=a+25+'px';
						}
					}
					me.$store.state.pageX=parseInt(window.getComputedStyle(dom).left);
					me.$store.state.pageY=parseInt(window.getComputedStyle(dom).top);
				}
			},
		}
	}

</script>

<style scoped>
.content{
	cursor: pointer;
	position: fixed;
	width:50px;
	height:50px;
	border-radius: 50%;
	right:150px;
	bottom:50px;
	background: #000;
	z-index:999999;
}
.container{
	position: absolute;
	left:50px;
	top:-100px;
	height:250px;
	width:50px;
	background: rgba(200,200,200,.5);
	overflow:hidden;
	transition: all .5s;
	border-radius: 25px;
}
ul{
	width:80px;
	height:250px;
	overflow:auto;
}
div.act{
	width:0;
	height:0;
	top:25px;
	left:50px;
	opacity: 0;
}
li{
	float: left;
	width:50px;
	height:50px;
	border-radius:50%;
	background: #638;
	text-align: center;
	line-height: 50px;
	color:#fff;
	overflow:hidden;
}
li>img{
	display: block;
	width:100%;
}
</style>
