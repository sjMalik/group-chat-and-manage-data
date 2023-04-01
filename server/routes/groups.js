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
    let rows = await knex('chat_groups as g')
        .select('*')
        .where('g.id', groupid);

    req.group = rows[0];

    next();
});

/**
 * Get the List of Groups
 * Search the group fully or partially by group's name
 * Create a new group
 */
router.route('/')
    .get(async (req, res) => {
        let page = numeral(req.query.page || 1).value();
        let perPage = numeral(req.query.perPage || 10).value();

        let offset = (page - 1) * perPage;
        let limit = perPage;

        let query = knex.select('g.id', 'g.name', 'g.created_at').from('chat_groups as g').groupBy('g.id');

        if(req.query.search){
            debug(req.query.search)
            query = query.where(q=> q.where('g.name', 'ilike', `%${req.query.search}%`));
        }

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

        try{
            let group_id = await knex('chat_groups')
            .insert({
                name: group.name
            }).returning('id');

        return res.status(200).send({
            group: group_id[0]
        })
        }catch(e){
            debug(e);
            return res.status(500).json(e);
        }
    });

/**
 * Get a particular group by group id
 * Update a group
 * Delete a group
 */
router.route('/:groupid')
    .get(async (req, res)=> {
        return res.status(200).send({
            ...req.group
        });
    })
    .patch(async (req, res)=> {
        let name = req.body.name;

        try{
            await knex.table('chat_groups')
                .update({
                    name: name
                }).where('id', req.group.id);
            
            return res.status(200).end();
        }catch(e){
            debug(e);
            return res.status(500).json(e);
        }
    })
    .delete(async (req, res)=> {
        try{
            await knex.transaction(async tx=> {
                await knex('group_users').delete().where('group_id', req.group.id);
                await knex('chat_groups').delete().where('id', req.group.id);

                await tx.commit();
                res.status(200).end();
            })
        }catch(e){
            debug(e);
            await tx.rollback();
            res.status(500).json(e);
        }
    });

router.post('/:groupid/add_member', async (req, res)=> {
    let userid = req.body.user_id;

    try{
        await knex('group_users')
            .insert({
                group_id: req.params.groupid,
                user_id: userid
            });
        
        return res.status(200).json({
            message: "Member added in group"
        }).end();
    }catch(e){
        debug(e);
        return res.status(500).json(e).end();
    }
});

/**
 * Get all users in a group
 */
router.get('/:groupid/users', async (req, res)=> {
    let rows = await knex.select('u.id', 'u.email', 'u.first_name', 'u.last_name', 'u.role')
        .from('group_users as gu')
        .innerJoin('users as u', 'u.id', 'gu.created_by')
        .where('gu.group_id', req.params.groupid);

    return res.status(200).json({
        users: rows
    }).end();
});

/**
 * Store chats in group
 */
router.post('/:groupid/chats', async (req, res)=> {
    let messages = req.body;

    try{
        let chatid = await knex('chats')
            .insert({
                message: messages.text,
                message_props: messages.message_props,
                created_by: req.user.id,
                group_id: req.params.groupid
            }).returning('id');

        return res.status(200).json({
            chat: chatid[0]
        }).end();
    }catch(e){
        debug(e);
        return res.status(500).json(e).end();
    }
});

/**
 * Get Group Chats with likes
 */
router.get('/:groupid/chats', async(req, res)=> {
    let rows = await knex.select(knex.raw(`
        c.id,
        c.message,
        c.message_props,
        c.created_by,
        c.created_at,
        array_agg(json_build_object(
            'id', cl.id,
            'liked_by', cl.liked_by,
            'liked_at', cl.created_at
        )) as chat_likes`))
        .from('chats as c')
        .leftJoin('chat_likes as cl', 'c.id', 'cl.chat_id')
        .groupBy('c.id')
        .where('c.group_id', req.params.groupid);

    return res.status(200).json({
        chats: rows
    }).end();
})

/**
 * Like chat
 */
router.post('/:groupid/chats/:chatid/like', async (req, res)=> {
        try{
            let chat_like_id = await knex('chat_likes')
                .insert({
                    chat_id: req.params.chatid,
                    liked_by: req.user.id
                }).returning('id');

            return res.status(200).json({
                chat_like: chat_like_id[0]
            }).end();
        }catch(e){
            debug(e);
            return res.status(500).json(e).end();
        }
});

/**
 * Dislike chat
 */
router.post('/:groupid/chats/:chatid/dislike', async (req, res)=> {
        try{
            await knex('chat_likes')
                .delete()
                .where('id', req.params.chatid)
                .andWhere('liked_by', req.user.id);

            return res.status(200).end();
        }catch(e){
            debug(e);
            return res.status(500).json(e).end();
        }
});

module.exports = router;