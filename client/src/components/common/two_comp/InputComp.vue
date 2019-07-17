<template>
    <div :style="props.style">
        <el-input v-model="props.model"></el-input>
    </div>
</template>

<script>

export default {
    type:'two_comp',
    name:'input-comp',
    props: ['props'],
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
