<template>
    <section
        v-if="attachmentsToShow && attachmentsToShow.length"
        class="attachments"
    >
        <div class="attachment-list">
            <div
                v-for="(attachment, idx) in attachmentsToShow"
                :key="idx"
                class="attachment-card flex f-col"
                :class="attachment.imgClass"
            >
                <img :src="attachment.src" />
                <div class="flex f-between">
                    <small>{{ attachment.name }}.{{ attachment.format }}</small>
                    <button
                        class="card-details-btn"
                        @click="emitDelete(attachment.id)"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { utilService } from '@/services/util.service'
export default {
    props: {
        attachments: Array,
    },
    data() {
        return {
            isShowAll: false,
        }
    },
    computed: {
        attachmentsToShow() {
            return utilService.deepCopy(this.attachments);
        }
    },
    methods: {
        emitDelete(attachmentId) {
            const attachments = this.attachmentsToShow;
            const attachmentIdx = attachments.findIndex(attachment => attachment.id === attachmentId)
            if (attachmentIdx !== -1) attachments.splice(attachmentIdx, 1);
            this.$emit('updateAttachments', attachments)
        }
    }
}
</script>

