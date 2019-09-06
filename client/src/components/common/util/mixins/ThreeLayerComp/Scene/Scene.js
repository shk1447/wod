import * as THREE from 'three'
const Scene = {
    data(){
        return {
            Scene : {
                container : null,
                scene : null,
                renderer : null,
                controls : null,
                gridHelper : null,
                axesHelper : null
            }
        }
    },
    methods : {
        initializeScene(container){
            this.Scene.container = container;
            this.Scene.scene = new THREE.Scene();
            this.Scene.renderer = new THREE.WebGLRenderer( { antialias : true, alpha : true});
            this.Scene.renderer.domElement.style.position = "absolute";
            this.Scene.renderer.domElement.style.top = "0px";
            this.Scene.renderer.domElement.style.left = "0px";
            this.Scene.renderer.domElement.style.zIndex = "0";
            this.Scene.renderer.setSize( this.Scene.container.clientWidth, this.Scene.container.clientHeight );
            this.Scene.container.appendChild( this.Scene.renderer.domElement );

            var light = new THREE.DirectionalLight( 0xffffff );
            light.position.set( 1, 1, 1 );
            this.Scene.scene.add( light );
            var light = new THREE.DirectionalLight( 0x888888 );
            light.position.set( - 1, - 1, - 1 );
            this.Scene.scene.add( light );
            var light = new THREE.AmbientLight( 0x222222 );
            this.Scene.scene.add( light );
        },
        initializeGridHelper(size, divisions, color = 0x000000){
            this.Scene.gridHelper = new THREE.GridHelper(size, divisions, color);
            this.Scene.scene.add(this.Scene.gridHelper)
        },
        initializeAxesHelperHelper(length){
            this.Scene.axesHelper = new THREE.AxesHelper(length);
            this.Scene.scene.add(this.Scene.axesHelper);
        },
        destroyScene(){
            this.Scene.container = undefined;
            this.Scene.Scene = undefined;
            this.Scene.renderer = undefined;
        },
        addToScene(obj){
            this.Scene.scene.add(obj)
        }
    }
};
export default Scene;
