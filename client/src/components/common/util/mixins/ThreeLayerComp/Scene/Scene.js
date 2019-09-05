import * as THREE from 'three'
import OrbitControl from '../../../OrbitControl/OrbitControl';
const Scene = {
    data(){
        return {
            container : null,
            scene : null,
            renderer : null,
            controls : null,
            gridHelper : null
        }
    },
    methods : {
        getContainer(){
            return this.container;
        },
        getScene(){
            return this.scene;
        },
        getRenderer(){
            return this.renderer
        },
        getControls(){
            return this.controls
        },
        initializeScene(layerComp){
            this.container = layerComp.$refs.three_container;
            this.scene = new THREE.Scene();
            this.renderer = new THREE.WebGLRenderer( { antialias : true, alpha : true});
            this.renderer.domElement.style.position = "absolute";
            this.renderer.domElement.style.top = "0px";
            this.renderer.domElement.style.left = "0px";
            this.renderer.domElement.style.zIndex = "0";
            this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
            this.container.appendChild( this.renderer.domElement );

            var light = new THREE.DirectionalLight( 0xffffff );
            light.position.set( 1, 1, 1 );
            this.scene.add( light );
            var light = new THREE.DirectionalLight( 0x888888 );
            light.position.set( - 1, - 1, - 1 );
            this.scene.add( light );
            var light = new THREE.AmbientLight( 0x222222 );
            this.scene.add( light );

        },
        initializeControl(layerComp, camera){
            this.controls = new OrbitControl( camera, this.renderer.domElement );
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.25;
            this.controls.screenSpacePanning = false;
            this.controls.minDistance = 0;
            this.controls.maxDistance = 100000;
            this.controls.maxPolarAngle = Math.PI / 2;
            this.controls.addEventListener( 'change', function(){
                layerComp.render();
            });
        },
        initializeHelper(size, divisions, color = 0x000000){
            this.gridHelper = new THREE.GridHelper(size, divisions, color);
            this.scene.add(this.gridHelper)
        },
        SceneDestroyed(){
            this.container = undefined;
            this.Scene = undefined;
            this.controls.removeEventListener('change');
            this.controls = undefined;
            this.renderer = undefined;
        },
        addScene(threeObj){
            this.scene.add(threeObj);
        }
    }
};

export default Scene;
