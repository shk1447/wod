<script>
    import { GridHelper } from 'three'
    export default {
        name: "LayerGrid",
        inject : ['global'],
        props : ['size', 'divisions'],
        created(){
            this.global.grid = new GridHelper(this.size, this.divisions, 0x000000);
            this.global.scene.add(this.global.grid)
        }
    }
</script>

<style scoped>

</style>
