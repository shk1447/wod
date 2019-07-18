export default {
    type:"three_comp",
    name:"turbine-comp",
    component: function() {
        this.$obj = undefined;
        this.$texture = undefined;
        this.props = {
            path : {
                obj:'/assets/models/turbine/turbineGenerator_ET.obj',
                texture:'/assets/models/turbine/maps/{childName}.png',
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
            console.log('turbine updated')
        }
        this.destroyed = function() {
            console.log('turbine destroyed')
        };
    }
}