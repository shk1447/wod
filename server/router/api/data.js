var fs = require('fs');
var path = require('path');
var fsPath = require('fs-path');

module.exports = {
    post: {
        "bypass" : function(req,res,next) {
            console.log(req.body);
            process.send({event: req.body.data_key, data:req.body});
            res.status(200).send();
        }
    }
}