<template>
    <div :style="props.style">
        <el-input v-model="props.model" @change="action.change"></el-input>
    </div>
</template>

<script>

export default {
    name:'input-comp',
    props: ['props','action'],
    data () {
        return { }
    },
    components : {
        
    },
    created() {
        console.log('created')
    },
    mounted() {
        console.log('mounted')
    },
    destroyed() {
        console.log('destroyed')
    }
}
</script>

<style>
</style>
