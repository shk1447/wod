<template>

</template>
<script>
    export default {
        name: "ObjectContainer",
        inject : ['global'],
        props : ['objects'],
        created(){
            this.global.object_props = {};

        }
    }
</script>

<style scoped>

</style>
