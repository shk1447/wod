const http = require("../../../utils/http").default;

module.exports = function PollingNode(properties) {
    this.id = properties.id;
    this.input = properties.input;
    this.output = properties.output;
    this.type = properties.type;
    this.props = properties.props;
    this.flow = properties.flow;

    this.input_data = function(data, caller) {

    }.bind(this);
    this.output_data = function() {
        http.get(this.meta.props.setter.url).then(function(res) {
            if(this.flow.wires && this.flow.wires.length > 0) {
                for(var i = 0; i < this.flow.wires.length; i++) {
                    var wired_obj = this.flow.wires[i];
                    wired_obj.input_data(res, this);
                }
            }
        }.bind(this));
    }.bind(this);

    this.created = function() {
        
    }

    this.mounted = function() {
        this.output_data();
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