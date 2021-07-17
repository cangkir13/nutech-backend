const AuthController = require('../controllers/AuthController');
const schemas = require('../middlewares/schemas/SchRegister');
const validate = require('../middlewares/validation/validation');
const JWTMid = require('../middlewares/validation/middlewareJWT'); 
const RegisMid = require('../middlewares/validation/middlewareRegister');

const AuthRoute = [
    
    /**
     * register user 
     */
    {
        method:'post',
        path:'/register',
        middleware:[validate(schemas.register), RegisMid],
        controller:AuthController.register
    },
    /**
     * login / get token access
     */
    {
        method:'post',
        path:'/login',
        middleware:[validate(schemas.login)],
        controller:AuthController.login
    },
    /**
     * REQUEST RESET PASSWORD
     * FORGOT PASSWORD
     */
    {
        method:'post',
        path:'/ForgotPassword',
        middleware:[validate(schemas.ForgotPassword)],
        controller:AuthController.ForgotPassword
    },
    /**
     * RESET PASSWORD
     */
    {
        method:'post',
        path:'/ResetPassword',
        middleware:[validate(schemas.ResetPassword)],
        controller:AuthController.ResetPassword
    }
]

module.exports = AuthRoute