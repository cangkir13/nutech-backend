const id_users_permite = [1, 2]
module.exports = (req, res, next) => {
    const { user_role} = req.user.data
    const permited = id_users_permite.find(el => el === user_role)
    if (!user_role && !permited) {
        return res.status(403).json({
            success: false,
            message: "Forbidden access roles"
        }) 
    }

    return next()
}