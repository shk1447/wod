const users = require('../../model/users');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

users.findOneByJson({user_id: 'admin'}).then((user) => {
    if(!user) {
        users.create({user_id:'admin', password:'admin'}).then((result) => {
            console.log(result);
        })
    }
})

passport.use(new LocalStrategy({usernameField:'user_id', passwordField:'password', passReqToCallback:true},(req,user_id,password,done) => {
    console.log(user_id);
    users.findOneByJson({user_id:user_id,password:password}).then((user) => {
        done(null,user);
    })
}));

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    done(null,user);
});

passport.deserializeUser((user, done) => {
    done(null,user)
});

module.exports = {
    post: {
        "login": function(req,res,next) {
            passport.authenticate('local', (err,user_info,info) => {
                var res_body = {};
                var status_code = 200;
                if(!user_info) {
                    status_code = 401;
                    res_body = info;
                    res.status(status_code).send(res_body);
                    return;
                } 

                req.login(user_info, (err) => {
                    if(err) {
                        status_code = 500;
                        res_body = err;
                    } else {
                        res_body = user_info
                    }
                    res.status(status_code).send(res_body);
                })
            })(req,res,next);
        }
    },
    get: {
        "logout": function(req,res,next) {

        }
    }
}