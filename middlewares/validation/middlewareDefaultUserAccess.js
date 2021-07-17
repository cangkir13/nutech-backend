/**
 * @author lepek13
 * middlewares for register default user menu access
 * user role must be super admin
 * schemas middlewares
 * 1. get and check user data
 * 2. get and check user access default
 * 3. return menu roles and data menus
 */

const modelUser = require('../../models').master_user
const modelUserAccess = require('../../models').master_user_access
const modelMenus = require('../../models').master_menus
const modelMenusRoles = require("../../models").master_menus_roles

module.exports = async(req, res, next) => {

    const {user_role} = req.user.data

    if (user_role !== 1) {
        return res.status(403).json({
            success:false,
            message:"Forbidden access"
        })
    }

    const {email} = req.body

    /**
     * @var userFalse tmp user not found
     * @var users tmp user availble 
     */
    const usersFalse = []
    const users = []
    for (let index = 0; index < email.length; index++) {
        // find user
        const element = await modelUser.findOne({
            where:{
                email:email[index]
            },
        })

        // check falsy data
        if (!element) {
            // return array user email tmp #userFalse
            usersFalse.push(email[index])
        } else {
            // return array with object tmp #user
            users.push({
                id_user:element.id,
                id_role:element.role,
                email:element.email
            })
        }
    }

    // CHECK tmp #userFalse
    if (usersFalse.length > 0) {
        return res.status(404).json({
            success:false,
            message:"User not found",
            email:usersFalse
        })
    }
    
    /**
     * @var useraccessHasData tmp user has own default menu access
     * @var useraccessNew tmp user default access
     */
    let useraccessHasData = []
    let useraccessNew = []
    for (let index = 0; index < users.length; index++) {
        // find default user access
        const element = await modelUserAccess.findOne({
            where:{
                id_user:users[index].id_user
            }
        });
        // check user has default access
        if (element) {
            // return array email to tmp #useraccessHasData 
            useraccessHasData.push(users[index].email)
        } else {
            // return array object to tmp #useraccessNew
            useraccessNew.push(users[index])
        }
    }

    /**
     * CHECK USER HAS DEFAULT USER ACCESS
     * return false with object arrays if any user has default access
     */
    if (useraccessHasData.length > 0) {
        return res.status(403).json({
            success:false,
            message:'User has access default menu access',
            users:useraccessHasData
        })
    }


    // insert to request tmp
    let tmpUserAccessMenu = []
    for (let index = 0; index < useraccessNew.length; index++) {
        
        const element = await modelMenusRoles.findAll({
            where:{
                id_role:useraccessNew[index].id_role
            },
            attributes:['id_role', 'id_menu'],
            include:[
                {
                    model:modelMenus,
                    as:"menu",
                    attributes:['service_name', 'method', 'path', 'description', 'docs', 'status']
                }
            ]
        })

        for (let ii = 0; ii < element.length; ii++) {
            element[ii].dataValues.id_user = useraccessNew[index].id_user
            element[ii].dataValues.email = useraccessNew[index].email
            tmpUserAccessMenu.push(element[ii].dataValues)
        }

    }

    req.user_acces = tmpUserAccessMenu
    return next()

}