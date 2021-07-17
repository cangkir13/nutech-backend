const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET || "test"

module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization
        // CHECK HEADER AUTHORIZATION
        if (!token) {
            return res.status(401).json({
                success:false,
                error:"No token authorize",
                message:"header must be with 'authorization' : 'Bearer tokenxxx'"
            })
        }

        token = token.split(" ")[1]
        // JWT VERIFY
        let tokenValid = jwt.verify(token, jwtSecret, (err, expired) => {
            if (err) { 
                return {
                    success:false,
                    message:err.message,
                    token: false
                }   
            }

            return {
                success:true,
                data:expired
            }
        })
        // CHECK JWT VERIFY
        if (!tokenValid.success) {
            return res.status(401).json(tokenValid)
        }

        req.user = tokenValid
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}