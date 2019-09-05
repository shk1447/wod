import * as THREE from 'three'

const ThreeComponentOutline = {
    data(){
        return {
            outlineElement : null
        }
    },
    methods : {
        createOutlineElement(component){
            var box = this.getCompoundBoundingBox(component.$obj);
            box.max.sub(box.min);
            var width, height, depth;
            width = box.max.x;
            height = box.max.y;
            depth = box.max.z;
            var boxGeometry = new THREE.BoxGeometry(width, height, depth);
            var boxMaterial = new THREE.MeshBasicMaterial({color : 0xff00000});
            boxMaterial.wireframe = true;
            this.outlineElement = new THREE.Mesh(boxGeometry, boxMaterial);
            this.outlineElement.visible = false;
            this.outlineElement.position.set(component.props.style.position.x, component.props.style.position.y, component.props.style.position.z)
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
