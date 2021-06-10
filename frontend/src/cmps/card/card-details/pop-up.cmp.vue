<template>
	<section class="pop-up">
		<button class="close-btn" @click.stop="emitClose">
			<i class="el-icon-close"></i>
		</button>
		<!-- <slot name="card-move"></slot>
        <slot name="date-picker"></slot>
        <slot name="add-members"></slot>
        <slot name="card-cover"></slot> -->
		<slot></slot>
	</section>
</template>

<script>
export default {
	methods: {
		emitClose() {
			this.$emit('closePopup')
		},
	}
}
</script>

<style>
</style>