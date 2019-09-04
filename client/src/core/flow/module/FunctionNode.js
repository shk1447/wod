module.exports = function FunctionNode(properties) {
    this.id = properties.id;
    this.input = properties.input;
    this.output = properties.output;
    this.type = properties.type;
    this.props = properties.props;
    this.flow = properties.flow;

    this.input_data = function(data) {
        var res = new Function(['data'],this.props.setter.script).bind(this);
        this.output_data(res(data));
    }.bind(this);

    this.output_data = function(data) {
        if(this.flow.wires && this.flow.wires.length > 0) {
            for(var i = 0; i < this.flow.wires.length; i++) {
                var wired_obj = this.flow.wires[i];
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