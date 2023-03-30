const   debug   = require("debug")("api:auth"),
        bcrypt  = require("bcryptjs"),
        crypto  = require("crypto"),
        jwt     = require("jsonwebtoken");

const   config  = require("../../config"),
        knex    = require("../../db/knex");


function isSame(encoded, email, password) {
    let emailHash = crypto.createHash('sha256').update(email).digest('hex');
    let passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    let toBeHashed = [emailHash, passwordHash].join('+');
    let result = bcrypt.compareSync(toBeHashed, encoded);
    return result;
}

module.exports.login = async (req, res)=> {
    let email = req.body.email;
    let password = req.body.password;

    try{
        if(!email || !password){
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        let rows = await knex('users').where({email: email});
        if(rows.length === 0){
            return res.status(404).json({
                message: 'Profile Not Found'
            })
        }
        let user = rows[0];

        if(!isSame(user.password, email, password)){
            return res.status(401).json({
                message: 'Invalid credentials'
            })
        }

        let payload = {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role
        };
        let token = jwt.sign(payload, config.get("jwt:secret"), {
            expiresIn: config.get('jwt:ttl')
        });

        return res.status(200).send({token: token}).end();
    }catch(e) {
        return res.status(403).send(e);
    }
}

module.exports.isLoggedIn = (req, res, callback) => {
    let token;

    if(req.headers && !req.headers.authorization) return res.status(401).json({
        err: "No Authorization header was found"
    });

    let parts = req.headers.authorization.split(" ");
    if(parts.length !== 2) return res.status(401).json({
        err: "Format is Authorization: Bearer [token]"
    });

    let scheme      = parts[0],
        credentials = parts[1];
    if(/^Bearer$/i.test(scheme)) {
        token = credentials;
    }

    jwt.verify(token, config.get("jwt:secret"), async (err, decoded) => {
        if(err) return callback(false);
        debug(decoded);

        let query = knex('users')
        .join('org_user', 'org_user.user_id', 'users.id')
        .join('org', 'org.id', 'org_user.org_id')
        .where('users.email', decoded.email);

        req.user = query[0];
        callback(true);
    });
};