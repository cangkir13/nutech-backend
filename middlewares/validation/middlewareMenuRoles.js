/**
 * @author lepek13
 * middlewares for register default user menu access
 * user role must be super admin
 * schemas middlewares
 * 1. get and check id roles
 * 2. get and check user access default
 * 3. return menu roles and data menus
 */

const modelMenus = require('../../models').master_menus
const modelRole = require('../../models').master_roles
const modelMenuRoles = require('../../models').master_menus_roles

module.exports = async(req, res, next) => {

    let {data} = req.user
    let {id_role, id_path} = req.body
    // CHECK ROLE USERS IS SUPER ADMIN
    if (data.user_role !== 1) {
        return res.status(403).json({
            success:false,
            message:'No access point'
        })
    }

    /**
     * @var RoleNull #tmp for id role is null
     * return false when id role is false
     */
    let RoleNull = []
    for (let index = 0; index < id_role.length; index++) {
        let Role = await modelRole.findOne({
            where:{
                id:id_role[index]
            }
        })

        if (!Role) {
            RoleNull.push(id_role[index])
        }
    }

    // CHECK ROLES UNDEFINED
    if (RoleNull.length > 0) {
        return res.status(404).json({
            success:false,
            message:"No data roles",
            RoleNull
        })
    }

    /**
     * @var MenuNull #tmp for menu is null
     * return false when menu is not define or null
     */

    // FIND DATA MENUS
    let MenuNull = []
    for (let index = 0; index < id_path.length; index++) {
        let menu = await modelMenus.findOne({
            where:{
                id:id_path[index]
            }
        })

        if (!menu) {
            MenuNull.push(id_path[index])
        }
    }

    // CHECK MENU NULL
    if (MenuNull.length > 0) {
        return res.status(404).json({
            success:false,
            message:"Not Found menu",
            MenuNull
        })
    }

    // NEW ARRAY FOR INSERT 
    let MenuRoles = []
    id_role.map((el) => {
        id_path.map((el2) => {
            MenuRoles.push({
                id_role:el,
                id_menu:el2
            })    
        })
    })

    /**
     * CHECK MENU ROLES IS AVAILABLE
     * return false if menus is available
     */

    // FIND MENU ROLES
    let menuRoleAvail = await modelMenuRoles.findAll({
        where:{
            id_role:MenuRoles.map((el) => el.id_role),
            id_menu:MenuRoles.map((el) => el.id_menu)
        },
        attributes:['id_role', 'id_menu']
    })
    
    // CHECK ARRAY IS AVAILABLE
    if (menuRoleAvail.length > 0) {
        return res.status(403).json({
            success:false,
            message:"Menu roles is available",
            menuRoleAvail
        })
    }

    // return array [ { id_role: 1, id_menu: 2}, ... ]
    req.MenuRoles = MenuRoles
    return next()
} 