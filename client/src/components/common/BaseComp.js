export default {
    type:'',
    category:'',
    compName:'',
    input:true,
    output:true,
    props: ['meta'],
    init_props: {
        style: {},
        setter: {}
    },
    fields:{
        setter:[],
        style:[]
    },
    methods: {
        input_data:function(data, caller){

        },
        output_data: function(data) {
            
        },
        updatedProps: function() {
            console.log('Updated Props');
        }
    },
    components : {

    },
    data () {
        return {
            meta:this.meta
        }
    },
    created() {
        
    },
    mounted() {
        this.core.flow.manager.addCompNode(this);
        console.log('test', this.meta);
        // this.$watch('meta.props.style.width', function(newVal, oldVal) {
        //     this.updatedProps();
        // }.bind(this), {deep:true})
    },
    updated() {

    },
    destroyed() {
        this.core.flow.manager.removeCompNode(this);
    }
}
