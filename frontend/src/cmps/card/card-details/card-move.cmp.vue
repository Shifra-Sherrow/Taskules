<template>
	<section class="card-move">
		<h3 v-if="isClone">Clone Card</h3>
		<h3 v-else>Move Card</h3>
		<hr />
		<h2>Select Destination</h2>
		<div class="flex">
			<span class="flex f-col">
				List
				<select-list
					@changeCardGroup="changeCardGroup"
					:groups="groups"
					:title="group.title"
				></select-list>
			</span>
			<span class="flex f-col">
				Position
				<select-position
					@changeCardPosition="changeCardPosition"
					:cards="getCards"
					:diff="getDiff"
					:currPosition="getCurrPosition"
				></select-position>
			</span>
		</div>
		<button v-if="isClone" @click.stop="emitMove">Clone</button>
		<button v-else @click.stop="emitMove">Move</button>
	</section>
</template>

<script>
import selectList from '../../custom-elements/select-list.cmp';
import selectPosition from '../../custom-elements/select-position.cmp';

export default {
	props: {
		isClone: Boolean,
		groups: Array,
		group: Object,
		currPosition: Number
	},
	data() {
		return {
			newCardGroupId: this.group.id,
			newCardPosition: null
		}
	},
	computed: {
		getCards() {
			const group = this.groups.find(group => group.id === this.newCardGroupId);
			return group.cards;
		},
		getDiff() {
			return (this.newCardGroupId === this.group.id) ? 0 : 1;
		},
		getCurrPosition() {
			if (this.newCardGroupId) {
				const group = this.groups.find(group => group.id === this.newCardGroupId);
				return group.cards.length + '';
			}
			return this.currPosition + '';
		},
	},
	methods: {
		changeCardGroup(groupId) {
			this.newCardGroupId = groupId;
		},
		changeCardPosition(position) {
			this.newCardPosition = position;
		},
		emitMove() {
			const endPos = this.newCardPosition ? this.newCardPosition - 1 : this.isClone ? this.currPosition : null;
			const status = {
				isClone: this.isClone,
				startPos: this.currPosition - 1,
				endPos,
				startGroup: this.group.id,
				endGroup: this.newCardGroupId
			}
			this.$emit('moveCard', status)
		}
	},
	mounted() {
		const popupWidth = this.$el.clientWidth
		const popupHeight = this.$el.clientHeight
		const dimensions = {popupWidth, popupHeight}
		this.$emit('setDimensions', dimensions)
	},
	components: {
		selectList,
		selectPosition
	}
}
</script>

<style>
</style>