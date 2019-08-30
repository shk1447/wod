export default {
    type:"three_comp",
    name:"turbine-comp",
    fields: {
        style:[],
        setter:[{
            "key":"props.setter.parts.turbineGenerator001",
            "label":"turbine의 파츠 1",
            "type":"string",
            "description":"turbine의 파츠 1 설정"
          },{
            "key":"props.setter.parts.turbineGenerator002",
            "label":"turbine의 파츠 2",
            "type":"string",
            "description":"turbine의 파츠 2 설정"
        }]
    },
    component: function() {
        this.$obj = undefined;
        this.$texture = undefined;
        this.$parent = null;
        this.props = {
            path : {
                obj:'/assets/models/turbine/turbineGenerator_ET.obj',
                texture:'/assets/models/turbine/maps/{childName}.png',
                material : '/assets/models/turbine/turbineGenerator_ET.mtl'
            },
            style:{
                x:0,
                y:0,
                z:0
            }
        };
        this.created = function() {
            console.log('turbine created')
        };
        this.mounted = function() {
            console.log('turbine mounted')
            this.$obj.position.x = this.props.style.x;
            this.$obj.position.y = this.props.style.y;
            this.$obj.position.z = this.props.style.z;
        };
        this.updated = function() {
            // three layer comp에서 mount 라이프사이클에 3D 컴포넌트를 비동기 메쉬, 매테리얼을 로드 하고
            // 로드가 다 되면 3D 컴포넌트의 mounted를 호출한다.
            // 그러나 3D 컴포넌트를 만들고 있을 때 이미 Three Layer Comp 의 mounted가 되므로
            // 3D 컴포넌트의 mounted에 node를 추가하는 함수를 호출하게 되면
            // manager.js에서 flow를 excute할 때 아이디로 플로우 타겟을 찾는데 이 때 없을 수도 있기 때문에 ..
            // 프로퍼티가 merge 되고 난 후인 update에 node를 추가하는 코드를 삽입하였다.
            // 코드가 반복될 예정이니 상속 구조를 생각해보는것도 좋겠다.
            Vue.core.flow.manager.addCompNode(this);
            console.log('turbine updated')
        }
        this.destroyed = function() {
            Vue.core.flow.manager.removeCompNode(this)
            console.log('turbine destroyed')
        };
        this.input_data = function(data){
            console.log("turbine_data")
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
