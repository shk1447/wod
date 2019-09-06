import * as THREE from 'three'
import OrbitControl from '../../../OrbitControl/OrbitControl'
const Camera = {
    data(){
        return {
            Camera : {
                activeCamera : null,
                perspectiveCamera : null,
                orthographicCamera : null,
                controls : null,
                activeCameraType : null
            }
        }
    },
    methods : {
        initializePerspectiveCamera(camera_property){
            this.Camera.perspectiveCamera = new THREE.PerspectiveCamera(
                parseFloat(camera_property.fov),
                parseFloat(camera_property.aspect),
                parseFloat(camera_property.near),
                parseFloat(camera_property.far)
            );
            this.Camera.perspectiveCamera.position.set(
                parseFloat(camera_property.position.x),
                parseFloat(camera_property.position.y),
                parseFloat(camera_property.position.z));
            this.Camera.activeCamera = this.Camera.perspectiveCamera;
            this.Camera.activeCameraType = 'perspective'
        },
        initializeOrthographicCamera(left, right, top, bottom, camera_property){
            this.Camera.orthographicCamera = new THREE.OrthographicCamera(
                left, right, top, bottom, parseFloat(camera_property.near), parseFloat(camera_property.far)
            )
            this.Camera.orthographicCamera.position.set(
                parseFloat(camera_property.position.x),
                parseFloat(camera_property.position.y),
                parseFloat(camera_property.position.z));
        },
        setActiveCamera(type){
            this.Camera.activeCameraType = type
            if(type === 'perspective'){
                  this.Camera.activeCamera = this.Camera.perspectiveCamera;
              }else if(type === 'orthographic'){
                  this.Camera.activeCamera = this.Camera.orthographicCamera;
              }
              this.Camera.controls.object = this.Camera.activeCamera;
        },
        initializeControl(renderer){
            this.Camera.controls = new OrbitControl( this.Camera.activeCamera, renderer.domElement );
            this.Camera.controls.enableDamping = false;
            this.Camera.controls.dampingFactor = 0.25;
            this.Camera.controls.screenSpacePanning = false;
            this.Camera.controls.minDistance = 0;
            this.Camera.controls.maxDistance = 100000;
            this.Camera.controls.maxPolarAngle = Math.PI / 2;
        },
        updateCameraByPropertyPanel(container, renderer, camera_property){
            this.Camera.activeCamera.position.set(
                parseFloat(camera_property.position.x),
                parseFloat(camera_property.position.y),
                parseFloat(camera_property.position.z)
            );
            this.Camera.activeCamera.near = parseFloat(camera_property.near);
            this.Camera.activeCamera.far = parseFloat(camera_property.far);
            this.Camera.activeCamera.fov = parseFloat(camera_property.fov);
            this.Camera.activeCamera.updateMatrix();
            this.Camera.controls.update();
        },
        destroyCamera(){
            this.Camera.activeCamera = null;
            this.Camera.perspectiveCamera = null;
            this.Camera.orthographicCamera = null;
            this.Camera.controls = null;
            this.Camera.controls.removeEventListener('change');
            this.Camera.controls = undefined;
        },
        moveCamera(lookAt, targetPos){
            console.log(this.Camera.activeCamera);
            this.Camera.activeCamera.position.set(targetPos.x, targetPos.y, targetPos.z);
            this.Camera.controls.setTarget(lookAt);
            this.Camera.activeCamera.updateMatrix();
            this.Camera.controls.update();
        }
    }

};
export default Camera;
