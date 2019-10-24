<template>
    <div><slot></slot></div>
</template>
<script>
    import {Scene, Object3D} from 'three'
    import {MeshBasicMaterial, BoxGeometry, Mesh} from 'three'
    export default {
        name: "Scene",
        inject : ['global'],
        created(){
            console.log("############### SCENE ################");
            this.global.scene = new Scene();
            this.global.mainContainer = new Object3D();
            this.global.scene.add(this.global.mainContainer);
            console.log('three scene mounted')
            // var mesh = new Mesh(new BoxGeometry(100, 100, 100), new MeshBasicMaterial({color : 0x00ff00}));
            // mesh.position.set(0, 0, 0);
            // this.global.mainContainer.add(mesh)
        },
        mounted(){
        },
        updated(){
        }
    }
</script>

<style scoped>

</style>
