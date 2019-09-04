<template>
    <div :style="meta.props.style">
        <el-table :data="meta.data" style="width: 100%; height:100%; overflow:auto;" :row-class-name="tableRowClassName">
            <el-table-column v-for="item in columns" :key="item" :prop="item" :label="item"> </el-table-column>
        </el-table>
    </div>
</template>

<script>
import _ from 'lodash';
import { setInterval } from 'timers';

export default {
    type:'two_comp',
    category:'Basic',
    compName:'table-comp',
    props: ['meta'],
    input:true,
    output:false,
    init_props: {
        style:{
            position: "absolute",
            overflow: "hidden",
            zIndex: "0",
            border:"",
            top:"",
            left:"",
            width:"250px",
            height:"500px"
        },
        setter: {
            columns:"test,test2,test3",
            data_amount:100
        }
    },
    fields:{
        setter:[[{
            "key":"props.setter.columns",
            "label":"컬럼명",
            "type":"el-input",
            "description":"컬럼명"
        },{
            "key":"props.setter.data_amount",
            "label":"데이터 양",
            "type":"el-input",
            "description":"데이터 양 설정"
        }]],
        style:[[{
            "key":"id",
            "label":"ID",
            "type":"el-input",
            "description":"ID"
        }],[{
            "key":"props.style.top",
            "label":"TOP",
            "type":"el-input",
            "description":"TOP"
        },{
            "key":"props.style.left",
            "label":"LEFT",
            "type":"el-input",
            "description":"LEFT"
        }],[{
            "key":"props.style.width",
            "label":"WIDTH",
            "type":"el-input",
            "description":"LEFT"
        },{
            "key":"props.style.height",
            "label":"HEIGHT",
            "type":"el-input",
            "description":"LEFT"
        }],[{
            "key":"props.style.border",
            "label":"BORDER",
            "type":"el-input",
            "description":"BORDER"
        },{
            "key":"props.style.zIndex",
            "label":"Z-INDEX",
            "type":"el-input",
            "description":"Z-INDEX"
        }]]
    },
    data () {
        return {
            meta:this.meta
        }
    },
    components : {
        mergeOptions:function(){
            var me = this;
            console.log('mergeOptions');
            return me.data;
        }
    },
    methods: {
        pushData: function(data) {
            var me = this;
            if(me.meta.data) {
                if(me.meta.data.length > parseInt(this.meta.props.setter.data_amount)) {
                    me.meta.data.pop();
                }
                me.meta.data.splice(0, 0, data);
            } else {
                me.meta.data = [data];
            }
        },
        input_data:function(data){
            var me = this;
            if(Array.isArray(data)) {
                _.each(data, function(d,i) {
                    me.pushData(d);
                })
            } else {
                this.pushData(data);
            }
            
            this.$forceUpdate();
        },
        output_data: function() {

        },
        tableRowClassName({row, rowIndex}) {
            var me = this;

            var sum = 0;
            _.each(me.columns, function(v, i){
                sum += parseInt(row[v]);
            })

            if (sum > 200) {
                return 'warning-row';
            } else if (sum > 150) {
                return 'success-row';
            }
            return '';
        }
    },
    created() {
        var me = this;
        this.columns = this.meta.props.setter.columns.split(',');
        _.each(this.columns, function(v, i) {
            // closure this접근이 안되므로 위에 me로 define하거나, this를 bind하여야합니다.
            me.columns[i] = v.trim();
        })
        // bind예시
        // _.each(this.columns, function(v, i) {
        //     this.columns[i] = v.trim();
        // }.bind(this))
        console.log('created')
    },
    mounted() {
        var me = this;
        console.log('mounted');
        this.core.flow.manager.addCompNode(this);
        // setInterval(function(){
        //     me.$forceUpdate()
        // },1000)
    },
    updated() {
        console.log(this.$data);
        console.log('table updated!!!')
    },
    destroyed() {
        console.log('destroyed')
        this.core.flow.manager.removeCompNode(this);
    }
}
</script>

<style>
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>
