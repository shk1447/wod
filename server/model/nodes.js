const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
    id: { type : String, required: true, unique: true},
    type: { type : String, required: true},
    page_id: { type : String, required: true},
    parent_id: { type : String, required: true},
    input: { type : Boolean, required: true},
    output: { type : Boolean, required: true},
    props: { type : mongoose.Schema.Types.Mixed },
    flow: { type : mongoose.Schema.Types.Mixed }
},{
    timestamps:true
})

nodeSchema.statics.create = function(payload) {
    const node = new this(payload);
    return node.save();
};

nodeSchema.statics.findAll = function() {
    return this.find({});
};

nodeSchema.statics.findByPageId = function(id) {
    return this.find({page_id:id});
};

nodeSchema.statics.findOneById = function(id) {
    return this.findOne({id:id});
};

nodeSchema.statics.removeById = function(id) {
    return this.remove({page_id: id});
};

module.exports = mongoose.model('Node', nodeSchema);