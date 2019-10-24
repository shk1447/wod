<script>
    import {OrthographicCamera} from 'three'
    export default {
        name: "OrthographicCamera",
        inject : ['global'],
        props : {
          camera_props : {
              type : Object,
          }
        },
        mounted(){
            this.global.orthographicCamera = new OrthographicCamera(
                this.global.webGLRenderer.domElement.clientWidth / -2,
                this.global.webGLRenderer.domElement.clientWidth / 2,
                this.global.webGLRenderer.domElement.clientHeight / 2,
                this.global.webGLRenderer.domElement.clientHeight / -2,
                this.camera_props.near,
                this.camera_props.far
            )
            this.global.orthographicCamera.position.set(
                parseFloat(this.camera_props.position.x),
                parseFloat(this.camera_props.position.y),
                parseFloat(this.camera_props.position.z));
        }
    }
</script>

<style scoped>

</style>
