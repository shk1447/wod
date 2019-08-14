const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: { type : String, required: true, unique: true},
    password: { type : String, required: true, unique: true}
},{
    timestamps:true
})

userSchema.statics.create = function(payload) {
    const user = new this(payload);
    return user.save();
};

userSchema.statics.findAll = function() {
    return this.find({});
};

userSchema.statics.findOneByJson = function(params) {
    return this.findOne(params);
};

userSchema.statics.removeById = function(id) {
    return this.remove({user_id: id});
};

module.exports = mongoose.model('User', userSchema);