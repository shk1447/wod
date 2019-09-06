import ThreeComponentOutline from '../util/mixins/ThreeComp/ThreeComponentOutline/ThreeComponentOutline'

export default {
    type:"three_comp",
    category:'KEPCO',
    mixins : [ThreeComponentOutline],
    compName:"boiler-comp",
    fields: {
        style:[],
        setter:[[{
            "key":"props.setter.parts.boiler",
            "label":"boiler의 기계장치 boiler",
            "type":"string",
            "description":"boiler의 기계장치 boiler 설정"
          },{
            "key":"props.setter.parts.pipe_A",
            "label":"boiler의 기계장치 pipe_A",
            "type":"string",
            "description":"boiler의 기계장치 pipe_A"
          },{
            "key":"props.setter.parts.boiler02",
            "label":"boiler의 기계장치 boiler02",
            "type":"string",
            "description":"boiler의 기계장치 boiler02"
        }]]
    },
    component: function() {
        this.$obj = undefined;
        this.$texture = undefined;
        this.$parent = null;
        this.meta = {
            props : {
                path : {
                    obj:'/assets/models/boiler/boiler_ET.obj',
                    texture:'/assets/models/boiler/maps/{childName}.png',
                    material : '/assets/models/boiler/boiler_ET.mtl'
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
            }
        };
        this.created = function() {
            console.log('boiler created')
        };
        this.mounted = function() {
            console.log('boiler mounted')
            this.$obj.position.x = this.props.style.x;
            this.$obj.position.y = this.props.style.y;
            this.$obj.position.z = this.props.style.z;
            console.log(this);

        };
        this.updated = function() {
            // three layer comp에서 mount 라이프사이클에 3D 컴포넌트를 비동기 메쉬, 매테리얼을 로드 하고
            // 로드가 다 되면 3D 컴포넌트의 mounted를 호출한다.
            // 그러나 3D 컴포넌트를 만들고 있을 때 이미 Three Layer Comp 의 mounted가 되므로
            // 3D 컴포넌트의 mounted에 node를 추가하는 함수를 호출하게 되면
            // manager.js에서 flow를 excute할 때 3d 컴포넌트가 없을 수도 있기 때문에 ..
            // 프로퍼티가 merge 되고 난 후인 update에 node를 추가하는 코드를 삽입하였다.
            // 코드가 반복될 예정이니 상속 구조를 생각해보는것도 좋겠다.
            Vue.core.flow.manager.addCompNode(this)
            console.log('boiler updated')
        }
        this.destroyed = function() {
            console.log('boiler destroyed')
            Vue.core.flow.manager.removeCompNode(this)
        };
        this.input_data = function(data){
            console.log("boiler_data")
            console.log(data);
            console.log(this.$obj);
            this.$obj.children.forEach((mesh)=>{
                if(data[mesh.name] === true){
                    mesh.material.emissive.r = 1;
                }else{
                    mesh.material.emissive.r = 0;
                }
                mesh.material.needsUpdate = true;
            })
            this.$parent.render();
        };
        this.output_data = function(){

        };
    }
}
