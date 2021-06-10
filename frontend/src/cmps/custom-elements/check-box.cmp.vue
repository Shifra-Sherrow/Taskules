<template>
    <!-- `checked` should be true or false -->
    <el-checkbox @change="toggleDone" v-model="checked"></el-checkbox>
</template>
<script>
export default {
    props: {
        isDone: Boolean,
    },
    data() {
        return {
            checked: true
        };
    },
    methods: {
        toggleDone() {
            return this.checked;
        }
    }
};
</script>