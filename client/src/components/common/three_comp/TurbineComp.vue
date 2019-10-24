<script>
    import {MTLLoader, OBJLoader} from "three-obj-mtl-loader";
    import * as THREE from 'three'
    export default {
        name: "TurbineComp",
        type : 'three_comp',
        compName : 'turbine-comp',
        category:'KEPCO',
        fields : {
            style:[],
            setter:[[{
                "key":"props.setter.parts.turbineGenerator001",
                "label":"turbine의 파츠 1",
                "type":"string",
                "description":"turbine의 파츠 1 설정"
            },{
                "key":"props.setter.parts.turbineGenerator002",
                "label":"turbine의 파츠 2",
                "type":"string",
                "description":"turbine의 파츠 2 설정"
            }]]
        },
        props : ['meta'],
        inject : ['global'],
        init_props : {
            path : {
                obj:'/assets/models/turbine/turbineGenerator_ET.obj',
                texture:'/assets/models/turbine/maps/{childName}.png',
                material : '/assets/models/turbine/turbineGenerator_ET.mtl'
            },
            style:{
                position : {
                    x : 0,
                    y : 0,
                    z : 0
                },
                rotation : {
                    x : 0,
                    y : 0,
                    z : 0
                },
                scale : {
                    x : 0.1,
                    y : 0.1,
                    z : 0.1
                }
            }
        },
        data(){
            return {
                object : null,
                texture : null,
                meta : this.meta,
                mouseovered : false,
                outlineElement : null
            }
        },
        created(){
            var mtlLoader = new MTLLoader();
            var objLoader = new OBJLoader();
            mtlLoader.load(this.meta.props.path.material, (materials)=>{
                materials.preload();
                objLoader.setMaterials(materials);
                objLoader.load(this.meta.props.path.obj, (object, index)=>{
                    this.$obj = object;
                    this.$obj.scale.set(
                        this.meta.props.style.scale.x,
                        this.meta.props.style.scale.y,
                        this.meta.props.style.scale.z
                    );
                    var that = this;
                    this.$obj.children.forEach((child)=>{
                        child.userData['id'] =that.meta.id
                    })
                    console.log(this.$obj);
                    console.log(this.meta);
                    this.global.mainContainer.add(this.$obj);
                    this.global.domEvents.addEventListener(this.$obj, 'click', this.click, true);
                    var that = this;
                    this.$obj.children.forEach(function(child){
                        that.global.domEvents.addEventListener(child, 'mouseover', that.mouseover, true);
                        that.global.domEvents.addEventListener(child, 'mouseout', that.mouseout, true);
                    });

                    this.createOutlineElement();
                    this.global.webGLRenderer.render(this.global.scene, this.global.activeCamera);
                })
            })
          console.log("turbine created!");
        },
        mounted(){

            console.log('turbine mounted');
            this.core.flow.manager.addCompNode(this);
        },
        updated(){
            console.log('turbine updated');
        },
        destroyed(){
            console.log('turbine destroyed');
            this.core.flow.manager.removeCompNode(this);
        },
        methods : {
            input_data : function(data){
                this.$obj.children.forEach((mesh)=>{
                    if(data[mesh.name] === true){
                        mesh.material.emissive.r = 1;
                    }else{
                        mesh.material.emissive.r = 0;
                    }
                    mesh.material.needsUpdate = true;
                });
                this.global.webGLRenderer.render(this.global.scene, this.global.activeCamera);
            },
            output_data : function(){

            },
            click : function(event){
                console.log("################# TURBINE CLICK ######################")
                this.outlineElement.visible = true;
            },
            mouseover : function(event){
                console.log("################# TURBINE MOUSEOVER ######################")
                var that = this;
                this.$obj.children.forEach((child)=>{
                    child.material.emissive.setHex("0x64FE2E")
                    child.material.needsUpdate = true;
                    that.global.webGLRenderer.render(that.global.scene, that.global.activeCamera);
                    that.mouseovered = true;
                })
            },
            mouseout : function(event){
                console.log("################# TURBINE MOUSEOUT ######################")
                console.log(event);
                var that = this;
                if(event.intersect === undefined){
                    this.$obj.children.forEach((child)=>{
                        child.material.emissive.setHex("0x000000");
                        child.material.needsUpdate = true;
                        that.global.webGLRenderer.render(that.global.scene, that.global.activeCamera);
                        that.mouseovered = false;
                    })
                }
            },
            createOutlineElement(){
                var box = this.getCompoundBoundingBox(this.$obj);
                box.max.sub(box.min);
                var width, height, depth;
                width = box.max.x;
                height = box.max.y;
                this.outline_height = height;
                depth = box.max.z;
                var boxGeometry = new THREE.BoxGeometry(width, height, depth);
                var boxMaterial = new THREE.MeshBasicMaterial({color : 0xff00000});
                boxMaterial.wireframe = true;
                this.outlineElement = new THREE.Mesh(boxGeometry, boxMaterial);
                this.outlineElement.visible = false;

                //보정
                this.$obj.position.x += (height / 2) * this.meta.props.style.scale.x;
                this.$obj.position.y += (height / 2) * this.meta.props.style.scale.y;
                this.$obj.position.z += (height / 2) * this.meta.props.style.scale.z;

                this.outlineElement.position.set(this.$obj.position.x, this.$obj.position.y, this.$obj.position.z)
                this.outlineElement.scale.set(
                    this.meta.props.style.scale.x,
                    this.meta.props.style.scale.y,
                    this.meta.props.style.scale.z,
                )
                this.global.scene.add(this.outlineElement);
            },
            getCompoundBoundingBox(object3D){
                var box = null;
                object3D.traverse(function (obj3D) {
                    var geometry = obj3D.geometry;
                    if (geometry === undefined) return;
                    geometry.computeBoundingBox();
                    if (box === null) {
                        box = geometry.boundingBox;
                    } else {
                        box.union(geometry.boundingBox);
                    }
                });
                return box;
            }
        }
    }
</script>

<style scoped>

</style>
