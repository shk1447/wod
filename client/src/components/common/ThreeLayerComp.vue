<template>
    <div ref="three_container" :style="props.style">

    </div>
</template>

<script>
import _ from 'lodash';
import { setTimeout } from 'timers';

export default {
    name:'three-layer-comp',
    type:'two_comp',
    props: ['props'],
    data () {
        return { }
    },
    methods: {
        animate() {
            this._requestAnimationID = requestAnimationFrame( this.animate );

            this.controls.update();

            this.render();
        },
        render() {
            this.renderer.render( this.scene, this.camera );
        },
        init() {
            var me = this;

            this.container = this.$refs.three_container;
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color( 0xcccccc );
            this.scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
            this.renderer = new THREE.WebGLRenderer( { antialias: true } );
            this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
            this.container.appendChild( this.renderer.domElement );
            this.camera = new THREE.PerspectiveCamera( 60, this.container.clientWidth / this.container.clientHeight, 1, 1000 );
            this.camera.position.set( 400, 200, 0 );
            // controls
            this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
            //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
            this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
            this.controls.dampingFactor = 0.25;
            this.controls.screenSpacePanning = false;
            this.controls.minDistance = 0;
            this.controls.maxDistance = 500;
            this.controls.maxPolarAngle = Math.PI / 2;

            var manager = new THREE.LoadingManager(this.loadedModel);
            this.textureLoader = new THREE.TextureLoader(manager);
            this.objLoader = new THREE.OBJLoader(manager);

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
                _.each(this.props.children, function(comp, i) {
                    var component = new me.three_component[comp.compName]();
                    component.created();

                    component.props = _.extend(component.props, comp.props);
                    component.updated();

                    component.$texture = me.textureLoader.load(component.props.path.texture);
                    me.objLoader.load(component.props.path.obj, function(obj) {
                        component.$obj = obj;
                        component.$obj.traverse(function(child) {
                            if(child.isMesh) child.material.map = component.$texture;
                        })
                        me.components.push(component);
                        me.scene.add(component.$obj);
                        console.log(component.props.style);
                        component.mounted();
                    },function(xhr) {
                        if ( xhr.lengthComputable ) {
                            var percentComplete = xhr.loaded / xhr.total * 100;
                            console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
                        }
                    }, function(err) {
                        console.log(err);
                    })
                })
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
        window.test = this.components;
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
    },
    updated() {
        //this.animate();
    },
    destroyed() {
        this.container = undefined;
        this.camera = undefined;
        this.controls = undefined;
        this.scene = undefined;
        this.renderer = undefined;

        this.components = [];

        cancelAnimationFrame(this._requestAnimationID);
        console.log('destroyed')
    }
}
</script>

<style>
</style>
