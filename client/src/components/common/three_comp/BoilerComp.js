export default {
    type:"three_comp",
    name:"boiler-comp",
    component: function() {
        this.$obj = undefined;
        this.$texture = undefined;
        this.props = {
            path : {
                obj:'/assets/models/boiler/boiler_ET.obj',
                texture:'/assets/models/boiler/maps/{childName}.png',
            },
            style:{
                x:0,
                y:0,
                z:0
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
        };
        this.updated = function() {
            console.log('boiler updated')
        }
        this.destroyed = function() {
            console.log('boiler destroyed')
        };
    }
}