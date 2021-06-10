<template>
	<section class="filter">
		<input
			type="text"
			v-model="filterBy.txt"
			placeholder="Search cards by title..."
			@input="debSearch"
		/>
		<hr />
		<div class="labels flex f-col">
			<ul>
				<li
					class="filter-li"
					v-for="label in board.labels"
					:key="label.id"
					@click="setFilter('label', label.id)"
				>
					<div
						class="item flex"
						:style="`background-color:${label.color}`"
					></div>
					<span class="title">{{ label.title }}</span>
					<i
						v-if="isChecked('label', label.id)"
						class="item-check fas fa-check"
					></i>
				</li>
			</ul>
		</div>

		<hr />

		<div class="members">
			<ul>
				<li
					class="filter-li"
					v-for="member in board.members"
					:key="member._id"
					@click="setFilter('member', member._id)"
				>
					<custom-avatar
						class="item"
						:size="30"
						:username="member.username"
						:src="member.imgUrl"
					></custom-avatar>

					<div class="member">
						{{ member.username }}
					</div>
					<i
						v-if="isChecked('member', member._id)"
						class="item-check fas fa-check"
					></i>
				</li>
			</ul>
		</div>
	</section>
</template>

<script>
import { utilService } from '../../../services/util.service';
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'


export default {
	props: {
		board: Object
	},
	data() {
		return {
			filterBy: {
				txt: "",
				membersIds: [],
				labelsIds: []
			},
			debTimeout: null,
			isMembers: false,
			isLabels: false,
		}
	},
	computed: {

	},
	methods: {
		emitFilter() {
			this.$emit('filter', utilService.deepCopy(this.filterBy))
		},
		debSearch() {
			if (this.debTimeout) clearTimeout(this.debTimeout);
			this.debTimeout = setTimeout(() => this.emitFilter(), 500)
		},
		toggleMembers() {
			this.isMembers = !this.isMembers;
		},
		toggleLabels() {
			this.isLabels = !this.isLabels;
		},
		setFilter(item, itemId) {
			if (this.filterBy[`${item}sIds`].includes(itemId)) {
				const idIdx = this.filterBy[`${item}sIds`].findIndex(currId => currId === itemId)
				if (idIdx !== -1) this.filterBy[`${item}sIds`].splice(idIdx, 1)
			} else this.filterBy[`${item}sIds`].push(itemId)
			this.emitFilter()
		},
		isChecked(item, itemId) {
			const itemsIds = this.filterBy[`${item}sIds`]
			return itemsIds.some(item => item === itemId)
		}
	},
	components: {
		customAvatar
	}
}
</script>

