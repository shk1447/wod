<template>
    <div style="position : absolute; top : 0px; left : 0px; z-index : 1">
        <i class="fas fa-search-minus" style="font-size : 50px; cursor:pointer" @mousedown="zoomOut" @mouseup="mouseUpEventHandler"></i>
        <i class="fas fa-search-plus" style="font-size : 50px; cursor:pointer" @mousedown="zoomIn" @mouseup="mouseUpEventHandler"></i>
        <i class="fas fa-thumbs-down" style="font-size : 50px; cursor:pointer" @mousedown="topView" @mouseup="mouseUpEventHandler"></i>
        <i class="fas fa-thumbs-up" style="font-size : 50px; cursor:pointer" @mousedown="quarterView" @mouseup="mouseUpEventHandler"></i>
        <i class="fas fa-chevron-left" style="font-size : 50px; cursor:pointer" @mousedown="moveLeft" @mouseup="mouseUpEventHandler"></i>
        <i class="fas fa-chevron-right" style="font-size : 50px; cursor:pointer" @mousedown="moveRight" @mouseup="mouseUpEventHandler"></i>
        <i class="fas fa-chevron-up" style="font-size : 50px; cursor:pointer" @mousedown="moveUp" @mouseup="mouseUpEventHandler"></i>
        <i class="fas fa-chevron-down" style="font-size : 50px; cursor:pointer" @mousedown="moveDown" @mouseup="mouseUpEventHandler"></i>
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
            moveLeft(event){
                if(event.which === 1){
                    this.isClicked = true;
                    this.mouseDownHandler('moveLeft')
                }
            },
            moveRight(event){
                if(event.which === 1){
                    this.isClicked = true;
                    this.mouseDownHandler('moveRight')
                }
            },
            moveUp(event){
                if(event.which === 1){
                    this.isClicked = true;
                    this.mouseDownHandler('moveUp')
                }
            },
            moveDown(event){
                if(event.which === 1){
                    this.isClicked = true;
                    this.mouseDownHandler('moveDown')
                }
            },
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
