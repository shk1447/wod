<template>
    <div :style="props.style">
        <label>{{props.label}}</label>
    </div>
</template>

<script>

export default {
    type:'two_comp',
    name:'label-comp',
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
