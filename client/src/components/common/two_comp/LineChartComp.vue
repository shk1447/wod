<template>
    <div :style="props.style">
        <v-chart :options="mergeOptions"/>
    </div>
</template>

<script>
import _ from 'lodash';

import ECharts from 'vue-echarts' // refers to components/ECharts.vue in webpack
import moment from 'moment';

import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'

export default {
    type:'two_comp',
    name:'line-chart-comp',
    props: ['id','props','data', 'input', 'output'],
    data () {
        return {
            init_options: {
                title: {
                    text:''
                },
                tooltip: {
                    trigger:'axis'
                },
                xAxis: {
                    type:'category',
                    data:[]
                },
                yAxis: {
                    type:'value'
                },
                series:[{
                    data:[],
                    type:'line'
                }]
            }
        }
    },
    computed: {
        mergeOptions:function(){
            var me = this;
            me.init_options.series[0].data = [];
            me.init_options.xAxis.data = [];
            _.each(me.data, function(v, i) {
                me.init_options.series[0].data.push(v[me.props.setter.y_axis]);
                me.init_options.xAxis.data.push(v[me.props.setter.x_axis]);
            })
            return me.init_options;
        }
    },
    components : {
        'v-chart': ECharts
    },
    methods: {
        input_data:function(data){
            var me = this;
            if(me.data) {
                if(me.data.length > parseInt(this.props.setter.data_amount)) {
                    me.data.shift()
                }
                me.data.push(data);
            } else {
                me.data = [data];
            }
        },
        output_data: function() {

        }
    },
    created() {
        console.log('created')
    },
    mounted() {
        console.log('mounted');
        this.core.flow.manager.addCompNode(this);
    },
    destroyed() {
        console.log('destroyed')
        this.core.flow.manager.removeCompNode(this);
    }
}
</script>

<style>
    .echarts {
        width: 100%;
        height: 100%;
    }
</style>
