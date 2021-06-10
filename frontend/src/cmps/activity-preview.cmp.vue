<template>
	<div class="activity-preview">
		<section class="flex">
			<div class="avatar">
				<custom-avatar
					:size="avatarSize"
					:username="username"
					:src="activity.byMember.imgUrl"
				/>
			</div>
			<div class="desc">
				<template v-if="activity.txt">
					<span class="user">{{ username }} </span>
					<span class="activity">{{ activity.txt }} </span>
					<span
						v-if="activity.card"
						class="card"
						@click="emitOpenCard"
						>{{ activity.card.title }}</span
					>
					<div class="time">
						{{ moment(activity.createdAt).fromNow() }}
					</div>
				</template>
				<template v-else>
					<span class="user">{{ username }}</span>
					on
					<span class="card activity" @click="emitOpenCard">{{
						activity.card.title
					}}</span>
					<span class="time">
						{{ moment(activity.createdAt).fromNow() }}
					</span>
					<div class="comment-container">
						<span class="comment">{{ activity.comment }}</span>
						<span class="delete-btn" @click="emitDeleteComment(activity.id)">Delete</span>
					</div>
				</template>
			</div>
		</section>
	</div>
</template>

<script>
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'

export default {

	props: {
		activity: Object,
		size: Number
	},
	data(){
		return{
			avatarSize: 30
		}
	},
	computed: {
		username() {
			return this.activity.byMember.username;
		},
		time() {
			return this.activity.createdAt
		}
	},
	methods: {
		emitOpenCard() {
			this.$emit('openCard', this.activity.card.id)
		},
		emitDeleteComment(commentId){
			this.$emit('deleteComment', commentId);
		}
	},
	created(){
		if(this.size) this.avatarSize = this.size;
	},
	components: {
		customAvatar
	},
};
</script>