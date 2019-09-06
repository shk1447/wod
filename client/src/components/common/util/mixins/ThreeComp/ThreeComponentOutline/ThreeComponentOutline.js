import * as THREE from 'three'

const ThreeComponentOutline = {
    data(){
        return {
            outlineElement : null,
            outline_height : null
        }
    },
    methods : {
        createOutlineElement(component){
            var box = this.getCompoundBoundingBox(component.$obj);
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
            this.outlineElement.visible = true;

            //보정
            component.$obj.position.x += (height / 2) * component.meta.props.style.scale.x;
            component.$obj.position.y += (height / 2) * component.meta.props.style.scale.y;
            component.$obj.position.z += (height / 2) * component.meta.props.style.scale.z;

            this.outlineElement.position.set(component.$obj.position.x, component.$obj.position.y, component.$obj.position.z)
            this.outlineElement.scale.set(
                component.meta.props.style.scale.x,
                component.meta.props.style.scale.y,
                component.meta.props.style.scale.z,
            )
            return this.outlineElement
        },
        disposeOutlineElement(component){
            //dispose
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
};
export default ThreeComponentOutline;
