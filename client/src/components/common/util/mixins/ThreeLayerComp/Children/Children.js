import * as THREE from 'three'
import {MTLLoader, OBJLoader} from "three-obj-mtl-loader";
import _ from 'lodash';

const Children = {
    data : function(){
        return {
            components : []
        }
    },
    methods : {
        addChildren(layerComp){
            _.each(layerComp.meta.props.children, function(comp, i){
                var mtlLoader = new MTLLoader();
                var objLoader = new OBJLoader();

                var component = new layerComp.three_comp[comp.compName].component();

                layerComp.three_comp[comp.compName].mixins.forEach((mix)=>{
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
                            _.merge(component.temp);
                        }
                    })
                })

                component.created();

                component.props = _.extend(component.props, comp.props);

                component.id = comp.id;//manager.js에서 add, remove할 때 id를 갖고 하기 때문에 3d component에 id를 부여
                component.page_id = comp.page_id;
                component.$parent = layerComp;//input_data 함수가 실행되면 렌더를 한번 다시 해줘야 화면이 바뀌기 때문에 자신의 parent를 갖고 있도록 한다.
                component.updated();

                mtlLoader.load(component.props.path.material, (materials)=>{
                    materials.preload();
                    objLoader.setMaterials(materials);
                    objLoader.load(component.props.path.obj, (object)=>{
                        component.$obj = object;
                        if(component.$obj.children.length){
                            component.$obj.children.forEach(function(child){
                                child.compId = component.id
                            })
                        }else{
                            component.$obj.compId = component.id;
                        }
                        this.components.push(component);
                        var outline = component.createOutlineElement(component);
                        layerComp.scene.add(outline);

                        layerComp.addLayerEventListener('layer_mouse_event', 'mousedown',function(event){
                            console.log(event);
                            if(event.origDomEvent.button === 0)
                                layerComp.custom_events.emit(layerComp.id + '/mousedown', {target : component});
                        }, component.$obj);

                        layerComp.addLayerEventListener('layer_mouse_event', 'click',function(event){
                            if(event.origDomEvent.button === 0)
                                layerComp.custom_events.emit(layerComp.id + '/click', {target : component});
                        }, component.$obj);

                        if(component.$obj.children.length){
                            component.$obj.children.forEach(function(child){
                                layerComp.addLayerEventListener('layer_mouse_event', 'mouseover',function(event){
                                    if(event.origDomEvent.button === 0)
                                        layerComp.custom_events.emit(layerComp.id + '/mouseover', {target : component});
                                }, child);
                                layerComp.addLayerEventListener('layer_mouse_event', 'mouseout',function(event){
                                    if(event.intersect === undefined){
                                        layerComp.custom_events.emit(layerComp.id + '/mouseout', {target : component});
                                        layerComp.mouseoverComponent = null;
                                    }else{
                                        if(event.target.compId === layerComp.mouseoverComponent)
                                            return;
                                        else{
                                            layerComp.custom_events.emit(layerComp.id + '/mouseout', {target : component});                                            }
                                    }
                                }, child);
                            })
                        }
                        component.mounted();

                        layerComp.render();
                    })
                })

            })
        },
        ChildrenDestroyed(){
            this.components = null;
        }
    }
}
export default Children
