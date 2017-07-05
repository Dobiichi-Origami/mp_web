<template>
	<div>
		<div v-for="(value, index) in msg">
			{{value}}
		</div>
	</div>
</template>
<script>
	export default {
		data:function(){
			return {
				msg: Array.from(new Map().set('1',{a:1}).set('2',{a:2}).set('3',{a:3}).values()).sort(function(x, y){//比较函数，时间大的放前面
					if (x.a < y.a){
				        return 1;
				    }else if (x>y){
				        return -1;
				    }else{
				        return 0;
				    }
				})  // Array.from()
			}
		},
		methods:{
			compareCmd: function(x, y){//比较函数，时间大的放前面
				if (x.a < y.a){
			        return 1;
			    }else if (x>y){
			        return -1;
			    }else{
			        return 0;
			    }
			}
		}
	}
</script>