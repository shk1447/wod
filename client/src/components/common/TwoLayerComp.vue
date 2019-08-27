<template>
    <div :style="props.style">
        <component v-for="item in props.children" :key="item.id" :is="item.compName"
        :id="item.id" :page_id="item.page_id" :props="item.props" :data="item.data" :input="item.input" :output="item.output"></component>
    </div>
</template>

<script>

export default {
    name:'two-layer-comp',
    type:'two_comp',
    props: ['id','props','data', 'input', 'output', 'page_id'],
    data () {
        return { }
    },
    components : {
        
    },
    methods: {
        input_data:function(data){
            console.log(data);
        },
        output_data: function() {
            
        }
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
