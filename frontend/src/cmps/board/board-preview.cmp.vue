<template>
    <section
        class="board-preview flex f-col"
        :style="boardStyle"
        @click="goToBoard"
    >
        <div class="flex f-s-between">
            <h2>{{ boardDetails.title }}</h2>
            <i class="far fa-star favorite" v-if="boardDetails.isMarked"></i>
            <!-- <i class="far fa-star favorite" v-else></i> -->
        </div>
        <button class="delete-btn" @click.stop="emitDelete">
            <i class="fas fa-trash-alt"></i>
        </button>
        <!-- <button class="delete-btn" @click.stop="emitDelete">Delete Board</button> -->
    </section>
</template>

<script>
export default {
    props: {
        boardDetails: Object,
        boardBg: String
    },
    computed: {
        boardStyle() {
            return { 'background': this.boardBg };
        }
    },
    methods: {
        goToBoard() {
            this.$router.push(`/board/${this.boardDetails._id}`);
        },
        emitDelete() {
            this.$emit('deleted', this.boardDetails._id);
        },
        toggleMarkBoard() {
        }
    }
}
</script>

