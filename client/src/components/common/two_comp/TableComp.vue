<template>
    <div :style="props.style">
        <el-table :data="data" :height="props.style.height" style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column v-for="item in columns" :prop="item" :label="item"> </el-table-column>
        </el-table>
    </div>
</template>

<script>
import _ from 'lodash';

export default {
    type:'two_comp',
    name:'table-comp',
    props: ['id','props','data', 'input', 'output'],
    data () {
        return {
            data: [],
            columns: []
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
        this.columns = this.props.setter.columns.split(',');
        _.each(this.columns, function(v, i) {
            this.columns[i] = v.trim();
        })
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
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>
