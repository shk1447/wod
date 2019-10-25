<template>
    <div :style="meta.props.style" @dragover="dragover" @drop="drop">
        <component v-for="(item, index) in meta.props.children" :key="index" :is="item.compName" v-on:click.native="onSelectedComp(item, $event)"
        :meta="item"></component>
    </div>
</template>

<script>
import uuid from 'uuid/v4';
import BaseComp from './BaseComp.js';

export default {
    mixins:[BaseComp],
    compName:'two-layer-comp',
    category:'Layer',
    type:'two_comp',
    props: ['meta'],
    init_props: {
        style: {
            position: "absolute",
            overflow: "hidden",
            top:"",
            left:"",
            width:"500px",
            height:"300px",
            zIndex: "0",
            border:"1px dashed black"
        },
        children:[]
    },
    fields:{
        setter:[],
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
            test:'test'
        }
    },
    components : {
        
    },
    methods: {
        onSelectedComp(item, event) {
            Vue.custom_events.emit('selected_item', {panel:'Property',type:'style',item:item});
            Vue.custom_events.emit('active_transform', {active:true,event:event,item:item});
            event.preventDefault();
            event.stopImmediatePropagation();
        },
        dragover(e) {
            e.preventDefault();
        },
        drop(e) {
            e.preventDefault();
            var transfer_data = e.dataTransfer.getData("component");
            if(transfer_data) {
                var data = JSON.parse(transfer_data);
                if(data.type === 'two_comp') {
                    console.log('drop comp', data);
                    data.init_props.style.top = e.offsetY + 'px';
                    data.init_props.style.left = e.offsetX + 'px';
                    var instance = {
                        id:uuid(),
                        page_id:this.page_id,
                        compName:data.compName,
                        type:data.type,
                        input:data.input,
                        output:data.output,
                        props:data.init_props
                    }
                    this.addChildren(instance);
                    e.stopImmediatePropagation();
                }
            }
        },
        input_data:function(data, caller){
            console.log(data);
        },
        output_data: function() {
            
        },
        addChildren: function(instance) {
            if(!this.meta.props.children) {
                console.log('!!!!!why!!!?')
                this.meta.props.children = [];
            }
            this.meta.props.children.push(instance);
            this.$forceUpdate();
        }
    },
    created() {
        console.log('created')
    },
    mounted() {
        console.log('mounted')
        //this.core.flow.manager.addCompNode(this);
    },
    destroyed() {
        console.log('destroyed')
        //this.core.flow.manager.removeCompNode(this);
    }
}
</script>

<style>
</style>
