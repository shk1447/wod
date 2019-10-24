<template>
    <div ref="three_container" :style="layer_meta.props.style"  @dragover="dragover" @drop="drop" @mousedown="layerMouseDown">
        <div style="position : absolute; top : 0px; left : 0px; z-index : 1">
            <CameraControlPanel
                @zoomIn="zoomIn"
                @zoomOut = "zoomOut"
                @moveLeft = "moveLeft"
                @moveRight = "moveRight"
                @moveUp = "moveUp"
                @moveDown = "moveDown"
                @topView = "topView"
                @quarterView = "quarterView"
            ></CameraControlPanel>
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import {WebGLRenderer, Vector3, Vector2, Raycaster} from 'three'
    import CameraControlPanel from '../CameraControlPanel/CameraControlPanel'
    import uuid from 'uuid/v4';

    export default {
        name: "Renderer",
        components: {CameraControlPanel},
        category : 'container',
        props : ['renderer_props', 'layer_meta'],
        provide() {
            return {
                global : this.global
            }
        },
        data(){
            return {
                global : {}
            }
        },
        created(){
            console.log("############### WebGLRenderer ################");
            this._object = new WebGLRenderer(this.renderer_props);
            this._object.domElement.style.position = "absolute";
            this._object.domElement.style.top = "0px";
            this._object.domElement.style.left = "0px";
            this._object.domElement.style.zIndex = "0";
            this.global.webGLRenderer = this._object;
        },
        mounted(){
            this.$nextTick(()=>{

                this._object.setSize( this.$refs.three_container.clientWidth, this.$refs.three_container.clientHeight);
                this.$el.appendChild( this._object.domElement );

                console.log('renderer mounted')
                console.log(this.global);
                this.global.webGLRenderer.render(this.global.scene, this.global.activeCamera);
                this.$forceUpdate();
            })
        },
        updated(){
            console.log("##################### THREE LAYER COMP PROPS UPDATE ###############################")
            this.global.activeCamera.aspect = this.$refs.three_container.clientWidth / this.$refs.three_container.clientHeight;
            this.global.webGLRenderer.setSize(this.$refs.three_container.clientWidth, this.$refs.three_container.clientHeight);
            this.global.webGLRenderer.render(this.global.scene, this.global.activeCamera);
        },
        methods : {
            dragover(e) {
                e.preventDefault();
            },
            drop(e) {
                e.preventDefault();
                var transfer_data = e.dataTransfer.getData("component");
                if(transfer_data) {
                    var data = JSON.parse(transfer_data);
                    if(data.type === 'three_comp') {
                        e.stopImmediatePropagation();
                        console.log('drop comp', data);
                        console.log(this.global);
                        // this.addChild(data)
                        var instance = {
                            id:uuid(),
                            page_id:this.layer_meta.page_id,
                            compName:data.compName,
                            type:data.type,
                            input:data.input,
                            output:data.output,
                            props:data.init_props
                        }
                        if(!this.layer_meta.props.children) {
                            console.log('!!!!!why!!!?')
                            this.layer_meta.props.children = [];
                        }
                        this.layer_meta.props.children.push(instance);
                        this.$parent.$forceUpdate();
                    }
                }
            },
            topView(){
                this.global.activeCamera = this.global.orthographicCamera;

                this.global.activeCamera.left = this.global.webGLRenderer.domElement.clientWidth / -2;
                this.global.activeCamera.right = this.global.webGLRenderer.domElement.clientWidth / 2;
                this.global.activeCamera.top = this.global.webGLRenderer.domElement.clientHeight / 2;
                this.global.activeCamera.bottom = this.global.webGLRenderer.domElement.clientHeight / -2;
                this.global.activeCamera.updateProjectionMatrix();

                this.global.domEvents._camera = this.global.activeCamera;
                this.global.activeCamera.position.set(0, 500, 0);
                this.global.controls.object = this.global.activeCamera;
                this.global.controls.enabled = true;
                this.global.controls.setTarget(new Vector3());
                this.global.activeCamera.updateMatrix();
                this.global.controls.update();
                this.global.webGLRenderer.render(this.global.scene, this.global.activeCamera);
            },
            quarterView(){
                this.global.activeCamera = this.global.perspectiveCamera;
                this.global.activeCamera.position.set(500, 500, 500);
                this.global.controls.enabled = true;
                this.global.controls.object = this.global.activeCamera;
                this.global.controls.setTarget(new Vector3());
                this.global.activeCamera.updateMatrix();
                this.global.controls.update();
                this.global.webGLRenderer.render(this.global.scene, this.global.activeCamera);
                this.global.domEvents._camera = this.global.activeCamera;
            },
            zoomIn(){
                this.global.controls.zoomIn();
            },
            zoomOut(){
                this.global.controls.zoomOut();
            },
            moveLeft(){
                this.global.controls.panning('left')
            },
            moveRight(){
                this.global.controls.panning('right')
            },
            moveUp(){
                this.global.controls.panning('up')
            },
            moveDown(){
                this.global.controls.panning('down')
            },
            layerMouseDown(event){
                event.stopImmediatePropagation();
                console.log(event);
                var mouse = new Vector2();
                mouse.x = (event.offsetX / this.$refs.three_container.clientWidth) * 2 - 1;
                mouse.y = -(event.offsetY / this.$refs.three_container.clientHeight) * 2 + 1;
                var raycaster = new Raycaster();

                raycaster.setFromCamera(mouse, this.global.activeCamera);
                var intersects = raycaster.intersectObjects(this.global.mainContainer.children, true);
                if(intersects.length > 0){
                    console.log("######################## LAYER MOUSE DOWN ###########################")
                    // console.log(intersects);
                    // console.log(this);
                    console.log(this.core.flow.manager.getCompByKey(this.layer_meta.page_id+'/'+intersects[0].object.userData.id))
                    console.log(this)
                    var that = this;
                    this.layer_meta.props.children.forEach((child)=>{
                        var comp = that.core.flow.manager.getCompByKey(child.page_id+'/'+child.id)
                        if(child.id === intersects[0].object.userData.id){
                            comp.outlineElement.visible = true;
                        }else{
                            comp.outlineElement.visible = false;
                        }
                    })
                    this.global.webGLRenderer.render(this.global.scene, this.global.activeCamera);
                }else{
                    var that = this;
                    this.layer_meta.props.children.forEach((child)=>{
                        var comp = that.core.flow.manager.getCompByKey(child.page_id+'/'+child.id);
                        comp.outlineElement.visible = false;
                    });
                    this.global.webGLRenderer.render(this.global.scene, this.global.activeCamera);
                }

            }
        }
    }
</script>

<style scoped>

</style>
