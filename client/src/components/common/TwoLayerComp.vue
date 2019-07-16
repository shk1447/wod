<template>
    <div :style="props.style">
        <component v-for="item in props.children" :key="item.id" :is="item.compName" :id="item.id" :props="item.props" :action="item.action"></component>
    </div>
</template>

<script>

export default {
    name:'two-layer-comp',
    type:'two_comp',
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
