<script>
    import * as THREE from 'three'
    import domEvents from 'threex-domevents'
    export default {
        name: "ThreeEvent",
        inject : ['global'],
        data(){
            return {

            }
        },
        created(){
            this.global.THREEx = {};
            domEvents(THREE, this.global.THREEx);
            this.global.domEvents = new this.global.THREEx.DomEvents(this.global.activeCamera, this.global.webGLRenderer.domElement);
            this.global.test = function(string){
                console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC")
            };
            console.log('############### donEvents ##############')
            console.log(this.global);
            console.log(this.global.domEvents)
        }
    }
</script>

<style scoped>

</style>
