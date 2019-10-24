<script>
    import OrbitControl from '../../util/OrbitControl/OrbitControl'
    export default {
        name: "OrbitControls",
        inject : ['global'],
        created(){
            console.log("############### OrbitControl ################");
            this.global.controls = new OrbitControl(this.global.activeCamera, this.global.webGLRenderer.domElement);
            this.global.controls.enableDamping = false;
            this.global.controls.dampingFactor = 0.25;
            this.global.controls.screenSpacePanning = false;
            this.global.controls.minDistance = 0;
            this.global.controls.maxDistance = 100000;
            this.global.controls.maxPolarAngle = Math.PI / 2;

            var that = this;
            this.global.controls.addEventListener( 'change', function(){
                console.log("mouse move");
                that.global.webGLRenderer.render(that.global.scene, that.global.activeCamera);
            });
        }
    }
</script>

<style scoped>

</style>
