const model = require('../models').tbl_goods
const fs = require('fs')
const path = require('path')
class GoodsController {

    /**
     * get data 
     * @returns arrays
     */
    static async getdata(req, res) {
        const data = await model.findAll()
        return res.json({
            success: true,
            result : data
        })
    }

    /**
     * get one data
     * @returns object
     */
     static async getOne(req, res) {
        let {id} = req.params
        const data = await model.findOne({
            where : {id}
        })
        
        if (!data) {
            return res.status(404).json({
                success : false,
                message : "not found"
            })
        }
        return res.json({
            success: true,
            result : data
        })
    }

    /**
     * post data product
     * @returns true/false with arrays
     */
    static async post(req, res) {
        let body = req.body
        body.image = req.file.filename
        body.fullpath = "assets/images/"+req.file.filename
        
        await model.create(body)
        return res.json({
            success : true,
            message : "data has been created"
        })
    }

    /**
     * update product
     * @return true/false
     */
    static async update(req, res) {
        let {id} = req.params
        let body = req.body
        body.image = "assets/images/"+req.file.filename
        try {
            let find = await model.findOne({
                where: {
                    id : id
                }
            })
    
            if(!find) {
                return res.json({
                    success : false,
                    message : "data not found"
                })
            }
    
            await model.update(body, {
                where: {
                    id : id
                }
            })
    
            return res.json({
                success : true,
                message : "data has been updated",
            })
        } catch (error) {
            return res.json({
                success : false,
                message : error
            })
        }
    }

    static async deleteOne(req, res) {
        let {id} = req.params
        const find = await model.findOne({
            where : {id}
        })

        if (!find) {
            return res.json({
                success : false,
                message : 'id Not found'
            })
        }

        await find.destroy();
        return res.json({
            success : true,
        })
    }

    static async view(req, res) {
        try {
            let image = req.params.img
            let findOne = await model.findOne({
                where: {
                    image
                }
            })
            
            
            if ( findOne) {
                let imageShow = path.join(__dirname, "../"+findOne.fullpath) ;
                
                if (fs.existsSync(imageShow)) {    
                    res.sendFile(imageShow);    
                } else {
                    res.status(404).send(
                        'image not found'
                    )    
                }
            } else {
                res.status(404).send('image not found')
            }
        } catch (error) {
            console.log(error)
            res.status(400).send('error on our server')
        }
    }
}

module.exports = GoodsController