<template>
<div id="data_manager" style="user-select:none; width:100%; height:100%; text-align: center; display: table;">
    <!-- <div style="display: table-cell;vertical-align: middle;">Data Manager <br> Comming Soon!</div> -->
</div>
</template>

<script>
export default {
    data () {
        return {}
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
