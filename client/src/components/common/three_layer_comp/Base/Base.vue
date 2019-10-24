<template>
    <div><slot></slot></div>
</template>

<script>
    export default {
        name: "Base",
        data(){
            return {
                object : {type : Object}
            }
        }
    }
</script>

<style scoped>

</style>
