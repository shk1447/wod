<template>
    <div>
        <i class="fas fa-search-minus" style="font-size : 50px; float : right; cursor:pointer" @mousedown="zoomOut" @mouseup="mouseUpEventHandler"></i>
        <i class="fas fa-search-plus" style="font-size : 50px; float : right; cursor:pointer" @mousedown="zoomIn" @mouseup="mouseUpEventHandler"></i>
    </div>
</template>

<script>
    export default {
        name: "CameraControlPanel",
        data () {
            return {}
        },
        created(){
            this.isClicked = false;
        },
        methods : {
            zoomIn(event){
                console.log(event);
                if(event.which === 1){
                    this.isClicked = true;
                    this.mouseDownHandler('zoomIn')
                }
            },
            zoomOut(event){
                if(event.which === 1){
                    this.isClicked = true;
                    this.mouseDownHandler('zoomOut')
                }
            },
            mouseUpEventHandler(){
                this.isClicked = false;
            },
            mouseDownHandler(param){
                if(this.isClicked){
                    this.$emit(param)
                    var that = this;
                    setTimeout(function(){
                        that.mouseDownHandler(param);
                    }, 50)
                }
            }

        }
    }
</script>

<style scoped>

</style>
