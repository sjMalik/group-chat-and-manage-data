const   auth = require('../lib/auth');

exports.isAuthenticated = (req, res, next)=> {
    auth.isLoggedIn(req, res, (yes)=> {
        if(yes){
            next();
        }else {
            res.status(401).end();
        }
    })
}