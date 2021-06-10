<template>
    <section class="card-checklist">
        <div class="checklist-title flex f-s-between">
            <h2>{{ checklist.title }}</h2>
            <button class="card-details-btn" @click="deleteChecklist">
                Delete
            </button>
        </div>
        <div class="show-percent flex">
            <div class="precent">{{ percent }}</div>
            <div class="my-progress">
                <div
                    class="my-bar"
                    :style="{ width: percent, backgroundColor: bgc }"
                ></div>
            </div>
        </div>
        <div class="items-container" v-if="checklist.items.length">
            <item-preview
                v-for="item in checklist.items"
                :key="item.id"
                :item="item"
                @updateItem="updateItem"
                @removeItem="removeItem"
                @toggleIsDone="toggleIsDone"
            />
        </div>
        <template v-if="isEdit">
            <input
                class="add-item-input"
                type="text"
                placeholder="Add an item"
                v-model="newItem"
                ref="myInput"
                @keyup.enter="saveItem"
            />
            <button class="green-btn" @click="saveItem">Save</button>
            <button class="cancel-btn m-btns" @click="cancel">
                <i class="fal fa-times"></i>
            </button>
        </template>
        <button class="card-details-btn" v-else @click="openInput">
            Add an item
        </button>
    </section>
</template>

<script>
import { utilService } from '../../../services/util.service';
import itemPreview from '../item-preview.cmp';

export default {
    props: {
        checklist: Object
    },
    data() {
        return {
            newItem: '',
            isEdit: false
        };
    },
    computed: {
        percent() {
            const doneCount = this.checklist.items.reduce((acc, item) => acc += item.isDone ? 1 : 0, 0);
            let percent = Math.trunc(doneCount / this.checklist.items.length * 100);
            if (isNaN(percent)) percent = 0;
            return percent + '%';
        },
        bgc() {
            if (this.percent === '100%') return '#5aac44';
            return '#0079bf';
        }
    },
    methods: {
        openInput() {
            this.isEdit = true;
            setTimeout(() => {
                this.$refs.myInput.focus();
            }, 0);
        },
        cancel() {
            this.newItem = '';
            this.isEdit = false;
        },
        saveItem() {
            const newChecklist = this.checklist;
            newChecklist.items.push({ id: utilService.makeId(), txt: this.newItem, isDone: false });
            this.$emit('updeteChecklist', newChecklist);
            this.cancel();
        },
        deleteChecklist() {
            this.$emit('deleteChecklist', this.checklist.id);
        },
        updateItem(itemId, newTxt) {
            let newChecklist = this.checklist;
            const idx = newChecklist.items.findIndex(item => item.id === itemId);
            newChecklist.items[idx].txt = newTxt;
            this.$emit('updeteChecklist', newChecklist);
            this.cancel();
        },
        removeItem(itemId) {
            let newChecklist = this.checklist;
            const idx = newChecklist.items.findIndex(item => item.id === itemId);
            newChecklist.items.splice(idx, 1);
            this.$emit('updeteChecklist', newChecklist);
            this.cancel();
        },
        toggleIsDone(itemId) {
            let newChecklist = this.checklist;
            const idx = newChecklist.items.findIndex(item => item.id === itemId);
            newChecklist.items[idx].isDone = !newChecklist.items[idx].isDone;
            this.$emit('updeteChecklist', newChecklist);
            this.cancel();
        }
    },
    components: {
        itemPreview
    }
};
</script>