<template class="time-picker">
	<section class="block">
		<el-date-picker
			:default-value="defaultValue"
			ref="date"
			@change="setDate"
			v-model="value1"
			type="datetime"
			placeholder="Select Due Date"
			default-time="12:00:00"
			value-format="timestamp"
			:picker-options="pickerOptions"
		>
			>
		</el-date-picker>
	</section>
</template>

<script>
export default {
	props: {
		dueDate: Number,
	},
	data() {
		return {
			pickerOptions: {
				shortcuts: [
					{
						text: 'Tomorrow',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() + 3600 * 1000 * 24);
							picker.$emit('pick', date);
						}
					}, {
						text: 'In a week',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
							picker.$emit('pick', date);
						}
					}]
			},
			value1: '',
		};
	},
	computed: {
		defaultValue() {
			if (this.dueDate) return this.dueDate;
			return new Date();
		}
	},
	methods: {
		setDate() {
			if (this.dueDate) {
				this.$emit('removeDate');
			}
			this.$refs.date._data.pickerVisible = false;
			const dueDate = this.value1
			this.$emit('setDate', dueDate)
		},
	},
	mounted() {
		// this.$refs.date._data.pickerVisible = true;
	}
};
</script>