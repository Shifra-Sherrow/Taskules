<template>
    <el-select @change="changePosition" v-model="value" :placeholder="+currPosition+diff+''">
        <el-option
            v-for="idx in cards.length + diff"
            :key="idx"
            :label="idx"
            :value="idx"
        >
        </el-option>
    </el-select>
</template>

<script>
export default {
    props: {
        cards: Array,
        currPosition: String,
        diff: Number
    },
    data() {
        return {
            value: ''
        }
    },
    methods: {
        changePosition() {
            this.$emit('changeCardPosition', this.value)
        }
    },
}
</script>