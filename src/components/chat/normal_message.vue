<template>
	<div>
		<groupmessage v-if="list.group" :list="list" :index="index"></groupmessage>
		<friendmessage v-else :list="list" :index="index"></friendmessage>
	</div>
</template>
<script>
	import friendmessage from "./normal_message/friendmessage"
	import groupmessage from "./normal_message/groupmessage"
	export default ({
		props: ['index', 'list'],
		data() {
			return {}
		},
		components: {
			friendmessage,
			groupmessage
		}
	})

</script>
<style scoped>


</style>
