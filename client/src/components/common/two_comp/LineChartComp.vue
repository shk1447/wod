<template>
    <div :style="props.style">
        <v-chart :options="props.option"/>
    </div>
</template>

<script>

import ECharts from 'vue-echarts' // refers to components/ECharts.vue in webpack

import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'

export default {
    type:'two_comp',
    name:'line-chart-comp',
    props: ['props'],
    data () {
        return {}
    },
    components : {
        'v-chart': ECharts
    },
    created() {
        console.log('created')
    },
    mounted() {
        console.log('mounted');
    },
    destroyed() {
        console.log('destroyed')
    }
}
</script>

<style>
    .echarts {
        width: 100%;
        height: 100%;
    }
</style>
