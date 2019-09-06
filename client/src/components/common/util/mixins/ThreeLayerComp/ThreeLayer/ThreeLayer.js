import Scene from '../Scene/Scene'
import Camera from '../Camera/Camera'
import ThreeLayerEvent from '../ThreeLayerEvent/ThreeLayerEvent'
import Children from '../Children/Children'
import * as THREE from 'three'
import _ from "lodash";
const threeLayer = {
    data(){
        return {}
    },
    mixins : [Scene, Camera, ThreeLayerEvent, Children],
    methods : {
        initializeThreeLayer(){
            var that = this;
            this.initializeScene(this.$refs.three_container);
            this.initializeGridHelper(1000, 100, 0x000000);
            this.initializeAxesHelperHelper(10);
            this.initializePerspectiveCamera(this.meta.props.setter.camera);
            this.initializeOrthographicCamera(
                this.Scene.renderer.domElement.clientWidth / - 2,
                this.Scene.renderer.domElement.clientWidth / 2,
                this.Scene.renderer.domElement.clientHeight / 2,
                this.Scene.renderer.domElement.clientHeight / -2,
                this.meta.props.setter.camera
            );
            this.initializeControl(this.Scene.renderer);
            this.Camera.controls.addEventListener( 'change', function(){
                that.render();
            });

            //################### ADD WATCHER ######################################
            this.$watch('meta.props.setter.camera', function(d){
                this.updateCameraByPropertyPanel(this.Scene.container, this.Scene.renderer, d);
                this.render();
            }, {deep : true});

            this.$watch('meta.props.style', function(d){
                this.Camera.activeCamera.aspect = this.Scene.container.clientWidth / this.Scene.container.clientHeight;
                this.Scene.renderer.setSize(this.Scene.container.clientWidth, this.Scene.container.clientHeight);
                this.render();
            }, {deep : true});

            //################# ADD CUSTOM EVENT ####################################
            this.initializeThreeLayerEvent(this.Camera.activeCamera, this.Scene.renderer.domElement);
            this.customThreeLayerCompMouseDownHandler = function(event){
                console.log("############## Mousedown Event#####################");
                this.mousedownComponent.outlineElement.visible = false;
                console.log(event.target);
                event.target.outlineElement.visible = true;
                this.render();
            };
            this.customThreeLayerCompMouseOverHandler = function(event){
                console.log(event.target);
                if(event.target.$obj.children.length){
                    var that = this;
                    event.target.$obj.children.forEach(function(child){
                        child.material.emissive.setHex("0x64FE2E")
                        child.material.needsUpdate = true;
                        that.render();
                    })
                }
            };
            this.customThreeLayerCompMouseOutHandler = function(event){
                var that = this;
                if(this.mousedownComponent !== null){
                    if(this.mousedownComponent !== event.target.id){
                        if(event.target.$obj.children.length){
                            event.target.$obj.children.forEach(function(child){
                                child.material.emissive.setHex("0x000000")
                                child.material.needsUpdate = true;
                                that.render();
                            })
                        }
                    }
                }else{
                    if(event.target.$obj.children.length){
                        event.target.$obj.children.forEach(function(child){
                            child.material.emissive.setHex("0x000000")
                            child.material.needsUpdate = true;
                            that.render();
                        })
                    }
                }
            };
            this.addLayerEventListener('custom_event', this.id + '/mousedown', this.customThreeLayerCompMouseDownHandler.bind(this));
            this.addLayerEventListener('custom_event', this.id + '/mouseover', this.customThreeLayerCompMouseOverHandler.bind(this));
            this.addLayerEventListener('custom_event', this.id + '/mouseout', this.customThreeLayerCompMouseOutHandler.bind(this));

            this.customThreeLayerCompResourceLoadedHandler = function(event){
                //event.target = loaded comp 3d object
                this.addToScene(event.target.$obj);
                this.addToScene(event.target.createOutlineElement(event.target));
                this.render();
            };
            this.addLayerEventListener('custom_event', this.meta.page_id + '/resource_loaded', this.customThreeLayerCompResourceLoadedHandler.bind(this))

        },
        destroyThreeLayer(){
            this.destroyScene();
            this.destroyCamera();
        },
        render(){
            this.Scene.renderer.render(this.Scene.scene, this.Camera.activeCamera);
        },
        topView(){
            this.setActiveCamera('orthographic');
            this.moveCamera(new THREE.Vector3(), new THREE.Vector3(0, 100, 0));
            this.Camera.controls.enabled = false;
            this.render();
        },
        quarterView(){
            this.setActiveCamera('perspective');
            this.moveCamera(new THREE.Vector3(), new THREE.Vector3(100, 100, 100));
            this.Camera.controls.enabled = true;
        },
        zoomIn(){
            this.Camera.controls.zoomIn();
        },
        zoomOut(){
            this.Camera.controls.zoomOut();
        },
        moveLeft(e){
            this.Camera.controls.panning('left')
        },
        moveRight(e){
            this.Camera.controls.panning('right')
        },
        moveUp(e){
            this.Camera.controls.panning('up')
        },
        moveDown(e){
            this.Camera.controls.panning('down')
        },
        addChild(compData){
            var component = new this.three_comp[compData.compName].component();
            this.three_comp[compData.compName].mixins.forEach((mix)=>{
                var data = mix.data();
                var data_key = Object.keys(data);
                data_key.forEach((key)=>{
                    if(!component.hasOwnProperty(key)){
                        var temp = {};
                        temp[key] = data[key];
                        _.merge(component, temp);
                    }
                })

                var methods = mix.methods;
                var method_keys = Object.keys(methods);

                method_keys.forEach((method)=>{
                    if(!component.hasOwnProperty(method)){
                        var temp = {};
                        temp[method] = methods[method];
                        _.merge(component, temp);
                    }
                })
            });
            component.created();

            console.log("#################### COMPONENT CREATED #########################")
            console.log(component);
            console.log(this);

            component.$parent = this;
            component.meta.page_id = this.meta.page_id;
            component.id = compData.compName;
            component.updated();

            this.resourceLoad(component);


        },

    }
};
export default threeLayer;
