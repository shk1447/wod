<template>
    <div :style="props.style">
        <el-button>{{props.label}}</el-button>
    </div>
</template>

<script>

export default {
    type:'two_layer',
    name:'button-comp',
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
