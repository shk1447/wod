const _ = require('lodash');
const pages = require('../../model/pages');

module.exports = {
    get : {
        "all" : function(req,res,next) {
            pages.findAll().then((pages) => {
                res.status(200).send(JSON.parse(JSON.stringify(pages)));
            }).catch((err) => {
                res.status(500).send(err);
            })
        }
    },
    post: {
        "set" : function(req,res,next) {
            pages.create(req.body).then((page) => {
                res.status(200).send(page);
            }).catch((err) => {
                res.status(500).send(err);
            })
        },
        "delete": function(req,res,next) {
            pages.removeById(req.body.page_id).then(() => {
                res.status(200).send();
            }).catch((err) => {
                res.status(500).send(err);
            })
        }
    }
}