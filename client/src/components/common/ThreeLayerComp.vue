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
import domEvents from 'threex-domevents'
import {MTLLoader, OBJLoader} from "three-obj-mtl-loader";
import OrbitControl from './util/OrbitControl/OrbitControl';
import CameraControlPanel from './util/CameraControlPanel/CameraControlPanel'
export default {
    compName:'three-layer-comp',
    category:'Layer',
    type:'two_comp',
    props: ['meta'],
    init_props: {
        style: {
            position: "absolute",
            overflow: "hidden",
            top:"",
            left:"",
            width:"100%",
            height:"100%",
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
                    x : 400,
                    y : 400,
                    z : 400
                }
            }
        },
        children:[]
    },
    fields:{
        setter:[],
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
        }]]
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
            this.renderer.render(this.scene, this.camera);
        },
        init() {
            var me = this;
            this.mouseoverComponent = null;
            this.container = this.$refs.three_container;
            this.scene = new THREE.Scene();
            this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
            console.log(this.renderer.domElement);
            this.renderer.domElement.style.position = "absolute";
            this.renderer.domElement.style.top = "0px";
            this.renderer.domElement.style.left = "0px";
            this.renderer.domElement.style.zIndex = "0";
            this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
            this.container.appendChild( this.renderer.domElement );


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

            ///add custom events listener
            var THREEx = {};
            domEvents(THREE, THREEx);

            this.domEvents = new THREEx.DomEvents(this.camera, this.renderer.domElement);
            this.threeLayerCompEvents = {
                "click" : this.id + "/click",
                "mouseover" : this.id + "/mouseover",
                "dblclick" : this.id + "/dblclick",
                "mouseout" : this.id + "/mouseout"
            };
            Object.freeze(this.threeLayerCompEvents);

            this.custom_events.on(this.threeLayerCompEvents.click, function(event){
                alert('click component');
            });
            this.custom_events.on(this.threeLayerCompEvents.mouseover, function(event){
                console.log(event.target);
                if(event.target.$obj.children.length){
                    event.target.$obj.children.forEach(function(child){
                        child.material.emissive.setHex("0x64FE2E")
                        child.material.needsUpdate = true;
                        me.render();
                    })
                }
            });
            this.custom_events.on(this.threeLayerCompEvents.mouseout, function(event){
                console.log(event.target);
                if(event.target.$obj.children.length){
                    event.target.$obj.children.forEach(function(child){
                        child.material.emissive.setHex("0x000000")
                        child.material.needsUpdate = true;
                        me.render();
                    })
                }
            });
        },
        loadedModel() {
            console.log('loaded model');
        },
        addChildren() {
            var me = this;
            if(this.meta.props.children && this.meta.props.children.length > 0) {
                _.each(this.meta.props.children, function(comp, i) {
                    var mtlLoader = new MTLLoader();
                    var objLoader = new OBJLoader();
                    var component = new me.three_comp[comp.compName].component();
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
                            me.scene.add(component.$obj);
                            var that = me;

                            me.domEvents.addEventListener(component.$obj, 'click', function(event){
                               that.custom_events.emit(that.id + '/click', {target : component});
                            }, false);

                            if(component.$obj.children.length){
                                component.$obj.children.forEach(function(child){
                                    var that2 = me;
                                    me.domEvents.addEventListener(child, 'mouseover', function(event){
                                        that2.custom_events.emit(that2.id + '/mouseover', {target : component});
                                        that2.mouseoverComponent = component.id;
                                    });
                                    me.domEvents.addEventListener(child, 'mouseout', function(event){
                                        if(event.intersect === undefined){
                                            that2.custom_events.emit(that2.id + '/mouseout', {target : component});
                                            that2.mouseoverComponent = null;
                                        }else{
                                            if(event.target.compId === that2.mouseoverComponent)
                                                return;
                                            else{
                                                that2.custom_events.emit(that2.id + '/mouseout', {target : component});                                            }
                                        }
                                    });
                                })
                            }
                            component.mounted();

                            //render once
                            me.renderer.render( me.scene, me.camera );
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
        this.addChildren();
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
