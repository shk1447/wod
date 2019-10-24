<script>
    import {PerspectiveCamera} from 'three'
    export default {
        name: "PerspectiveCamera",
        inject : ['global'],
        props : {
          camera_props : {
              type : Object,
              default : {
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
          }
        },
        created(){
            this.global.perspectiveCamera = new PerspectiveCamera(
                this.camera_props.fov,
                this.camera_props.aspect,
                this.camera_props.near,
                this.camera_props.far
            );
            this.global.perspectiveCamera.position.set(
                this.camera_props.position.x,
                this.camera_props.position.y,
                this.camera_props.position.z
            );
            this.global.activeCamera = this.global.perspectiveCamera;
            console.log('perspective camera mounted')
        }
    }
</script>

