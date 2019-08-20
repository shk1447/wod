const _ = require('lodash');
const path = require('path');
const api = require('./api')

module.exports = function(app,config) {
    function ensureAuth(req,res,next) {
        if(req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/login');
        }
    }

    // api module loader
    _.each(api, (routes, path) => {
        _.each(routes, (funcs, routeName) => {
            _.each(funcs, (func, funcName) => {
                if(path === 'data' || (path === 'users' && (funcName === 'login' || funcName === 'logout'))) {
                    app[routeName]('/' + path + '/' + funcName, func);
                } else {
                    app[routeName]('/' + path + '/' + funcName, ensureAuth, func);
                }
            })
        })
    })

    app.get('/', function(req,res,next) {
        if(req.isAuthenticated()) {
            res.sendFile(path.resolve(process.env.root_path, './index.html'));
        } else {
            res.redirect('/login');
        }
    })
}