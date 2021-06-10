<template>
	<section class="bg-picker">
		<div v-if="isBg" class="flex f-center">
			<div class="select-container">
				<div class="select photo" @click="togglePhoto"></div>
				Photos
			</div>
			<div class="select-container">
				<div class="select color" @click="toggleColor"></div>
				Colors
			</div>
		</div>
		<div v-else class="background flex wrap f-center">
			<template v-if="isColor">
				<div
					v-for="(color, idx) in colors"
					:key="color"
					:class="`option bgc bgc-${idx + 1}`"
					@click="emitChange(color)"
				></div>
			</template>
			<template v-if="isPhoto">
				<div class="option" v-for="(src, idx) in srcs" :key="src">
					<img @click="emitChange(`${idx}`)" :src="src" />
				</div>
			</template>
			<div class="backToBg" @click="goBackToSelect">Back to select</div>
		</div>
	</section>
</template>

<script>
export default {
	data() {
		return {
			isBg: true,
			isColor: false,
			isPhoto: false,
			colors: [
				'rgb(46, 121, 186)',
				'rgb(72, 171, 200)',
				'rgb(106, 188, 114)',
				'rgb(98, 149, 70)',
				'rgb(132, 99, 154)',
				'rgb(191, 98, 143)',
				'rgb(164, 76, 56)',
				'rgb(202, 146, 71)'
			],
			srcs: [
				require('../../../assets/bgs/preview/bg1.jpg'),
				require('../../../assets/bgs/preview/bg2.jpg'),
				require('../../../assets/bgs/preview/bg3.jpg'),
				require('../../../assets/bgs/preview/bg4.jpg'),
				require('../../../assets/bgs/preview/bg5.jpg'),
				require('../../../assets/bgs/preview/bg6.jpg'),
				require('../../../assets/bgs/preview/bg7.jpg'),
				require('../../../assets/bgs/preview/bg8.jpg'),
				require('../../../assets/bgs/preview/bg9.jpg'),
				require('../../../assets/bgs/preview/bg10.jpg'),
				require('../../../assets/bgs/preview/bg11.jpg'),
				require('../../../assets/bgs/preview/bg12.jpg'),
			]
		}
	},
	methods: {
		toggleColor() {
			this.isColor = true;
			this.isBg = false;
		},
		togglePhoto() {
			this.isPhoto = true;
			this.isBg = false;
		},
		emitChange(bgc) {
			this.$emit('changeBgc', bgc);
		},
		goBackToSelect() {
			this.isBg = true;
			this.isColor = false;
			this.isPhoto = false;
		}
	}
}
</script>
