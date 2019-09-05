import * as THREE from 'three'
const Camera = {
    data(){
        return {
            camera : null
        }
    },
    methods : {
        getCamera(){
            return this.camera;
        },
        initializeCamera(camera_property){
            this.camera = new THREE.PerspectiveCamera(
                parseFloat(camera_property.fov),
                parseFloat(camera_property.aspect),
                parseFloat(camera_property.near),
                parseFloat(camera_property.far)
            );
            this.camera.position.set(
                parseFloat(camera_property.position.x),
                parseFloat(camera_property.position.y),
                parseFloat(camera_property.position.z));
        },
        setCameraPropsWatch(layerComp, watchPropPathString){
            layerComp.$watch(watchPropPathString, function(d){
                this.cameraPropertyChange(d);
                layerComp.render();
            }, {deep : true})

        },
        sceneResizeCameraUpdate(container, renderer){
            this.camera.aspect = container.clientWidth / container.clientHeight;
            renderer.setSize(container.clientWidth, container.clientHeight);
            this.camera.updateProjectionMatrix();
        },
        cameraPropertyChange(camera_property){
            this.camera.position.set(
                parseFloat(camera_property.position.x),
                parseFloat(camera_property.position.y),
                parseFloat(camera_property.position.z)
            );
            this.camera.near = parseFloat(camera_property.near);
            this.camera.far = parseFloat(camera_property.far);
            this.camera.fov = parseFloat(camera_property.fov);
            this.camera.updateProjectionMatrix();
        },
        CameraDestroyed(){
            this.camera = null;
        }
    }
}
export default Camera;
