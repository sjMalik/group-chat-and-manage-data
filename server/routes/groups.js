const   debug       = require('debug')('api:groups'),
        express     = require('express'),
        numeral     = require('numeral');

const   config      = require('../../config'),
        knex        = require('../../db/knex'),
        middleware  = require('./middleware');

const router = express.Router();
router.use(middleware.isAuthenticated);

router.param('groupid', async (req, res, next, groupid)=> {
    let number = new RegExp(/^\d+$/);
    if (!number.test(groupid)) return next('route');

    req.groupid = parseInt(groupid);
    let rows = await knex('chat_groups')
        .select('*')
        .where('groups.id', groupid);

    req.group = rows[0];

    next();
});

router.route('/')
    .get(async (req, res) => {
        let page = numeral(req.query.page || 1).value();
        let perPage = numeral(req.query.perPage || 10).value();

        let offset = (page - 1) * perPage;
        let limit = perPage;

        let query = knex.select('g.id', 'g.name', 'g.created_at').from('chat_groups as g').groupBy('g.id');
        let total = await query.clone().count();
        debug(total);
        let rows = await query.limit(limit).offset(offset);

        return res.status(200).send({
            groups: rows,
            total: total.length? total[0].count : 0
        })
    })
    .post(async (req, res)=> {
        let group = req.body;

        let group_id = await knex('chat_groups')
            .insert({
                name: group.name
            }).returning('id');

        return res.status(200).send({
            id: group_id[0]
        })
    })

    module.exports = router;