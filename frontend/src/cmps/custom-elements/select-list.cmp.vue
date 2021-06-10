<template>
    <el-select @change="changeGroup" v-model="value" :placeholder="title">
        <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.title"
            :value="item.id"
        >
        </el-option>
    </el-select>
</template>

<script>
export default {
    props: {
        groups: Array,
        title: String
    },
    data() {
        return {
            options: this.groups,
            value: ''
        }
    },
    methods: {
        changeGroup() {
            this.$emit('changeCardGroup', this.value)
        }
    },
}
</script>