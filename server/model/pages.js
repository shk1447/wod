const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    page_id: { type : String, required: true, unique: true},
    instances: { type : mongoose.Schema.Types.Mixed }
},{
    timestamps:true
})

pageSchema.statics.create = function(payload) {
    const page = new this(payload);
    return page.save();
};

pageSchema.statics.findAll = function() {
    return this.find({});
};

pageSchema.statics.findOneById = function(id) {
    return this.findOne({id});
};

module.exports = mongoose.model('Page', pageSchema);