export default {
    type:"three_comp",
    name:"rack-comp",
    component: function() {
        this.$obj = undefined;
        this.$texture = undefined;
        this.props = {
            path : {
                obj:'/assets/models/rack/hpRack_RK.obj',
                texture:'/assets/models/rack/maps/hpServerRack.png',
            },
            style:{
                x:0,
                y:0,
                z:0
            }
        };
        this.created = function() {
            console.log('rack created')
        };
        this.mounted = function() {
            console.log('rack mounted')
            this.$obj.position.x = this.props.style.x;
            this.$obj.position.y = this.props.style.y;
            this.$obj.position.z = this.props.style.z;
        };
        this.updated = function() {
            console.log('rack updated')
        }
        this.destroyed = function() {
            console.log('rack destroyed')
        };
    }
}