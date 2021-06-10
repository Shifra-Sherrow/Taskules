<template>
	<section class="custom-avatar flex f-center" :style="avatarStyle">
		{{ txtToShow }}
	</section>
</template>

<script>
export default {
	props: {
		size: Number,
		username: String,
		src: String,
		isAdd: Boolean
	},
	data() {
		return {
			letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
			colors: ['#00A3BF', '#96B0B7', '#76558C', '#BD0031', '#FD495F', '#006F54', '#A33468', '#DE7394', '#005B93', '#009274', '#9D4400', '#802C00', '#A31B20', '#7A7585', '#005242', '#6453CB', '#FD495F'],
			initials: '',
			avatarColors: {},
			isSingleLetter: false,
			user: ''
		}
	},
	computed: {
		srcToDisplay() {
			return (this.src) ? this.src : null;
		},
		avatarStyle() {
			if (this.isAdd) return { background: '#eaecf0', width: this.size + 'px', height: this.size + 'px' }
			const initials = (this.isSingleLetter) ? this.user[0].charAt(0) + 'A' : this.initials;
			const bgc = (this.src) ? `url(${this.src})` : this.avatarColors[initials];
			return { background: bgc, width: this.size + 'px', height: this.size + 'px', 'background-size': 'cover' }
		},
		txtToShow() {
			return (this.src) ? '' : this.initials;
		}
	},
	methods: {
		setInitials(username, initials) {
			this.initials = initials;
		}
	},
	created() {
		if (this.isAdd) {
			this.initials = '+';
		} else {
			const user = this.username.toUpperCase().split(' ');
			this.user = user;
			var userInitials
			if (user.length === 1) {
				userInitials = user[0].charAt(0);
				this.isSingleLetter = true;
			} else userInitials = user[0].charAt(0) + user[1].charAt(0);
			this.initials = userInitials;
			var idx = 0;
			this.letters.forEach(letter1 => {
				this.letters.forEach(letter2 => {
					if (idx === this.colors.length) idx = 0;
					const initials = letter1 + letter2;
					const color = this.colors[idx++];
					this.avatarColors[initials] = color;
				})
			})
		}
	}
}
</script>

