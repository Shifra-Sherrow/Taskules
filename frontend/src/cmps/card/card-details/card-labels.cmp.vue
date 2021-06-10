<template>
	<section class="card-label flex f-col f-center">
		<h3>Labels</h3>
		<hr />
		<ul class="label-list flex f-col">
			<li>
				<label-preview
					class="flex"
					v-for="(label, idx) in boardLabels"
					:key="label.id"
					:label="label"
					:card="card"
					:idx="idx"
					@updateCard="emitUpdateCard"
					@updateLabelTitle="emitUpdateTitle"
				/>
			</li>
		</ul>
	</section>
</template>

<script>
import labelPreview from '../label-preview.cmp';

export default {
	props: {
		card: Object,
		boardLabels: Array
	},
	methods: {
		emitUpdateCard(card) {
			this.$emit('updateCard', card);
		},
		emitUpdateTitle(labelId, title) {
			this.$emit('updateLabelTitle', labelId, title);
		}
	},
	mounted() {
		const popupWidth = this.$el.clientWidth;
		const popupHeight = this.$el.clientHeight;
		const dimensions = {popupWidth, popupHeight};
		this.$emit('setDimensions', dimensions);
	},
	components: {
		labelPreview
	},
};
</script>