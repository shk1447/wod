<template>
    <div :id="meta.id" :style="meta.props.style">
        <l-map :zoom="meta.props.setter.zoom" :center="meta.props.setter.center">
            <l-tile-layer :url="meta.props.setter.url"></l-tile-layer>
        </l-map>
    </div>
</template>

<script>

import L from 'leaflet';
import {LMap, LTileLayer, LMarker} from 'vue2-leaflet';
import uuid from 'uuid/v4';
import 'leaflet/dist/leaflet.css';

export default {
    compName:'map-layer-comp',
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
            height:"500px",
            zIndex: "0",
            border:"1px dashed black"
        },
        setter: {
            zoom:13,
            center: {"lat":40.41322,"lng":-1.219482},
            url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        },
        children:[]
    },
    fields:{
        setter:[[{
            "key":"props.setter.center.lat",
            "label":"위도",
            "type":"el-input",
            "description":"위도"
        },{
            "key":"props.setter.center.lng",
            "label":"경도",
            "type":"el-input",
            "description":"경도"
        }]],
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
            "key":"props.setter.center.lat",
            "label":"위도",
            "type":"el-input",
            "description":"위도"
        },{
            "key":"props.setter.center.lng",
            "label":"경도",
            "type":"el-input",
            "description":"경도"
        }]]
    },
    data () {
        return {
            meta:this.meta
        }
    },
    components : {
        LMap, LTileLayer, LMarker
    },
    methods: {
        input_data:function(data, caller){
            console.log(data);
        },
        output_data: function() {
            
        }
    },
    created() {
        console.log('created')
    },
    mounted() {
        console.log('mounted');
        this.core.flow.manager.addCompNode(this);
    },
    updated() {
        console.log('map updated');
    },
    destroyed() {
        console.log('destroyed')
        this.core.flow.manager.removeCompNode(this);
    }
}
</script>

<style>
</style>
