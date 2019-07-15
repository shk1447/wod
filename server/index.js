const _ = require('lodash');

const net = require('net');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const busboy = require("connect-busboy");
var compression = require('compression');
var helmet = require('helmet');

const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session);

const passport = require('passport');

var cluster = require('cluster');
var os = require('os');

// rdbms connector & query builder
const knex = require('knex');

const socket = require('./socket');
const router = require('./router');
const runtime = require('./runtime');

const model = require('./model');

khan = {
    service:true,
    session_store:null,
    database:null,
    logger:require('./utils/logger'),
    model:null
}

module.exports = function(config) {
    khan.database = knex({
        client:config.database.type,
        connection : config.database[config.database.type],
        pool: {min:0,max:10}
    })
    khan.session_store = new KnexSessionStore({
        knex:khan.database,
        createtable :false,
        tablename:"sessions"
    })
    khan.model = model();

    ClusterServer = {
        name: 'ClusterServer',
        
        cpus: os.cpus().length,
        
        autoRestart: true,
        
        start: function (server, port) {
            var me = this,
                i;
            
            function eachWorker(callback) { for (var id in cluster.workers) { callback(cluster.workers[id]); } }
            
            if (cluster.isMaster) {
                // var stats_path = path.resolve(process.env.root_path, './stats.json');
                // var test = JSON.parse(fs.readFileSync(stats_path,'utf8'));
                // var webpack_analyzer = require('webpack-bundle-analyzer')
                // webpack_analyzer.start(test);
                
                _.each(khan.model, (d,i) => {
                    d.initialize();
                })
                for (i = 0; i < me.cpus; i += 1) {
                    var worker = cluster.fork();

                    worker.on('message', function(msg) {
                        eachWorker(function(_worker) {
                            _worker.send(msg);
                        })
                    })
                }
                
                cluster.on('death', function (worker) {
                    khan.logger.warn(me.name + ': worker ' + worker.pid + ' died.')
                    if (me.autoRestart) {
                        khan.logger.warn(me.name + ' Restarting worker thread...')
                        cluster.fork();
                    }
                });
            } else {
                process.on("message", function(msg) {
                    khan.socket.clients.forEach((s) => {
                        s.emit(msg.event,msg.data)
                    });
                })

                server.listen(port,'0.0.0.0', function(){
                    khan.logger.info(me.name + ' starting worker thread #' + cluster.worker.id);
                    // if(cluster.worker.id === me.cpus) {
                    //     require('opener')("http://localhost:" + port);
                    // }
                }).on('error', function(err){
                    khan.logger.error(err.message);
                })
            }
        }
    }

    var app = express();

    // app.use(function(req,res,next) {
    //     res.header('Access-Control-Allow-Credentials', true);
    //     res.header('Access-Control-Allow-Origin', '*');
    //     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //     res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    //     if ('OPTIONS' == req.method) {
    //         res.send(200);
    //     } else {
    //         next();
    //     }
    // })

    // middle-ware performance check!
    app.set('view cache', true);
    app.use('/css', express.static(path.resolve(process.env.root_path,'./css')));
    app.use('/icons', express.static(path.resolve(process.env.root_path,'./icons')));
    app.use('/js', express.static(path.resolve(process.env.root_path,'./js')));
    app.use('/libs', express.static(path.resolve(process.env.root_path,'./libs')));
    app.use('/static', express.static(path.resolve(process.env.root_path,'./static')));
    app.use('/vendor', express.static(path.resolve(process.env.root_path,'./vendor')));
    app.use(helmet());
    app.use(helmet.xssFilter());
    app.disable('x-powered-by');
    app.use(cors());
    app.use(compression());
    app.use(bodyParser.urlencoded({limit:'5mb',extended:true}));
    app.use(bodyParser.json({limit:'5mb'}));
    app.use(busboy());

    app.use(cookieParser());
    app.use(session({
        key: 'sid',
        secret: 'khan',
        cookie: {
            maxAge: 1000 * 60 * config.session_time
        },
        saveUninitialized: false,
        resave: false,
        store:khan.session_store,
        rolling:true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req,res,next) => {
        if(khan.service) {
            next();
        } else {
            res.status(401).send();
        }
    })

    router(app,config);
    khan['app'] = app;
    runtime.init(khan);
    runtime.load();

    var server = config.https ? https.createServer({
        key:fs.readFileSync(path.resolve(process.env.root_path, './cert/key.pem')),
        cert:fs.readFileSync(path.resolve(process.env.root_path, './cert/cert.pem'))
    },app) : http.createServer(app);
     
    // 서버 전체 에러 이벤트 리스닝
    server.addListener("error", (err) => {
        khan.logger.error(err.message);
    });
    socket.web_socket(server,khan);
    
    ClusterServer.name = 'khan';
    ClusterServer.start(server, process.env.port);
}