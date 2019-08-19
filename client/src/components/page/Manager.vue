<template>
<div id="data_manager" @dragover="dragover" @drop="drop" style="user-select:none; width:100%; height:100%; text-align: center; display: table;">
    <!-- <div style="display: table-cell;vertical-align: middle;">Data Manager <br> Comming Soon!</div> -->
</div>
</template>

<script>
import _ from 'lodash';
export default {
    data () {
        return {}
    },
    methods: {
        dragover(e) {
            e.preventDefault();
        },
        drop(e) {
            e.preventDefault();
            var me = this;
            me.instances = [];
            var transfer_data = e.dataTransfer.getData("page");
            var data = JSON.parse(transfer_data);
            setTimeout(function() {
                me.$loading({})
                console.log(data.instances);
                var offset = me.core.flow.layer.getPosition(e);
                function getInstances(instances, row, column) {
                    _.each(instances, function(comp,i) {
                        if(comp.props.children && comp.props.children.length > 0) {
                            getInstances(comp.props.children, row+i, column+1);
                            me.core.flow.layer.addNodes({
                                id:comp.id,
                                x: offset.x + (column*16*8),
                                y: offset.y + ((row+i)*16*2),
                                input:true,output:false
                            })
                        } else {
                            me.core.flow.layer.addNodes({
                                id:comp.id,
                                x: offset.x + ((column+i)*16*8),
                                y: offset.y + (row*16*2),
                                input:true,output:false
                            })
                        }
                    })
                }
                getInstances(data.instances, 0, 0);
                me.$loading({}).close();
            },0)
        }
    },
    created() {
        console.log('created')
    },
    mounted() {
        this.core.flow.layer.init('data_manager');
        //this.core.flow.layer.addNodes({id:'test', x:100,y:100})
        console.log('mounted')
    },
    destroyed() {
        this.core.flow.layer.uninit();
        console.log('destroyed')
    }
}
</script>

<style>
.axis path {
  display: none;
}

.axis line {
  stroke-opacity: 0.1;
  shape-rendering: crispEdges;
}

.port.visible {
    visibility: visible;
}

.port_hovered {
    stroke:#ff7f0e;
    fill:#ff7f0e;
}

.link_background {
    stroke: #fff;
    opacity: 0;
    stroke-width: 20;
    cursor: crosshair;
    fill:none;
}

.link_line {
    fill:none;
    pointer-events: none;
}

.drag_line {
    stroke:#ff7f0e;
    fill:none;
    pointer-events: none;
}

</style>
