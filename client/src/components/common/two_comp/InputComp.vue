<template>
    <input :style="meta.props.style" @keyup="output_data" :placeholder="meta.props.style.placeHolder"/>
</template>

<script>

export default {
    type:'two_comp',
    category:'Form',
    compName:'input-comp',
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
            border:"1px solid black",
            placeHolder:'please input.'
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
            "key":"props.style.placeHolder",
            "label":"PLACEHOLDER",
            "type":"el-input",
            "description":"PLACEHOLDER"
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
        output_data: function(e) {
            if(this.meta.flow.wires && this.meta.flow.wires.length > 0) {
                for(var i = 0; i < this.meta.flow.wires.length; i++) {
                    var wired_obj = this.meta.flow.wires[i];
                    wired_obj.input_data({event:e,comp:this});
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
