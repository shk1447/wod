<template>
    <div ref="three_container" :style="meta.props.style" @dragover="dragover" @drop="drop">
        <CameraControlPanel
                @zoomIn="zoomIn"
                @zoomOut = "zoomOut"
        ></CameraControlPanel>
    </div>
</template>

<script>
import _ from 'lodash';
import * as THREE from 'three'
import {MTLLoader, OBJLoader} from "three-obj-mtl-loader";
import OrbitControl from './util/OrbitControl/OrbitControl';
import CameraControlPanel from './util/CameraControlPanel/CameraControlPanel'
import ThreeLayerEvent from './util/ThreeLayerEvent/ThreeLayerEvent'

export default {
    compName:'three-layer-comp',
    category:'Layer',
    type:'two_comp',
    mixins : [ThreeLayerEvent],
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
        render() {
            // //##### Camera Position Property change #####
            // this.camera.position.set(
            //     parseFloat(this.meta.props.style.camera.position.x),
            //     parseFloat(this.meta.props.style.camera.position.y),
            //     parseFloat(this.meta.props.style.camera.position.z)
            // );
            // this.camera.updateMatrixWorld();
            // this.camera.near = parseFloat(this.meta.props.style.camera.near);
            // this.camera.far = parseFloat(this.meta.props.style.camera.far);
            // this.camera.fov = parseFloat(this.meta.props.style.camera.fov);
            // this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
            this.camera.updateProjectionMatrix();
            //##### Camera Position Property change #####

            //#### RE- RENDER ####
            this.renderer.render(this.scene, this.camera);
            //#### RE- RENDER ####
        },
        init() {
            var me = this;
            this.mouseoverComponent = null;
            this.container = this.$refs.three_container;
            this.scene = new THREE.Scene();
            this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
            this.renderer.domElement.style.position = "absolute";
            this.renderer.domElement.style.top = "0px";
            this.renderer.domElement.style.left = "0px";
            this.renderer.domElement.style.zIndex = "0";
            this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
            this.container.appendChild( this.renderer.domElement );

            console.log('############### META ####################')
            console.log(this.meta);
            this.camera = new THREE.PerspectiveCamera( this.meta.props.setter.camera.fov, this.meta.props.setter.camera.aspect, this.meta.props.setter.camera.near, this.meta.props.setter.camera.far);
            this.camera.position.set(this.meta.props.setter.camera.position.x, this.meta.props.setter.camera.position.y, this.meta.props.setter.camera.position.z);

            // controls
            this.controls = new OrbitControl( this.camera, this.renderer.domElement );
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.25;
            this.controls.screenSpacePanning = false;
            this.controls.minDistance = 0;
            this.controls.maxDistance = 100000;
            this.controls.maxPolarAngle = Math.PI / 2;
            this.controls.addEventListener( 'change', function(){
                me.$forceUpdate();
            });

            var manager = new THREE.LoadingManager(this.loadedModel);
            manager.onProgress = function(item, loaded, total) {
                console.log(item, loaded, total);
            };

            // lights
            var light = new THREE.DirectionalLight( 0xffffff );
            light.position.set( 1, 1, 1 );
            this.scene.add( light );
            var light = new THREE.DirectionalLight( 0x888888 );
            light.position.set( - 1, - 1, - 1 );
            this.scene.add( light );
            var light = new THREE.AmbientLight( 0x222222 );
            this.scene.add( light );

            //############### GRID HELPER ########################
            var size = 10;
            var divisions = 100;
            var gridHelper = new THREE.GridHelper(size, divisions, 0x000000);
            this.scene.add(gridHelper);
            //############### CUSTOM EVENT DEFNITIONS #####################
            this.threeLayerCompEvents = {
                "click" : this.id + "/click",
                "mouseover" : this.id + "/mouseover",
                "dblclick" : this.id + "/dblclick",
                "mouseout" : this.id + "/mouseout",
                "mousedown" : this.id + "/mousedown",
                "mouseup" : this.id + "/mouseup"
            };
            Object.freeze(this.threeLayerCompEvents);


            //################# CUSTOM EVENT ADD ####################################
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
            //################# CUSTOM EVENT ADD ####################################

            me.$forceUpdate();
        },
        loadedModel() {
            console.log('loaded model');
        },
        addChildren() {
            var me = this;
            if(this.props.children && this.props.children.length > 0) {
                _.each(this.props.children, function(comp, i) {
                    var mtlLoader = new MTLLoader();
                    var objLoader = new OBJLoader();

                    var component = new me.three_comp[comp.compName].component();
                    //############################## APPLY MIXIN ##########################################
                    me.three_comp[comp.compName].mixins.forEach((mix)=>{
                        //data mixin
                        var data = mix.data();
                        var data_key = Object.keys(data);
                        data_key.forEach((key)=>{
                            if(!component.hasOwnProperty(key)){
                                var temp = {};
                                temp[key] = data[key];
                                _.merge(component, temp)
                            }
                        });
                        //method mixin
                        var methods = mix.methods;
                        var method_keys = Object.keys(methods);
                        console.log(method_keys);
                        method_keys.forEach((method)=>{
                            if(!component.hasOwnProperty(method)){
                                var temp = {};
                                temp[method] = methods[method];
                                _.merge(component, temp)
                            }
                        });

                    });
                    //############################## APPLY MIXIN ##########################################
                    component.created();


                    component.props = _.extend(component.props, comp.props);

                    component.id = comp.id; //manager.js에서 add, remove할 때 id를 갖고 하기 때문에 3d component에 id를 부여
                    component.page_id = comp.page_id;
                    component.$parent = me; //input_data 함수가 실행되면 렌더를 한번 다시 해줘야 화면이 바뀌기 때문에 자신의 parent를 갖고 있도록 한다.
                    component.updated();

                    mtlLoader.load(component.props.path.material, (materials)=>{
                        materials.preload();
                        objLoader.setMaterials(materials);
                        objLoader.load(component.props.path.obj,(object)=>{
                            component.$obj = object;
                            if(component.$obj.children.length){
                                component.$obj.children.forEach(function(child){
                                    child.compId = component.id
                                })
                            }else{
                                component.$obj.compId = component.id;
                            }
                            me.components.push(component);
                            me.appendElement.add(component.$obj);

                            var outline = component.createOutlineElement(component);
                            me.appendElement.add(outline);


                            var that = me;
                            me.addLayerEventListener('layer_mouse_event', 'mousedown',function(event){
                                console.log(event);
                                if(event.origDomEvent.button === 0)
                                    that.custom_events.emit(that.id + '/mousedown', {target : component});
                            }, component.$obj);

                            me.addLayerEventListener('layer_mouse_event', 'click',function(event){
                                if(event.origDomEvent.button === 0)
                                    that.custom_events.emit(that.id + '/click', {target : component});
                            }, component.$obj);

                            if(component.$obj.children.length){
                                component.$obj.children.forEach(function(child){
                                    var that2 = me;
                                    me.addLayerEventListener('layer_mouse_event', 'mouseover',function(event){
                                        if(event.origDomEvent.button === 0)
                                            that.custom_events.emit(that2.id + '/mouseover', {target : component});
                                    }, child);
                                    me.addLayerEventListener('layer_mouse_event', 'mouseout',function(event){
                                        if(event.intersect === undefined){
                                            that2.custom_events.emit(that2.id + '/mouseout', {target : component});
                                            that2.mouseoverComponent = null;
                                        }else{
                                            if(event.target.compId === that2.mouseoverComponent)
                                                return;
                                            else{
                                                that2.custom_events.emit(that2.id + '/mouseout', {target : component});                                            }
                                        }
                                    }, child);
                                })
                            }
                            component.mounted();
                            console.log(component);

                            //render once
                            me.renderer.render( me.scene, me.camera );

                            console.log("############### CACHE #########################")
                            console.log(THREE.Cache);

                            console.log('################# SCENE ###########################')
                            console.log(me.scene.appendElement);
                        })
                    })
                })
            }
        }
    },
    components : {CameraControlPanel},
    created() {
        console.log('three created props' , this.meta.props);
        this.container = undefined;
        this.camera = undefined;
        this.controls = undefined;
        this.scene = undefined;
        this.renderer = undefined;

        this.textureLoader = undefined;
        this.objLoader = undefined;

        this.components = [];

        console.log(this.three_comp);
        console.log('created')
    },
    mounted() {
        console.log(this.components);
        console.log('three layer mounted')
        this.core.flow.manager.addCompNode(this);
        this.init();
    },
    updated() {
        console.log('updated!!!!!')
        this.render();
    },
    destroyed() {
        this.container = undefined;
        this.camera = undefined;

        this.controls.removeEventListener('change');
        this.controls = undefined;

        this.scene = undefined;
        this.renderer = undefined;
        this.components = [];
        console.log('destroyed')
        this.core.flow.manager.removeCompNode(this);
    }
}
</script>

<style>
</style>
