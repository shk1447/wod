<template>
    <div :style="props.style">

    </div>
</template>

<script>

export default {
    name:'three-layer-comp',
    props: ['props','action'],
    data () {
        return { }
    },
    methods: {
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
