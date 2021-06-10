<template>
    <section class="card-description">
        <div class="description-title flex">
            <h2>Description</h2>
            <button class="card-details-btn edit-desc-btn" v-if="!isEdit && desc" @click="edit">Edit</button>
        </div>
        <button class="add-desc-btn" v-if="!isEdit && !desc" @click="edit">
            Add a more detailed description...
        </button>
        <pre v-if="!isEdit && desc" @click="edit">{{ desc }}</pre>
        <textarea
            ref="myTextarea"
            v-if="isEdit"
            resize="none"
            cols="50"
            rows="3"
            class="desc"
            type="text"
            v-model="descToEdit"
            placeholder="Add a more detailed description..."
        />
        <button class="green-btn" v-if="isEdit" @click="save">Save</button>
        <button class="cancel-btn" v-if="isEdit" @click="cancel"><i class="fal fa-times"></i></button>
    </section>
</template>

<script>
export default {
    props: {
        description: String
    },
    data() {
        return {
            isEdit: false,
            desc: this.description,
            descToEdit: ''
        };
    },
    methods: {
        edit() {
            this.isEdit = true;
            this.descToEdit = this.desc;
            setTimeout(() => {
                this.$refs.myTextarea.focus();
            }, 0);
        },
        cancel() {
            this.descToEdit = this.desc;
            this.isEdit = false;
        },
        save() {
            this.desc = this.descToEdit;
            this.$emit('updateDesc', this.desc);
            this.isEdit = false;
        }
    }
};
</script>