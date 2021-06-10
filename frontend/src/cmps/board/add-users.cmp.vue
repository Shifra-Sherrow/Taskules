<template>
	<section class="add-users" ref="member">
		<header class="add-users-header flex">
			<h3>Invite to board</h3>
			<button class="el-icon-close" @click="onClose"></button>
		</header>
		<hr />
		<input
			type="text"
			placeholder="Serach members"
			@keyup="filter"
			v-model="userSearch"
		/>
		<ul>
			<li
				data-name="member"
				v-for="user in usersToShow"
				:key="user._id"
				class="flex"
				@click="toggleUser(user._id)"
			>
				<span
					data-name="member"
					class="board-user flex"
					v-if="isUser(user._id)"
				>
					<custom-avatar
						data-name="member"
						:size="35"
						:username="user.username"
						:src="user.imgUrl"
					/>
					<span class="username" data-name="member">
						{{ user.username }}</span
					></span
				>
				<i class="fas fa-check" v-if="isUser(user._id)"></i>
			</li>
		</ul>
		<ul>
			<li
				data-name="member"
				v-for="user in usersToShow"
				:key="user._id"
				class="flex"
				@click="toggleUser(user._id)"
			>
				<span
					class="board-user flex"
					v-if="!isUser(user._id)"
					data-name="member"
				>
					<custom-avatar
						data-name="member"
						:size="35"
						:username="user.username"
						:src="user.imgUrl"
					/>
					<span data-name="member" class="username">
						{{ user.username }}</span
					></span
				>
				<!-- <i class="fas fa-check" v-if="isUser(user._id)"></i> -->
			</li>
		</ul>
	</section>
</template>

<script>
import { utilService } from '@/services/util.service'
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'

export default {
	props: {
		allUsers: Array,
		boardUsers: Array
	},
	data() {
		return {
			userSearch: null,
			filterTxt: ''
		}
	},
	computed: {
		// usersToShow() {
		//     return this.allUsers.filter(user => user.username.toLowerCase().includes(this.filterTxt.toLowerCase()));
		// },
		usersToShow() {
			var users = utilService.deepCopy(this.allUsers)
			users.sort((a, b) => {
				if (a.username.toLowerCase() < b.username.toLowerCase()) return -1;
				if (a.username.toLowerCase() > b.username.toLowerCase()) return 1;
				return 0;
			})
			return users.filter(user => user.username.toLowerCase().includes(this.filterTxt.toLowerCase()));
		},
	},
	methods: {
		filter() {
			this.filterTxt = this.userSearch;
		},
		toggleUser(userId) {
			this.$emit('updateUsers', userId);
		},
		isUser(userId) {
			return this.boardUsers.some(boardUser => boardUser._id === userId);
		},
		onClose() {
			this.$emit('closeUsers');
		},

	},
	components: {
		customAvatar
	}

}
</script>

<style>
</style>