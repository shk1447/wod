<template>
    <el-button :style="meta.props.style" @click="output_data">{{meta.props.style.label}}</el-button>
</template>

<script>

export default {
    type:'two_comp',
    category:'Form',
    compName:'button-comp',
    input:false,
    output:true,
    props: ['meta'],
    init_props: {
        style: {
            position: "absolute",
            overflow: "hidden",
            top:"",
            left:"",
            width:"120px",
            height:"60px",
            zIndex: "0",
            border:"1px dashed black",
            label:'CLICK'
        },
        setter: {},
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
        }],[{
            "key":"props.style.label",
            "label":"LABEL",
            "type":"el-input",
            "description":"LABEL"
        }]]
    },
    data () {
        return {
            meta:this.meta
        }
    },
    methods: {
        input_data:function(data){
            
        },
        output_data: function() {
            if(this.meta.flow.wires && this.meta.flow.wires.length > 0) {
                for(var i = 0; i < this.meta.flow.wires.length; i++) {
                    var wired_obj = this.meta.flow.wires[i];
                    wired_obj.input_data(this);
                }
            }
        }
    },
    components : {
        
    },
    created() {
        console.log('created')
    },
    mounted() {
        console.log('mounted')
        this.core.flow.manager.addCompNode(this);
    },
    destroyed() {
        console.log('destroyed')
        this.core.flow.manager.removeCompNode(this);
    }
}
</script>

<style>
</style>
