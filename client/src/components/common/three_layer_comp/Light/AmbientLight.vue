<script>
    import {AmbientLight} from 'three'
    export default {
        name: "AmbientLight",
        inject : ['global'],
        props : ['color', 'name'],
        created(){
            console.log("############### AmbientLight ################");
            if(this.global.lights === undefined){
                this.global.lights = {}
            }
            this.global.lights[this.name] = new AmbientLight(this.color);
            this.global.scene.add(this.global.lights[this.name])
        },
        mounted(){
        }
    }
</script>

<style scoped>

</style>
