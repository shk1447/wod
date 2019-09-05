<template>
    <div ref="three_container" :style="meta.props.style" @dragover="dragover" @drop="drop">
        <CameraControlPanel
                @zoomIn="zoomIn"
                @zoomOut = "zoomOut"
                @topView = "topView"
                @quarterView = "quarterView"
        ></CameraControlPanel>
    </div>
</template>

<script>
import * as THREE from 'three'
import CameraControlPanel from './util/CameraControlPanel/CameraControlPanel'
import ThreeLayerEvent from './util/mixins/ThreeLayerComp/ThreeLayerEvent/ThreeLayerEvent'
import Camera from './util/mixins/ThreeLayerComp/Camera/Camera'
import Scene from './util/mixins/ThreeLayerComp/Scene/Scene'
import Children from './util/mixins/ThreeLayerComp/Children/Children'
export default {
    compName:'three-layer-comp',
    category:'Layer',
    type:'two_comp',
    mixins : [ThreeLayerEvent, Camera, Scene, Children],
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
                }
            }
        },
        input_data:function(data){
            console.log(data);
        },
        output_data: function() {

        },
        zoomIn(){
            this.controls.zoomIn();
        },
        zoomOut(){
            this.controls.zoomOut();
        },
        topView(){
            this.camera.position.set(0, 100, 0);
            this.camera.updateProjectionMatrix();
            this.render();
        },
        quarterView(){

        },
        render() {
            this.sceneResizeCameraUpdate(this.container, this.renderer);
            this.renderer.render(this.scene, this.camera);

        },
        init() {
            var manager = new THREE.LoadingManager(this.loadedModel);
            manager.onProgress = function(item, loaded, total) {
                console.log(item, loaded, total);
            };


            //################## INITIALIZE SCENE ###########################
            this.initializeScene(this);
            //################## INITIALIZE CAMERA ###########################
            this.initializeCamera(this.meta.props.setter.camera);
            this.setCameraPropsWatch(this, 'meta.props.setter.camera');
            //################## INITIALIZE CONTROL ###########################
            this.initializeControl(this, this.camera);



            //################## INITIALIZE GRID HELPER ###########################
            this.initializeHelper(10, 100, 0x000000);

            //################# ADD CUSTOM EVENT ####################################
            this.initializeThreeLayerEvent(this.camera, this.renderer.domElement);
            this.customThreeLayerCompMouseDownHandler = function(event){
                console.log("############## Mousedown Event#####################");
                this.mousedownComponent.outlineElement.visible = false;
                console.log(event.target);
                event.target.outlineElement.visible = true;
                this.render();
            }
            this.customThreeLayerCompMouseOverHandler = function(event){
                console.log(event.target);
                if(event.target.$obj.children.length){
                    var that = this;
                    event.target.$obj.children.forEach(function(child){
                        child.material.emissive.setHex("0x64FE2E")
                        child.material.needsUpdate = true;
                        that.render();
                    })
                }
            }
            this.customThreeLayerCompMouseOutHandler = function(event){
                var that = this;
                if(this.mousedownComponent !== null){
                    if(this.mousedownComponent !== event.target.id){
                        if(event.target.$obj.children.length){
                            event.target.$obj.children.forEach(function(child){
                                child.material.emissive.setHex("0x000000")
                                child.material.needsUpdate = true;
                                that.render();
                            })
                        }
                    }
                }else{
                    if(event.target.$obj.children.length){
                        event.target.$obj.children.forEach(function(child){
                            child.material.emissive.setHex("0x000000")
                            child.material.needsUpdate = true;
                            that.render();
                        })
                    }
                }
            }
            this.addLayerEventListener('custom_event', this.id + '/mousedown', this.customThreeLayerCompMouseDownHandler.bind(this));
            this.addLayerEventListener('custom_event', this.id + '/mouseover', this.customThreeLayerCompMouseOverHandler.bind(this));
            this.addLayerEventListener('custom_event', this.id + '/mouseout', this.customThreeLayerCompMouseOutHandler.bind(this));

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
        this.addChildren(this)
    },
    updated() {
        console.log('updated!!!!!')
        this.render();
    },
    destroyed() {
        this.SceneDestroyed();
        this.CameraDestroyed();
        this.ChildrenDestroyed();

        console.log('destroyed')
        this.core.flow.manager.removeCompNode(this);
    }
}
</script>

<style>
</style>
