<template>
    <div ref="three_container" :style="props.style">
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

export default {
    name:'three-layer-comp',
    type:'two_comp',
    props: ['props'],
    data () {
        return {
        }
    },
    methods: {
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

            this.container = this.$refs.three_container;
            this.scene = new THREE.Scene();
            this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
            this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
            this.container.appendChild( this.renderer.domElement );


            this.camera = new THREE.PerspectiveCamera( this.props.camera.fov, this.props.camera.aspect, this.props.camera.near, this.props.camera.far);
            this.camera.position.set(this.props.camera.position.x, this.props.camera.position.y, this.props.camera.position.z);

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
        console.log(this.components);
        console.log('mounted')
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
    }
}
</script>

<style>
</style>
