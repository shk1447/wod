<template>
    <div :style="meta.props.style">
        <v-chart ref="chart" :options="init_options"/>
    </div>
</template>

<script>
import _ from 'lodash';

import ECharts from 'vue-echarts' // refers to components/ECharts.vue in webpack
import moment from 'moment';

import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'

export default {
    type:'two_comp',
    compName:'line-chart-comp',
    input:true,
    output:false,
    props: ['meta'],
    init_props: {
        style : {
            position: "absolute",
            overflow: "hidden",
            zIndex: "0",
            border:"",
            top:"",
            left:"",
            width:"500px",
            height:"250px"
        },
        setter :{
            x_axis:"unixtime",
            y_axis:"test",
            legend : false,
            data_amount : 100
        }
    },
    fields: {
        style:[{
            "key":"id",
            "label":"ID",
            "type":"el-input",
            "description":"ID"
        },{
            "key":"props.style.top",
            "label":"TOP",
            "type":"el-input",
            "description":"TOP"
        },{
            "key":"props.style.left",
            "label":"LEFT",
            "type":"el-input",
            "description":"LEFT"
        },{
            "key":"props.style.width",
            "label":"WIDTH",
            "type":"el-input",
            "description":"LEFT"
        },{
            "key":"props.style.height",
            "label":"HEIGHT",
            "type":"el-input",
            "description":"LEFT"
        },{
            "key":"props.style.border",
            "label":"BORDER",
            "type":"el-input",
            "description":"BORDER"
        },{
            "key":"props.style.zIndex",
            "label":"Z-INDEX",
            "type":"el-input",
            "description":"Z-INDEX"
        }],
        setter:[{
            "key":"props.setter.x_axis",
            "label":"X 축",
            "type":"el-input",
            "description":"X 축 데이터 설정"
        },{
            "key":"props.setter.y_axis",
            "label":"Y 축",
            "type":"el-input",
            "description":"Y 축 데이터 설정"
        },{
            "key":"props.setter.legend",
            "label":"LEGEND 사용",
            "type":"el-input",
            "description":"LEGEND 사용"
        },{
            "key":"props.setter.data_amount",
            "label":"데이터 양",
            "type":"el-input",
            "description":"데이터 양 설정"
        }]
    },
    data () {
        return {
            meta:this.meta,
            init_options: {
                animation: false,
                title: {
                    text:''
                },
                toolbox: {
                    left: 'center',
                    feature : {
                        magicType: {show: true, type: ['line', 'bar']}
                    }
                },
                tooltip: {
                    trigger:'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    show:false, 
                    data:[]
                },
                xAxis: {
                    type:'category',
                    data:[]
                },
                yAxis: {
                    type:'value'
                },
                series:[{
                    name:'',
                    data:[],
                    areaStyle: {},
                    stack: '',
                    type:'line'
                }]
            }
        }
    },
    computed: {
        
    },
    components : {
        'v-chart': ECharts
    },
    methods: {
        mergeOptions:function(){
            var me = this;
            
            // Legend 사용여부
            var isLegend = me.meta.props.setter.legend == 'true';
            me.init_options.legend.show = isLegend;

            // 다중 데이터 INPUT 처리 
            var input_series = me.meta.props.setter.y_axis.split(',');   // 구조 개선 예정

            if(input_series.length !== me.init_options.series.length){  // 예외처리 개선 필요
                me.init_options.legend.data = [];
                me.init_options.series = [];
                for(var i = 0; i < input_series.length; i++ ){
                    if(isLegend){
                        me.init_options.legend.data.push(input_series[i].trim());
                    }
                    me.init_options.series.push({name:input_series[i].trim(), data:[], type:'line'});        
                }
            }

            for(var j = 0; j < input_series.length; j ++){
                me.init_options.series[j].data = [];
            }
            
            me.init_options.xAxis.data = [];
            _.each(me.meta.data, function(v, i) {
                for(var j = 0; j < input_series.length; j ++){
                    me.init_options.series[j].data.push(v[input_series[j].trim()]);
                }
                me.init_options.xAxis.data.push(v[me.meta.props.setter.x_axis]);
            })

            return me.init_options;
        },
        input_data:function(data){
            var me = this;
            if(me.meta.data) {
                if(me.meta.data.length > parseInt(this.meta.props.setter.data_amount)) {
                    me.meta.data.shift()
                }
                me.meta.data.push(data);
            } else {
                me.meta.data = [data];
            }
            this.$forceUpdate();
        },
        output_data: function() {

        }
    },
    created() {
        console.log('created')
        this.meta.data = this.meta.data ? this.meta.data : [];
    },
    mounted() {
        console.log('mounted');
        this.core.flow.manager.addCompNode(this);
    },
    updated() {
        this.init_options = this.mergeOptions();
        this.$refs.chart.refresh()
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
