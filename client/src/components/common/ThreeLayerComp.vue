<template>
    <Renderer
              v-bind:renderer_props = "{antialias : true, alpha : true}"
              v-bind:layer_meta = "meta">
        <Scene>
            <LayerGrid v-bind:size = "1000" v-bind:divisions="100"></LayerGrid>
            <DirectionalLight v-bind:position = "{x : 1, y : 1, z: 1}"  v-bind:color = "0xffffff" v-bind:name="'_directionalLight'"></DirectionalLight>
            <DirectionalLight v-bind:position = "{x : -1, y : -1, z: -1}"  v-bind:color = "0x888888" v-bind:name="'_directionalLight2'"></DirectionalLight>
            <AmbientLight v-bind:color ="0x222222" v-bind:name="'_ambientLight'"></AmbientLight>
            <PerspectiveCamera v-bind:camera_props="meta.props.setter.camera"></PerspectiveCamera>
            <OrthographicCamera v-bind:camera_props="meta.props.setter.camera"></OrthographicCamera>
            <ThreeEvent></ThreeEvent>
            <OrbitControls></OrbitControls>
            <TransformControl></TransformControl>
            <component v-for="(item, index) in meta.props.children" :key="index" :is="item.compName" v-bind:meta = "item"></component>
        </Scene>

    </Renderer>

</template>

<script>
import * as THREE from 'three'
import CameraControlPanel from './three_layer_comp/CameraControlPanel/CameraControlPanel'
import LayerControlPanel from './util/LayerControlPanel/LayerControlPanel'
import Renderer from './three_layer_comp/Renderer/Renderer'
import Scene from './three_layer_comp/Scene/Scene'
import DirectionalLight from './three_layer_comp/Light/DirectionalLight'
import AmbientLight from './three_layer_comp/Light/AmbientLight'
import PerspectiveCamera from './three_layer_comp/Camera/PerspectiveCamera'
import OrbitControls from './three_layer_comp/OrbitControl/OrbitControls'
import OrthographicCamera from './three_layer_comp/Camera/OrthographicCamera'
import ThreeEvent from './three_layer_comp/ThreeEvent/ThreeEvent'
import LayerGrid from './three_layer_comp/LayerGrid/LayerGrid'
import TransformControl from './three_layer_comp/TransformControl/TransformControl'
export default {
    compName:'three-layer-comp',
    category:'Layer',
    type:'two_comp',
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
            },
            grid : {
                size : 1000,
                divisions : 500,
                gridList : []
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
            ],
            [
                {
                    "key" : "props.setter.grid.size",
                    "label" : "g_size",
                    "type" : "el-input",
                    "description" : "grid size"
                },
                {
                    "key" : "props.setter.grid.divisions",
                    "label" : "g_div",
                    "type" : "el-input",
                    "description" : "grid divisions"
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
                    // this.addChild(data)
                    console.log("################## DROP META #########################")
                    console.log(this.meta);

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

            // this.initializeThreeLayer();
            // this.render();
        },
        loadedModel() {
            console.log('loaded model');
        }
    },
    components : {
        LayerGrid,
        ThreeEvent,
        OrthographicCamera,
        AmbientLight,
        OrbitControls,
        PerspectiveCamera, DirectionalLight, Scene, Renderer, LayerControlPanel, CameraControlPanel, TransformControl
    },
    created() {
        console.log('three created props' , this.meta.props);
        console.log(this.three_comp);
        console.log(this.meta);
        console.log('created')
    },
    mounted() {
        console.log(this.components);
        console.log('three layer mounted')
        console.log(this);
        this.core.flow.manager.addCompNode(this);
        // this.init();
        // this.addChildren(this)
    },
    updated() {
        console.log('updated!!!!!')
        // this.render();
    },
    destroyed() {
        console.log('destroyed')
        this.core.flow.manager.removeCompNode(this);
    }
}
</script>

<style>
</style>
