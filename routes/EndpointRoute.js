/**
 * ROUTE CRUD ENDPOINT
 */

const EndpointController = require('../controllers/GoodsController');
const schemas = require('../middlewares/schemas/SchRegister');
const validate = require('../middlewares/validation/validation');
const JWTMid = require('../middlewares/validation/middlewareJWT'); 
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
        middleware:[JWTMid, uploadfile(), validate(schemas.post_product) ],
        controller:EndpointController.post
    },
    /**
     * get all enpoint
     */
    {
        method:'get',
        path:'/product',
        middleware:[ JWTMid],
        controller:EndpointController.getdata
    },

    {
        method:'get',
        path:'/product/:id',
        middleware:[JWTMid],
        controller:EndpointController.getOne
    },

    /**
     * update endpoint 
     */
    {
        method:'put',
        path:'/product/:id',
        middleware:[JWTMid, uploadfile(), validate(schemas.post_product) ],
        controller:EndpointController.update
    },

    /**
     * get list menu access menu with jwt token
     */
    {
        method:'delete',
        path:'/product/:id',
        middleware:[JWTMid],
        controller:EndpointController.deleteOne
    },

    {
        method:'get',
        path:'/image/:img',
        controller:EndpointController.view
    }
]

module.exports = AuthRoute