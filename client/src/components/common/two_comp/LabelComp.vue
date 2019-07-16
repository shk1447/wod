<template>
    <label>{{props.label}}</label>
</template>

<script>

export default {
    type:'two_comp',
    name:'label-comp',
    props: ['props','action'],
    data () {
        return {
            _props: this.props,
            _action: this.action
        }
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
