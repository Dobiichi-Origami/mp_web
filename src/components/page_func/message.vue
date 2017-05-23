<template>
	<div>
		<group v-if="list.group" :list="list" :index="index"></group>
		<friend v-else :list="list" :index="index"></friend>
	</div>
</template>
<script>
	import friend from "./window/friendmessage"
	import group from "./window/groupmessage"
	export default ({
		props: ['index','list'],
		data() {
			return {
			}
		},
		components:{
			friend,
			group
		}
	})

</script>
<style scoped>
</style>
