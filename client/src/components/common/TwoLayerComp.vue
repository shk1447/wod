<template>
    <div :style="props.style" @dragover="dragover" @drop="drop" v-on:click.native="onSelectedComp">
        <component v-for="item in props.children" :key="item.id" :is="item.compName" v-on:click.native="onSelectedComp(item)"
        :_id="item._id" :page_id="item.page_id" :props="item.props" :data="item.data" :input="item.input" :output="item.output"></component>
    </div>
</template>

<script>

export default {
    name:'two-layer-comp',
    type:'two_comp',
    props: ['_id','props','data', 'input', 'output', 'page_id'],
    init_props: {
        style: {
            position: "absolute",
            overflow: "hidden",
            zIndex: "0",
            top:"",
            left:"",
            width:"100%",
            height:"100%"
        }
    },
    fields:{
        setter:[],
        style:[{
            "key":"id",
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
            "description":"LEFT"
        },{
            "key":"props.style.heigth",
            "label":"HEIGHT",
            "type":"string",
            "description":"LEFT"
        }]
    },
    data () {
        return {
            _id:this._id,
            props:this.props
        }
    },
    components : {
        
    },
    methods: {
        onSelectedComp(item) {
            Vue.custom_events.emit('selected_item', {type:'style',item:item});
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
                        _id:"test",
                        page_id:this.page_id,
                        compName:data.name,
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
        input_data:function(data){
            console.log(data);
        },
        output_data: function() {
            
        },
        addChildren: function(instance) {
            if(!this.props.children) this.props.children = [];
            this.props.children.push(instance);
            this.$forceUpdate();
        }
    },
    created() {
        console.log('created')
    },
    mounted() {
        console.log('mounted')
        console.log(this.props.style);
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
