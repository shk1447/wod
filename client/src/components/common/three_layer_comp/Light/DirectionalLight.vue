<script>
    import {DirectionalLight} from 'three'
    export default {
        name: "DirectionalLight",
        inject : ['global'],
        props : ['position', 'color', 'name'],
        created(){
            console.log("############### DirectionalLight ################");

            if(this.global.lights === undefined){
                this.global.lights = {}
            }
            this.global.lights[this.name] = new DirectionalLight(this.color)
            this.global.lights[this.name].position.set(this.position.x, this.position.y, this.position.z);
            this.global.scene.add(this.global.lights[this.name])
        }

    }
</script>

<style scoped>

</style>
