/**
 * @author LEPEK13
 * @description service signup, login, forget password and reset password
 */

const modelUser = require('../models').master_user
const tblReset = require('../models').reset_password
const config = require('../config')
const bcryptjs = require('bcryptjs');

const jwt = require('jsonwebtoken');

class AuthController {

    /**
     * SERVICE REGISTER ACCOUNT
     * @param {*} req BODY JSON (email, username, password, password_confirmation, role)
     * @param {*} res JSON 
     * @middleware middlewares/middlewareRegister.js
     * @route AuthRote.js /register
     */
    static async register(req, res) {
        
        // CREATE NEW ACCOUNT
        let users = await modelUser.create(req.body)

        return res.status(201).json({
            success:true,
            users
        })

    }

    /**
     * SERVICE LOGIN
     * @param {*} req request body (email, password)
     * @param {*} res JSON
     * @description login user
     * @route AuthRote.js /login
     */
    static async login(req, res) {
        try {
            // FIND USER
            let {email} = req.body

            let TblForgotUser = await tblReset.findOne({
                where:{
                    email
                }
            })

            if (TblForgotUser) {
                return res.status(403).json({
                    success:false,
                    message:"This account cannot login before update password"
                })
            }
            
            let data_user = await modelUser.findOne({
                where:{
                    email
                }
            })
            // CHECK USER
            if (!data_user) {
                return res.status(404).json({
                    success:false,
                    message:'No user found'
                })
            }

            if (!data_user.status) {
                return res.status(403).json({
                    success:false,
                    message:'User non active'
                })
            }

            // COMPARE PASSWORD
            let passwordIsValid = bcryptjs.compareSync(req.body.password, data_user.password)
            // CHECK COMPARE PASSWORD
            if (!passwordIsValid) {
                return res.status(401).json({
                    success:false,
                    message:'Password false'
                })
            }
            // JWT SIGN FUNCTION
            let token = jwt.sign({user_id:data_user.id, user_role:data_user.role_name}, config.JWT, {
                expiresIn: "1days",
                algorithm:"HS256"
            })
            
            return res.json({
                success:true,
                message:"ok",
                token,
                type:'Bearer',
                expiresIn: 60 * 60
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:"error server"
            })   
        }
    }

    /**
     * SERVICE FORGOT PASSWORD
     * @param {*} req BODY-JSON (email)
     * @param {*} res json
     * @route AuthRoute.js /ForgotPassword
     */
    static async ForgotPassword(req, res){
        try {
            
            let emailTO = req.body.email
            let User = await modelUser.findOne({
                where:{
                    email:emailTO
                }
            })
            
            // check user
            if (!User) {
                return res.status(404).json({
                    success:false,
                    message:"user not found"
                })
            }
    
            let checkToken = await tblReset.findOne({
                where:{
                    email:emailTO
                }
            })
            
            // check register forget password is exist
            if (checkToken) {
                return res.status(403).json({
                    success:false,
                    message:"password reset is in progress"
                })
            }
            
            let token = jwt.sign({user_id:User.id, email:User.email}, config.JWT, {
                expiresIn: "1days",
                algorithm:"HS256"
            })
    
            await tblReset.create({
                token,
                email:emailTO
            })
    
            return res.json({
                success:true,
                token
            })
        } catch (error) {
            return res.status(500).json({
                success:false,
                message:error.message,
                error:true
            })
        }
    }

    /**
     * SERVICE RESET PASSWORD
     * @param {*} req BODY-JSON (token, email, password, password_confirmation)
     * @param {*} res json
     * @route AuthRoute.js /ResetPassword
     */
    static async ResetPassword(req, res) {
        const {token, email, password} = req.body

        let findUserReset = await tblReset.findOne({
            where:{
                email
            }
        })

        if (!findUserReset) {
            return res.status(403).json({
                success:false,
                message:"No found user reset password"
            })
        } 

        // let passwordIsValid = bcryptjs.compareSync(email, findUserReset.token)
        let passwordIsValid = jwt.verify(token, jwtSecret, (err, expired) => {
            
            if (err) { 
                return {
                    success:false,
                    message:err.message
                }   
            }

            return {
                success:true,
                data:expired
            }
        })

        if (!passwordIsValid.success) {
            return res.status(401).json(passwordIsValid)
        }

        // destroy reset payload
        await tblReset.destroy({
            where:{
                email
            }
        })

        const hashedpass = bcryptjs.hashSync(password, 8);

        await modelUser.update({password:hashedpass}, {
            where:{
                email
            }
        })


        return res.json({
            success:true,
            message:"success reset password"
        })

    }
}


module.exports = AuthController