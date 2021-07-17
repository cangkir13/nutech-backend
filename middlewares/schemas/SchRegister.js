const joi = require('joi')

module.exports = {
    // register user
    register: joi.object({
        email:joi.string().email().required(),
        username:joi.string().required(),
        password: joi.string().min(3).max(15).required(),
        password_confirmation: joi.any().equal(joi.ref('password')).required(),
        role:joi.string().required()
    }),

    // login
    login: joi.object({
        email:joi.string().required(),
        password: joi.string().min(3).max(15).required(),
    }),

    // request reset password
    ForgotPassword:joi.object({
        email:joi.string().email().required()
    }),

    // RESET PASSWORD
    ResetPassword:joi.object({
        token:joi.string().required(),
        email:joi.string().email().required(),
        password: joi.string().min(3).max(15).required(),
        password_confirmation: joi.any().equal(joi.ref('password')).required(),
    }),

    // schemas get access point
    accessUser: joi.object({
        method: joi.string().valid("POST", "GET", "DELETE", "PUT").required(),
        path: joi.array().required(),
    }),

    // schemas create product
    post_product : joi.object({
        name : joi.string().required(),
        price_buy : joi.number().required(),
        price_sell : joi.number().greater(joi.ref('price_buy')).required(),
        stok : joi.number().required()
    })
}