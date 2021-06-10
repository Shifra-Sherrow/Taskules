<template>
    <section class="label-preview">
        <div
            :class="`label bgc-${idx + 1} flex f-s-between`"
            :style="{ backgroundColor: label.color }"
            @click.stop="toggleLabel"
        >
            <span v-if="!isEdit">{{ label.title }}</span>
            <input
                v-else
                type="text"
                ref="myInput"
                v-model="titleToEdit"
                @click.stop
                @keyup.enter.stop="updateTitle"
                @blur.stop="updateTitle"
            />
            <i :class="isSelect()"></i>
        </div>
        <button class="label-edit" @click.stop="focusInput">
            <img src="@/assets/svg/edit.svg" alt="" />
        </button>
    </section>
</template>

<script>
import { utilService } from '../../services/util.service.js';

export default {
    props: {
        idx: Number,
        label: Object,
        card: Object
    },
    data() {
        return {
            titleToEdit: this.label.title,
            isEdit: false
        };
    },
    computed: {
        cardToEdit() {
            return utilService.deepCopy(this.card);
        }
    },
    methods: {
        toggleLabel() {
            if (!this.card.labels) this.card.labels = [];
            const idx = this.card.labels.findIndex(label => label.id === this.label.id);
            if (idx === -1) this.card.labels.push({ id: this.label.id });
            else this.card.labels.splice(idx, 1);
            this.$emit('updateCard', this.card);
        },
        isSelect() {
            if (!this.card.labels) return;
            const labelsIds = this.card.labels.map(label => label.id);
            return labelsIds.includes(this.label.id) ? 'fas fa-check' : '';
        },
        focusInput() {
            this.isEdit = true;
            setTimeout(() => {
                this.$refs.myInput.focus();
            }, 0);
        },
        updateTitle() {
            this.isEdit = false;
            this.$emit('updateLabelTitle', this.label.id, this.titleToEdit);
        }
    }
};
</script>