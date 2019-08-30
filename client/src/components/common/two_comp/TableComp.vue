<template>
    <div :style="props.style" :test="_id">
        <el-table :data="data" :height="props.style.height" style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column v-for="item in columns" :key="item" :prop="item" :label="item"> </el-table-column>
        </el-table>
    </div>
</template>

<script>
import _ from 'lodash';
import { setInterval } from 'timers';

export default {
    type:'two_comp',
    name:'table-comp',
    props: ['_id','props','data', 'input', 'output', 'page_id'],
    input:true,
    output:false,
    init_props: {
        style:{
            position: "absolute",
            overflow: "hidden",
            zIndex: "0",
            top:"",
            left:"",
            width:"250px",
            height:"500px"
        },
        setter: {
            columns:"test,test2,test3"
        }
    },
    fields:{
        setter:[{
            "key":"props.setter.columns",
            "label":"컬럼명",
            "type":"string",
            "description":"컬럼명"
        }],
        style:[{
            "key":"_id",
            "label":"ID",
            "type":"string",
            "description":"ID"
        },{
            "key":"props.style.top",
            "label":"TOP",
            "type":"string",
            "description":"TOP"
        },{
            "key":"props.style.left",
            "label":"LEFT",
            "type":"string",
            "description":"LEFT"
        },{
            "key":"props.style.width",
            "label":"WIDTH",
            "type":"string",
            "description":"WIDTH"
        },{
            "key":"props.style.height",
            "label":"HEIGHT",
            "type":"string",
            "description":"HEIGHT"
        }]
    },
    data () {
        return {
            _id:this._id,
            props:this.props
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
        input_data:function(data){
            var me = this;
            if(me.data) {
                me.data.splice(0, 0, data);
            } else {
                me.data = [data];
            }
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
        this.columns = this.props.setter.columns.split(',');
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
        console.log(this.id);
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
