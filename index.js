const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const yaml = require('yamljs');
const swagerUi = require('swagger-ui-express');
const docsApi = yaml.load('./documentation.yml')

const routes = require('./routes')

/**
 * set .env as development || production
 */
const config = require("./config")

// cors API
app.use(cors())
// parsing body json
app.use(express.urlencoded({extended : true}));
app.use(bodyParser.urlencoded( { extended : true}));
app.use(bodyParser.json());

// documentation API
app.use('/document', swagerUi.serve, swagerUi.setup(docsApi));
// LOAD ROUTE
app.use('/api', routes)

// error service
app.use(function (err, req, res, next) {
    console.log(err)
    if (err) {
        return res.status(500).json({
            success:false,
            error:err.message,
            message:'Sory, Something broke'
        })
    }
})

// not found endpoint
app.use(function (req, res, next) {
    res.status(403).json({
        success:false,
        error:'Forbidden',
        message:"No found endpoint"
    })
})

app.listen(config.PORT, () =>{
    console.log(config.PORT)
})