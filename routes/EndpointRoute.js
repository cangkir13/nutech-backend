/**
 * ROUTE CRUD ENDPOINT
 */

const EndpointController = require('../controllers/GoodsController');
const schemas = require('../middlewares/schemas/SchRegister');
const validate = require('../middlewares/validation/validation');
const JWTMid = require('../middlewares/validation/middlewareJWT'); 
const middlewarePrivate = require('../middlewares/validation/middlewarePrivate');
const multer = require('multer');

function uploadfile(err, req, res, next) {
    if(err) {
        return res.json({
            success : false,
            error:err.message,
        })
    } else {
        return multer({
            storage : multer.diskStorage({
                destination : './assets/images/',
                filename:function (req, file, cb) {
                    console.log(file)
                    cb(null,Date.now()+file.originalname)
                },
                limit: { fileSize: '100' },
                fileFilter:function (req, file, cb) {
                    let fileType = /xlsx|xls|csv/;
                    // let mimetype = fileType.test(file.mimetype)
                    let extname = fileType.test(path.extname(file.originalname).toLowerCase());
                    if (extname) {
                        return cb(null, Date.now()+'_'+file.originalname);
                    }
                    return cb("Error: File upload only support the following filetype - "+ fileType)   
                }
            })
        }).single('image')
    }
}

const AuthRoute = [    
    /**
     * insert new enpooin (microservice) / path 
     */
    {
        method:'post',
        path:'/product',
        middleware:[uploadfile(), validate(schemas.post_product) ],
        controller:EndpointController.post
    },
    /**
     * get all enpoint
     */
    {
        method:'get',
        path:'/product',
        // middleware:[ middlewarePrivate],
        controller:EndpointController.getdata
    },

    /**
     * update endpoint 
     */
    {
        method:'put',
        path:'/product/:id',
        // middleware:[JWTMid, middlewarePrivate, validate(schemas.updateEndpoint)],
        middleware:[ validate(schemas.post_product) ],
        controller:EndpointController.update
    },

    /**
     * get list menu access menu with jwt token
     */
    // {
    //     method:'get',
    //     path:'/endpoint',
    //     middleware:[JWTMid],
    //     controller:EndpointController.getEndpointUser
    // },
   
    /**
     * delete/nonactive endpoint with change status endpoint
     */
    // {
    //     method:'delete',
    //     path:'/endpoint/delete/:id',
    //     middleware:[JWTMid, middlewarePrivate],
    //     controller:EndpointController.delete
    // },

    /**
     * active endpoint with change status endpoint
     */
    // {
    //     method:'post',
    //     path:'/endpoint/active/:id',
    //     middleware:[JWTMid, middlewarePrivate],
    //     controller:EndpointController.Activited
    // },

]

module.exports = AuthRoute