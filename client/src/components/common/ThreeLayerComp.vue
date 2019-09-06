<template>
    <div ref="three_container" :style="meta.props.style" @dragover="dragover" @drop="drop">
        <CameraControlPanel
                @zoomIn="zoomIn"
                @zoomOut = "zoomOut"
                @moveLeft = "moveLeft"
                @moveRight = "moveRight"
                @moveUp = "moveUp"
                @moveDown = "moveDown"
                @topView = "topView"
                @quarterView = "quarterView"
        ></CameraControlPanel>
    </div>
</template>

<script>
import * as THREE from 'three'
import CameraControlPanel from './util/CameraControlPanel/CameraControlPanel'
import threeLayer from './util/mixins/ThreeLayerComp/ThreeLayer/ThreeLayer'
export default {
    compName:'three-layer-comp',
    category:'Layer',
    type:'two_comp',
    mixins : [threeLayer],
    props: ['meta'],
    init_props: {
        style: {
            position: "absolute",
            overflow: "hidden",
            top:"0px",
            left:"0px",
            width:"50%",
            height:"50%",
            zIndex: "0",
            border: '1px dashed black'
        },
        setter: {
            camera : {
                near : 1,
                far : 10000,
                fov : 60,
                aspect : 1.6,
                position : {
                    x : 10,
                    y : 10,
                    z : 10
                }
            }
        },
        children:[]
    },
    fields:{
        setter:[],
        style:[
            [
                {
                    "key":"id",
                    "label":"ID",
                    "type":"el-input",
                    "description":"ID"
                }
            ],
            [
                {
                "key":"props.style.top",
                "label":"TOP",
                "type":"el-input",
                "description":"TOP"
                },{
                "key":"props.style.left",
                "label":"LEFT",
                "type":"el-input",
                "description":"LEFT"
                }
            ],
            [
                {
                    "key":"props.style.width",
                    "label":"WIDTH",
                    "type":"el-input",
                    "description":"LEFT"
                },{
                    "key":"props.style.height",
                    "label":"HEIGHT",
                    "type":"el-input",
                    "description":"LEFT"
                }
            ],
            [
                {
                "key":"props.style.border",
                "label":"BORDER",
                "type":"el-input",
                "description":"BORDER"
                },
                {
                "key":"props.style.zIndex",
                "label":"Z-INDEX",
                "type":"el-input",
                "description":"Z-INDEX"
                }
            ],
            [
                {
                    "key" : "props.setter.camera.position.x",
                    "label" : "c_x",
                    "type" : "el-input",
                    "description" : "camera x"
                },
                {
                    "key" : "props.setter.camera.position.y",
                    "label" : "c_y",
                    "type" : "el-input",
                    "description" : "camera y"
                },
                {
                    "key" : "props.setter.camera.position.z",
                    "label" : "c_z",
                    "type" : "el-input",
                    "description" : "camera z"
                }
            ],
            [
                {
                    "key" : "props.setter.camera.near",
                    "label" : "c_near",
                    "type" : "el-input",
                    "description" : "camera near"
                },
                {
                    "key" : "props.setter.camera.far",
                    "label" : "c_far",
                    "type" : "el-input",
                    "description" : "camera far"
                }
            ],
            [
                {
                    "key" : "props.setter.camera.fov",
                    "label" : "c_fov",
                    "type" : "el-input",
                    "description" : "camera fov"
                }
            ]
        ]
    },
    data () {
        return {
            meta:this.meta
        }
    },
    methods: {
        dragover(e) {
            e.preventDefault();
        },
        drop(e) {
            e.preventDefault();
            var transfer_data = e.dataTransfer.getData("component");
            if(transfer_data) {
                var data = JSON.parse(transfer_data);
                if(data.type === 'three_comp') {
                    e.stopImmediatePropagation();
                    console.log('drop comp', data);
                    this.addChild(data)
                }
            }
        },
        input_data:function(data){
            console.log(data);
        },
        output_data: function() {

        },

        init() {
            var manager = new THREE.LoadingManager(this.loadedModel);
            manager.onProgress = function(item, loaded, total) {
                console.log(item, loaded, total);
            };

            this.initializeThreeLayer();
            this.render();
        },
        loadedModel() {
            console.log('loaded model');
        }
    },
    components : {CameraControlPanel},
    created() {
        console.log('three created props' , this.meta.props);
        console.log(this.three_comp);
        console.log('created')
    },
    mounted() {
        console.log(this.components);
        console.log('three layer mounted')
        this.core.flow.manager.addCompNode(this);
        this.init();
        // this.addChildren(this)
    },
    updated() {
        console.log('updated!!!!!')
        this.render();
    },
    destroyed() {
        this.destroyThreeLayer();
        console.log('destroyed')
        this.core.flow.manager.removeCompNode(this);
    }
}
</script>

<style>
</style>
