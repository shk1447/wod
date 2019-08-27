<template>
    <div style="height:100%; overflow:auto;">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item v-for="field in fields.setter" :key="field.key" :label="field.label">
                <el-input :value="getModel(field.key)" @input="handleChangeSetter(field.key, $event)"></el-input>
            </el-form-item>
            <el-form-item v-if="selected_item.props.fields && selected_item.props.fields.length > 0">
                <el-button type="primary" @click="onSubmit">Save</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import api from "../../api";

export default {
    data() {
        return {
            selected_item:{
                props:{
                    setter:{}
                }
            },
            fields:{
                setter:[],
                style:[]
            }
      }
    },
    computed: {
        getModel: function() {
            return function(key) {
                console.log(key);
                var me = this;
                var res = new Function('return this.selected_item.' + key ).bind(this);
                return res();
            }
        }
    },
    components: {
        
    },
    methods: {
        setValueByPath(object, path, value) {
            var count = 0;
            var path_arr = path.split('.')
            var result = path_arr.reduce(function (d, index) {
                count++;
                if(count === path_arr.length) {
                    d[index] = value
                }
                return d[index]
            }, object)
            return result;
        },
        handleChangeSetter(key, event){
            var setter = this.setValueByPath(this.selected_item, key, event);
            //setter = event;
            console.log('test', setter);
        },
        onSubmit() {
            console.log('submit!');
            this.custom_events.emit('redrawFlow');
        }
    },
    created() {
        
    },
    updated() {
        console.log('updated!!', this.selected_item);
        var comp_fields = this[this.selected_item.type][this.selected_item.compName].fields;
        this.fields = comp_fields ? comp_fields : {setter : [], style : []};
    },
    mounted() {
        
    },
    destroyed() {
        
    }
}
</script>

<style>

</style>
