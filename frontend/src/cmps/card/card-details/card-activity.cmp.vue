<template>
	<section class="card-activity">
		<div class="flex activities-btn f-s-between">
			<h2>activity:</h2>
			<button
				class="card-details-btn"
				v-if="!isAllActivities"
				@click="toggleShowDetails"
			>
				Show Details
			</button>
			<button class="card-details-btn" v-else @click="toggleShowDetails">
				Hide Details
			</button>
		</div>
		<div class="activities flex">
			<custom-avatar
				class="main-avatar"
				:size="35"
				:username="user.username"
				:src="user.imgUrl"
			/>
			<div ref="input-area" @click="openInput" class="input-area flex">
				<input
					type="text"
					placeholder="Write a comment..."
					@keydown="typing"
					@keyup.enter="addComment"
					v-model="msg.txt"
					ref="input"
					name="comment"
				/>
				<div class="comment-controls" @click.stop="addComment">
					<span type="text" :class="addBtnClass">Save</span>
					<i
						class="fal fa-times cancel-btn"
						aria-hidden="true"
						@click.stop="closeInput"
					></i>
				</div>
			</div>
		</div>
		<!-- <span v-if="userTyping"
			><custom-avatar
				:size="35"
				:username="userTyping"
				:src="user.imgUrl"
			/>
			Adding a comment</span
		> -->
		<template v-if="activitiesToShow && activitiesToShow.length">
			<activity-preview
				v-for="activity in activitiesToShow"
				:key="activity.id"
				:activity="activity"
				:size="35"
				@deleteComment="emitDeleteComment"
			/>
		</template>
	</section>
</template>

<script>
import activityPreview from '../../activity-preview.cmp';
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'
import { socketService } from '../../../services/socket.service';

export default {
	props: {
		activities: Array,
		user: Object,
		isShowDetails: Boolean,
		card: Object,
	},
	data() {
		return {
			msg: {
				from: null,
				txt: ''
			},
			userTyping: null,
			timeOutTyping: null,
			isAllActivities: this.isShowDetails
		}
	},
	computed: {
		activitiesToShow() {
			if (!this.isAllActivities) {
				return this.activities.filter(activity => activity.comment && activity.comment.length)
			}
			return (this.activities);
		},
		isWriting() {
			return (this.msg.txt !== '');
		},
		addBtnClass() {
			return { 'active': this.isWriting, 'disabled': !this.isWriting }
		}
	},
	methods: {
		toggleShowDetails() {
			this.isAllActivities = !this.isAllActivities;
		},
		addComment() {
			if (!this.isWriting) return;
			this.userTyping = null;
			this.$emit('addComment', null, this.card, this.msg.txt, this.msg.from);
			this.closeInput();

		},
		typing() {
			socketService.emit('commenting', this.msg.from.username);
		},
		setUserTyping(username) {
			this.userTyping = username
			if (this.timeOutTyping) clearTimeout(this.timeOutTyping)
			this.timeOutTyping = setTimeout(() => {
				this.userTyping = null
			}, 1000)
		},
		openInput() {
			this.$refs['input-area'].classList.add('in-use')
		},
		closeInput() {
			this.$refs['input-area'].classList.remove('in-use')
			this.$refs['input'].blur();
			this.msg.txt = '';

		},
		emitDeleteComment(commentId) {
			this.$emit('deleteComment', commentId);
		}
	},
	created() {
		this.msg.from = this.user;
		socketService.on('user-commenting', this.setUserTyping);
	},
	components: {
		activityPreview,
		customAvatar
	}
};
</script>