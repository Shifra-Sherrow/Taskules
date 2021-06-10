<template>
	<section class="card-preview flex f-col" @click="emitOpenDetails">
		<div>
			<i
				data-name="card-edit-menu"
				class="edit-btn f-center"
				:class="{ 'full-header': card.style.isFull }"
				:data-scroll="isScroll"
				@click="editCard()"
			>
				<img
					:data-scroll="isScroll"
					name="edit"
					src="@/assets/svg/edit.svg"
					alt=""
				/>
				<!-- <i class="fas fa-pen edit-btn" @click.stop="editCard"> -->
			</i>
		</div>
		<template v-if="card.style.isFull">
			<div
				:style="{ background: card.style.headerColor }"
				class="fullcover-title flex"
			>
				<span>
					{{ card.title }}
				</span>
			</div>
		</template>
		<template v-else>
			<div
				v-if="card.style.headerColor"
				class="card-header"
				:style="headerStyle"
			></div>
			<div class="card-info flex f-col">
				<ul v-if="labelsSelected.length" class="label-marks flex wrap">
					<li
						class="flex"
						v-for="label in labelsSelected"
						:key="label"
					>
						<div
							class="label"
							:style="{ backgroundColor: label }"
						></div>
					</li>
				</ul>
				<span class="description">{{ card.title }}</span>
				<div
					class="attachment"
					v-if="card.attachments && card.attachments.length"
				>
					<img :src="`${card.attachments[0].src}`" />
				</div>
			</div>
			<div class="icons flex wrap">
				<span class="small-icons flex f-center">
					<i
						v-if="card.dueDate"
						:style="dueDate"
						class="far fa-clock"
					>
						<span>
							{{ moment(card.dueDate).format("MMM Do") }}</span
						>
					</i>

					<i v-if="card.description" class="description-icon"
						><img src="@/assets/svg/desc.svg"
					/></i>
					<i
						v-if="card.checklistGroup && checklist"
						class="checklist-icon flex f-center"
						:class="isChecklistDone"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="12"
							viewBox="0 0 48 43"
						>
							<g>
								<g class="gcheck">
									<path
										fill="#42526e"
										d="M.211 39.598c.002 1.875.964 2.867 2.782 2.87 12.197.02 24.38.02 36.211-.002 1.69-.003 2.705-.997 2.718-2.66.036-4.56.028-9.197.02-13.684l-.006-3.174c0-.98-.407-1.621-1.24-1.96-.63-.256-1.254-.214-1.756.122-.586.389-.926 1.12-.934 2.004-.026 3.15-.023 6.3-.019 9.452l.003 3.813V38.442H4.235V4.705h6.872c7.986 0 15.972.002 23.958 0h.23c.424.007.833.006 1.22-.065 1.045-.19 1.736-1.071 1.643-2.094-.097-1.057-.984-1.776-2.114-1.778L33.226.79c-3.884.036-7.768.056-11.65.065C18.11.85 14.645.826 11.18.799 8.676.78 6.172.762 3.668.75H3.61c-1.354 0-2.182.222-2.68.716-.494.49-.716 1.296-.718 2.612a10782.9 10782.9 0 0 0 0 35.519z"
									/>
								</g>
								<g class="gcheck">
									<path
										fill="#42526e"
										d="M47.128 4.654c-.365-.386-.813-.594-1.295-.603-.62-.006-1.264.298-1.844.87a770.692 770.692 0 0 0-4.526 4.515L22.335 26.614l-2.65-2.665c-1.812-1.822-3.574-3.595-5.345-5.358-.583-.58-1.208-.887-1.807-.887l-.022.001c-.477.007-.927.217-1.3.608-.814.853-.696 2.052.3 3.055a1945.64 1945.64 0 0 0 9.085 9.086c1.25 1.237 2.215 1.245 3.442.018 7.597-7.58 15.185-15.17 22.767-22.764 1.017-1.019 1.14-2.19.323-3.055z"
									/>
								</g>
							</g></svg
						><span>{{ todoStatus }}</span></i
					>
					<i
						v-if="card.attachments && card.attachments.length"
						class="fas fa-paperclip"
					></i>
					<i v-if="commentsLen" class="flex comments-icon">
						<img src="@/assets/svg/txtbox.svg" />
						{{ commentsLen }}</i
					>
				</span>
				<span
					class="members-container flex"
					v-if="card.members && card.members.length"
				>
					<div
						class="card-members"
						v-for="member in card.members"
						:key="member._id"
					>
						<custom-avatar
							:size="30"
							:username="member.username"
							:src="member.imgUrl"
						/>
					</div>
				</span>
			</div>
		</template>
	</section>
</template>

<script>
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'

export default {
	props: {
		card: Object,
		labels: Array,
		activities: Array,
		isScroll: Boolean
	},
	data() {
		return {
			isEditing: false,
		}
	},
	computed: {
		isChecklistDone() {
			const isDone = this.card.checklistGroup.every(checklist => checklist.items.every(item => item.isDone))
			return isDone ? 'complete' : null;
		},
		checklist() {
			return this.card.checklistGroup.some(checklist => checklist.items.length > 0)
		},
		todoStatus() {
			const totalTodos = this.card.checklistGroup.reduce((counterList, checklist) => {
				let counterItem = checklist.items.reduce((counterItem, item) => {
					counterItem.total++;
					if (item.isDone) counterItem.done++;
					return counterItem;
				}, { total: 0, done: 0 })
				counterList.total += counterItem.total;
				counterList.done += counterItem.done;
				return counterList;
			}, { total: 0, done: 0 })
			const txt = `${totalTodos.done}/${totalTodos.total}`;
			return txt;
		},
		dueDate() {
			if (this.card.isDone) return { color: 'white', backgroundColor: '#5aac44' }
			if (this.card.dueDate < Date.now()) return { color: 'white', backgroundColor: '#ec9488' }
			else return {}
		},
		headerStyle() {
			return { background: this.card.style.headerColor }
		},
		labelsSelected() {
			if (!this.card.labels) return [];
			const selectIds = this.card.labels.map(label => label.id);
			const selctLabels = this.labels.filter(label => selectIds.includes(label.id));
			return selctLabels.map(label => label.color);
		},
		commentsLen() {
			if (!this.activities.filter(activity => activity.comment && activity.card.id === this.card.id).length) return
			return ' ' + this.activities.filter(activity => activity.comment && activity.card.id === this.card.id).length;
		}
	},
	methods: {
		editCard() {
			this.$emit('openEditCard', this.card);
			this.isEditing = true;
		},
		emitOpenDetails() {
			if (!this.isEditing) this.$emit('openDetails', this.card.id);
			this.isEditing = false;
		}
	},
	components: {
		customAvatar,
	}
};
</script>