<template>
    <div ref="three_container" :style="props.style" v-on:click="layerCompMouseDown">
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
    name:'three-layer-comp',
    type:'two_comp',
    props: ['props', 'id', 'input', 'output', 'page_id'],
    fields:{
        setter:[],
        style:[]
    },
    mixins : [ThreeLayerEvent],
    data () {
        return {
        }
    },
    methods: {
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
            this.mousedownComponent = null;
            this.mouse = new THREE.Vector2();
            this.raycaster = new THREE.Raycaster();
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


            this.camera = new THREE.PerspectiveCamera( this.props.setter.camera.fov, this.props.setter.camera.aspect, this.props.setter.camera.near, this.props.setter.camera.far);
            this.camera.position.set(this.props.setter.camera.position.x, this.props.setter.camera.position.y, this.props.setter.camera.position.z);

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

            console.log("####################### THIS ##########################")
            console.log(this);



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
                if(this.mousedownComponent !== null)
                    this.mousedownComponent.outlineElement.visible = false;
                console.log(event.target);
                event.target.outlineElement.visible = true;
                this.mousedownComponent = event.target;
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
        },
        layerCompMouseDown(event){
            console.log(event);
            this.mouse.x = (event.offsetX / event.target.width) * 2 - 1;
            this.mouse.y = (event.offsetY / event.target.height) * 2 - 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            var intersects = this.raycaster.intersectObjects(this.scene.children, true);
            console.log(intersects);
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
                            me.scene.add(component.$obj);

                            var outline = component.createOutlineElement(component);
                            me.scene.add(outline);


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
        console.log('three created props' , this.props);
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
