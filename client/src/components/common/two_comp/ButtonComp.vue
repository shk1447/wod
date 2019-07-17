<template>
    <div :style="props.style">
        <el-button>{{props.label}}</el-button>
    </div>
</template>

<script>

export default {
    type:'two_comp',
    name:'button-comp',
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
