<template>
    <div style="position : absolute; top : 0px; left : 0px; z-index : 1">
        <i class="fas fa-search-minus" style="font-size : 50px; cursor:pointer" @mousedown="zoomOut" @mouseup="mouseUpEventHandler"></i>
        <i class="fas fa-search-plus" style="font-size : 50px; cursor:pointer" @mousedown="zoomIn" @mouseup="mouseUpEventHandler"></i>
        <i class="fas fa-thumbs-down" style="font-size : 50px; cursor:pointer" @mousedown="topView" @mouseup="mouseUpEventHandler"></i>
        <i class="fas fa-thumbs-up" style="font-size : 50px; cursor:pointer" @mousedown="quarterView" @mouseup="mouseUpEventHandler"></i>
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
            topView(event){
                this.$emit('topView')

            },
            quarterView(event){
                this.$emit('quarterView')

            },
            mouseUpEventHandler(){
                this.isClicked = false;
                clearTimeout(this.timeoutID)
            },
            mouseDownHandler(param){
                if(this.isClicked){
                    this.$emit(param)
                    var that = this;
                    this.timeoutID = setTimeout(function(){
                        that.mouseDownHandler(param);
                    }, 50)
                }
            }

        }
    }
</script>

<style scoped>

</style>
