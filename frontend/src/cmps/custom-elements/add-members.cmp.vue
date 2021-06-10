<template>
	<section class="add-members" @click.stop>
		<h3>Members</h3>
		<hr />
		<input
			type="text"
			placeholder="Serach members"
			@keyup="filter"
			v-model="memberSearch"
		/>
		<h2>board members</h2>
		<ul>
			<li
				v-for="user in membersToShow"
				class="flex"
				:key="user._id"
				@click="toggleMember(user._id)"
			>
				<span v-if="isMember(user._id)" class="card-member flex">
					<custom-avatar
						:size="35"
						:username="user.username"
						:src="user.imgUrl"
					/>
					<span class="username">
						{{ user.username }}
					</span>
				</span>
				<i class="fas fa-check" v-if="isMember(user._id)"></i>
			</li>
			<li
				v-for="user in membersToShow"
				class="flex"
				:key="user._id + 1"
				@click="toggleMember(user._id)"
			>
				<span v-if="!isMember(user._id)" class="card-member flex">
					<custom-avatar
						:size="35"
						:username="user.username"
						:src="user.imgUrl"
					/>
					<span class="username">
						{{ user.username }}
					</span>
				</span>
			</li>
		</ul>
	</section>
</template>

<script>
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'
import { utilService } from '@/services/util.service'
export default {
	props: {
		boardMembers: Array,
		cardMembers: Array
	},
	data() {
		return {
			memberSearch: null,
			filterTxt: ''
		}
	},
	computed: {
		membersToShow() {
			var members = utilService.deepCopy(this.boardMembers)
			members.sort((a, b) => {
				if (a.username.toLowerCase() < b.username.toLowerCase()) return -1;
				if (a.username.toLowerCase() > b.username.toLowerCase()) return 1;
				return 0;
			})
			return members.filter(user => user.username.toLowerCase().includes(this.filterTxt.toLowerCase()));
		},
	},
	methods: {
		filter() {
			this.filterTxt = this.memberSearch;
		},
		toggleMember(userId) {
			this.$emit('updateMembers', userId);
		},
		isMember(userId) {
			return this.cardMembers.some(member => member._id === userId);
		}
	},
	mounted() {
		const popupWidth = this.$el.clientWidth
		const popupHeight = this.$el.clientHeight
		const dimensions = {popupWidth, popupHeight}
		this.$emit('setDimensions', dimensions)
	},
	components: {
		customAvatar
	}
}
</script>

<style>
</style>