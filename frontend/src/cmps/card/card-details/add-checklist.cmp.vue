<template>
    <section class="add-checklist" @click.stop>
        <h3>Add Checklist</h3>
        <hr />
        <h2>Title</h2>
        <form @submit.prevent="addChecklist">
            <input type="text" v-model="titleToEdit" ref="myInput" />
            <button>Add</button>
        </form>
    </section>
</template>

<script>
import { utilService } from '../../../services/util.service';

export default {
    props: {
        card: Object
    },
    data() {
        return {
            titleToEdit: 'Checklist'
        };
    },
    methods: {
        addChecklist() {
            const card = utilService.deepCopy(this.card);
            if (!card.checklistGroup) card.checklistGroup = [];
            card.checklistGroup.push({ id: utilService.makeId(), title: this.titleToEdit, items: [] });
            this.$emit('updateCard', card);
            this.$emit('close');
        }
    },
    created() {
        setTimeout(() => {
            this.$refs.myInput.focus();
        }, 0);
    }
};
</script>