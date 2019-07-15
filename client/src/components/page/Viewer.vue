<template>
  <div style="position:absolute;">
    <component v-for="item in instances" :key="item.id" :is="item.compName" :id="item.id" :props="item.props" :action="item.action"></component>
  </div>
</template>

<script>

export default {
    data () {
        return {
            instances : [
            {
                id:"two_layer",
                compName:"two-layer-comp",
                props: {
                    style: {
                        "position":"absolute",
                        "top":"10px",
                        "left":"10px",
                        "width": "800px",
                        "height": "500px",
                        "border": "1px solid black"
                    },
                    children: [{
                        id:"test_input",
                        compName:"input-comp",
                        props:{
                            model:"test",
                            style: {
                                "position":"absolute",
                                "top":"30px",
                                "left":"90px",
                                "width": "100px"
                            }
                        },
                        action:{
                            change:function(e) {
                                console.log(e);
                            }
                        }
                    },{
                        id:"test_button",
                        compName:"button-comp",
                        props:{
                            label:"click",
                            style: {
                                "position":"absolute",
                                "top":"30px",
                                "left":"200px",
                                "width": "100px"
                            }
                        },
                        action:{
                            change:function(e) {
                                console.log(e);
                            }
                        }
                    }]
                },
                action: {
                    
                }
            },{
                id:"three_layer",
                compName:"three-layer-comp",
                props: {
                    style: {
                        "position":"absolute",
                        "top":"10px",
                        "left":"820px",
                        "width": "800px",
                        "height":"500px",
                        "border": "1px solid black"
                    },
                    children:[{
                        id:"",
                        compName:"",
                        props:{
                            path:""
                        },
                        action:{}
                    }]
                },
                action: {

                }
            }]
        }
    },
    components : {
        
    },
    created() {
        console.log('created')
    },
    mounted() {
        console.log('mounted')
    },
    destroyed() {
        console.log('destroyed')
    }
}
</script>

<style>
</style>
