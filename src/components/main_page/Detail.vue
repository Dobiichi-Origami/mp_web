<template>
	<div class="contentdetail">
		<div class="ajax-loader" v-show="$store.state.loader"></div>
		<small-details v-if="this.$store.state.details.item"></small-details>
	</div>
</template>
<script>
	import smallDetails from './detail-list/smalldetails'
	export default ({
		data() {
			return {

			}
		},
		mounted: function() {
			this.$store.state.mounted.detail_mounted(this.$store.state, this);
		},
		components: {
			smallDetails,
		}
	})

</script>
<style>
	div.contentdetail {
		width: 660px;
		min-height: 100px;
	}
	
	button {
		border: none;
		background: transparent;
		overflow: visible;
		font-size: 14px;
	}

</style>
