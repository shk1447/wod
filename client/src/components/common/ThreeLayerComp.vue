<template>
    <div ref="three_container" :style="props.style">

    </div>
</template>

<script>
import _ from 'lodash';
import { setTimeout } from 'timers';
import * as THREE from 'three'
import {MTLLoader, OBJLoader} from "three-obj-mtl-loader";
import * as OrbitControls from 'three-orbitcontrols'
import ThreeLayerControl from './util/ThreeLayerControl.js';

export default {
    name:'three-layer-comp',
    type:'two_comp',
    props: ['props'],
    data () {
        return {
            control:false,
            event: {
                x:0,
                y:0
            }
        }
    },
    methods: {
        onStartCamera(e) {
            this.control = true;
            console.log('start camera', e)
            this.event.x = e.offsetX;
            this.event.y = e.offsetY;
        },
        onStopCamera(e) {
            this.control = false;
            this.event.x = 0;
            this.event.y = 0;
            console.log('stop camera', e)
        },
        onControlCamera(e) {
            if(this.control) {
                console.log('control camera', e)
                this.props.position.x = this.event.x - e.offsetX;
                this.props.position.y = this.event.y - e.offsetY;
                this.$forceUpdate();
            }
        },
        animate() {
            this._requestAnimationID = requestAnimationFrame( this.animate );
            this.controls.update();
            this.render();
        },
        render() {
            // this.camera.position.set( this.position.x, this.position.y, this.position.z );
            this.renderer.render( this.scene, this.camera );
        },
        init() {
            var me = this;
            
            this.container = this.$refs.three_container;
            this.scene = new THREE.Scene();
            //this.scene.background = new THREE.Color( 0x00000 );
            //this.scene.fog = new THREE.FogExp2( 0xcccccc, 0.0008 );
            this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
            this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
            //this.renderer.setClearColor()
            this.container.appendChild( this.renderer.domElement );
            this.camera = new THREE.PerspectiveCamera( 60, this.container.clientWidth / this.container.clientHeight, 1, 10000 );

            this.camera.position.set( me.props.position.x, me.props.position.y, me.props.position.z );
            // this.cameraHelper = new THREE.CameraHelper( this.camera );
            // this.scene.add(this.cameraHelper);
            
            // controls
            this.controls = new OrbitControls( this.camera, this.renderer.domElement );
            // this.controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
            this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
            this.controls.dampingFactor = 0.25;
            this.controls.screenSpacePanning = false;
            this.controls.minDistance = 0;
            this.controls.maxDistance = 100000;
            this.controls.maxPolarAngle = Math.PI / 2;

            var manager = new THREE.LoadingManager(this.loadedModel);
            this.textureLoader = new THREE.TextureLoader(manager);
            // this.objLoader = new THREE.OBJLoader(manager);

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

            //프레임 stop, start 테스트 toggle 값
            this.toggleFrameStop = true;
        },
        loadedModel() {
            console.log('loaded model');
        },
        addChildren() {
            var me = this;
            if(this.props.children && this.props.children.length > 0) {
                var mtlLoader = new MTLLoader();
                var objLoader = new OBJLoader();

                _.each(this.props.children, function(comp, i) {
                    var component = new me.three_component[comp.compName]();
                    component.created();

                    component.props = _.extend(component.props, comp.props);
                    component.updated();

                    mtlLoader.load(component.props.path.material, (materials)=>{
                        materials.preload();
                        objLoader.setMaterials(materials);
                        objLoader.load(component.props.path.obj,(object)=>{
                            component.$obj = object;
                            me.components.push(component);
                            me.scene.add(component.$obj);
                            console.log(component.props.style);
                            component.mounted();
                        })
                    })
                    

                    //component.$texture = me.textureLoader.load(component.props.path.texture);
                    // me.objLoader.load(component.props.path.obj, function(obj) {
                    //     component.$obj = obj;
                    //     component.$obj.traverse(function(child) {
                    //         console.log(child.name);
                    //         if(child.isMesh && child.name) {
                    //             let texture = me.textureLoader.load(component.props.path.texture.replace('{childName}', child.name));
                    //             child.material.map = texture;
                    //         }
                    //     })
                    //     me.components.push(component);
                    //     me.scene.add(component.$obj);
                    //     console.log(component.props.style);
                    //     component.mounted();
                    // },function(xhr) {
                    //     if ( xhr.lengthComputable ) {
                    //         var percentComplete = xhr.loaded / xhr.total * 100;
                    //         console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
                    //     }
                    // }, function(err) {
                    //     console.log(err);
                    // })
                })
            }
        },
        FrameStopAndStart(){
            if(this.toggleFrameStop === false){
                //frame start
                this.animate();
                this.toggleFrameStop = true;
                this.controls.autoRotate = true;
            }else{
                cancelAnimationFrame(this._requestAnimationID);
                this.toggleFrameStop = false;
            }
        }
    },
    components : {

    },
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
        console.log(this.three_component);
        console.log('created')
    },
    mounted() {
        var me = this;
        console.log(this.components);
        console.log('mounted')
        this.init();
        this.animate();
        this.addChildren();
        
        
        //this.animate();
        //this.render();
        // this.controls.autoRotate = true;
    },
    updated() {
        //this.animate();
        console.log('updated!!!!!')
        this.render();
    },
    destroyed() {
        this.container = undefined;
        this.camera = undefined;
        this.controls = undefined;
        this.scene = undefined;
        this.renderer = undefined;

        this.components = [];
        if(this._requestAnimationID)
            cancelAnimationFrame(this._requestAnimationID);

        console.log('destroyed')
    }
}
</script>

<style>
</style>
