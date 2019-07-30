<template>
    <div>
        <i class="fas fa-search-minus" style="font-size : 50px; float : right; cursor:pointer"@ @click="zoomOut" ></i>
        <i class="fas fa-search-plus" style="font-size : 50px; float : right; cursor:pointer" @click="zoomIn" ></i>
    </div>
</template>

<script>
    export default {
        name: "CameraControlPanel",
        data () {
            return {}
        },
        created(){
        },
        methods : {
            zoomIn(){
                this.$emit("zoomIn");
            },
            zoomOut(){
                this.$emit("zoomOut");
            }
        }
    }
</script>

<style scoped>

</style>
