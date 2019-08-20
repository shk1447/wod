module.exports = function PollingNode(properties) {
    this.id = properties.id;
    this.input = properties.input;
    this.output = properties.output;
    this.type = properties.type;
    this.props = properties.props;
    this.flow = properties.flow;

    this.input_data = function() {

    };
    this.output_data = function() {
        if(this.wires && this.wires.length > 0) {
            for(var i = 0; i < this.wires.length; i++) {
                var wired_obj = this.wires[i];
                wired_obj.input_data('test');
            }
        }
    }
    return this;
}