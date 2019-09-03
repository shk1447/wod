module.exports = function PollingNode(properties) {
    this.id = properties.id;
    this.input = properties.input;
    this.output = properties.output;
    this.type = properties.type;
    this.props = properties.props;
    this.flow = properties.flow;

    this.input_data = function(data) {
        var res = new Function(this.props.script).bind(this);
        this.output_data(res());
    }.bind(this);

    this.output_data = function(data) {
        if(this.wires && this.wires.length > 0) {
            for(var i = 0; i < this.wires.length; i++) {
                var wired_obj = this.wires[i];
                wired_obj.input_data(data);
            }
        }
    }.bind(this);

    this.created = function() {

    }

    this.destroyed = function() {
        this.id = null;
        this.input = null;
        this.type = null;
        this.props = null;
        this.flow = null;
    }
    return this;
}