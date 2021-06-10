<template>
	<section class="card-cover">
		<h2>Cover</h2>
		<hr />
		<div class="size">
			<h4 class="_1mh73i3GOtAUyT">Size</h4>
			<div class="_3hbdnDjD_nZO1f">
				<div
					:class="[selectedTop, canSelect]"
					@click="selectCover(false)"
					role="button"
					class="button _1a8LrtkAQTAK-j UC8-8jzxy9UkT0 _26XWB5josseeRo"
				>
					<div :style="bgc" class="_2n6YBcAzfBM_0a"></div>
					<div class="_2F9ioHU3xVEem_">
						<div class="iNrcwkjGRZWeLW"></div>
						<div class="_3oRL16p-W0XVVs"></div>
						<div class="MSLVFDgwEE7ILt">
							<div class="_1ZlsPuJsGpFga7"></div>
							<div class="_1ZlsPuJsGpFga7"></div>
						</div>
						<div class="_3OZzs3qEQCIZ_E"></div>
					</div>
				</div>
				<div
					role="button"
					class="button _1a8LrtkAQTAK-j _4FN7X40rw25a6Q _26XWB5josseeRo"
					:class="[selectedFull, canSelect]"
					:style="bgc"
					@click="selectCover(true)"
				>
					<div class="_2F9ioHU3xVEem_">
						<div class="iNrcwkjGRZWeLW"></div>
						<div class="_3oRL16p-W0XVVs"></div>
						<div class="MSLVFDgwEE7ILt">
							<div class="_1ZlsPuJsGpFga7"></div>
							<div class="_1ZlsPuJsGpFga7"></div>
						</div>
						<div class="_3OZzs3qEQCIZ_E"></div>
					</div>
				</div>
			</div>
			<button
				v-if="newColor"
				@click="removeCover"
				class="button _3-CjziCGL9o1aO _1fcxnzs4VXcgEM"
			>
				Remove Cover
			</button>
		</div>
		<hr />
		<h4>Colors</h4>
		<div class="colors">
			<div class="_3zYZrEHtMpYE6i">
				<button
					@click="setColor('#7bc86c')"
					class="_9HlyjDStZT9Tkt _VjutK-Uakd6Op"
				></button>
				<button
					@click="setColor('#f5dd29')"
					class="_9HlyjDStZT9Tkt _3wmQ8lVe3zahD9"
				></button>
				<button
					@click="setColor('#ffaf3f')"
					class="_9HlyjDStZT9Tkt _3IxJVmJ52SXvxO"
				></button>
				<button
					@click="setColor('#ef7564')"
					class="_9HlyjDStZT9Tkt _2hOM7AmVdl8C7W"
				></button>
				<button
					@click="setColor('#cd8de5')"
					class="_9HlyjDStZT9Tkt Ds0H9CqAfcVFSh"
				></button>
				<button
					@click="setColor('#5ba4cf')"
					class="_9HlyjDStZT9Tkt _3qziXoVq3vOoB-"
				></button>
				<button
					@click="setColor('#29cce5')"
					class="_9HlyjDStZT9Tkt _2sAsAnMyJDuTix"
				></button>
				<button
					@click="setColor('#6deca9')"
					class="_9HlyjDStZT9Tkt _2zEv5Z_t8hhaSh"
				></button>
				<button
					@click="setColor('#ff8ed4')"
					class="_9HlyjDStZT9Tkt _3wVGI--mpmR634"
				></button>
				<button
					@click="setColor('#2D928D')"
					class="_9HlyjDStZT9Tkt _36HiOr-q2SnKP7"
				></button>
			</div>
		</div>
	</section>
</template>

<script>
export default {
	props: {
		color: String,
		showFull: Boolean
	},
	data() {
		return {
			newColor: '',
			isFull: false
		}
	},
	computed: {
		selectedTop() {
			return { 'selected': this.newColor && !this.isFull }
		},
		selectedFull() {
			return { 'selected': this.newColor && this.isFull }
		},
		canSelect() {
			return { 'can-select': this.newColor }
		},
		bgc() {
			return { background: this.newColor, opacity: 1 }
		}
	},
	methods: {
		emitColorChange() {
			this.$emit('colorChange', this.newColor, this.isFull);
		},
		setColor(color) {
			this.newColor = color;
			this.emitColorChange();
		},
		selectCover(isFull) {
			this.isFull = isFull;
			this.emitColorChange();
		},
		removeCover() {
			this.isFull = false;
			this.bgcName = '';
			this.newColor = '';
			this.emitColorChange();
		}
	},
	created() {
		this.newColor = this.color;
		this.isFull = this.showFull;
	}
}
</script>
