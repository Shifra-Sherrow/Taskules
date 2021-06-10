<template>
	<section class="group-menu" @click.stop>
		<div class="header-container">
			<slot name="back-btn"></slot>
			<span class="close-btn">
				<i class="el-icon-close" @click="emitClose"></i>
			</span>
			<span class="header">
				<slot name="header"> List Actions </slot>
			</span>
		</div>
		<div class="content-container">
			<slot name="body">
				<div @click="emitAdd">Add Card...</div>
				<div @click="emitClone">Clone List...</div>
				<div @click="emitMove">Move List...</div>
				<hr />
				<div @click="emitSort">Sort By...</div>
				<hr />
				<div @click="emitDelete">Delete this List</div>
			</slot>
		</div>
	</section>
</template>

<script>
export default {
	methods: {
		emitClose() {
			this.$emit('closeMenu');
		},
		emitDelete() {
			this.$emit('deleteGroup');
			this.emitClose();
		},
		emitAdd() {
			this.$emit('addCard');
			this.emitClose();
		},
		emitClone() {
			this.$emit('cloneGroup');
			this.emitClose();
		},
		emitMove() {
			this.$emit('openMove');
		},
		emitSort() {
			this.$emit('openSort');
		},
		emitBackToMenu() {
			this.$emit('backToMenu')
		}

	},
	created() {
		setTimeout(() => {
			window.addEventListener('click', this.emitClose)
		}, 100)
	},
	destroyed() {
		window.removeEventListener('click', this.emitClose)
	}
}
</script>
