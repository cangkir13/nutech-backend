const modelUser = require('../../models').master_user
const modelRole = require('../../models').master_roles
const bcryptjs = require('bcryptjs');

module.exports = async(req, res, next) => {
    let {email} = req.body
    let userdata = await modelUser.findOne({
        where:{
            email
        }
    })

    if (userdata) {
        return res.status(403).json({
            success: false,
            message: "Email already exist"
        })
    }

    const { password} = req.body
    // PASSWORD TO HASHING
    const hashedpass = bcryptjs.hashSync(password, 8);
    req.body.password = hashedpass
    req.body.status = true

    return next()
}