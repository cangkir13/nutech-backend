const model = require('../models').tbl_goods

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
     * post data product
     * @returns true/false with arrays
     */
    static async post(req, res) {
        let body = req.body
        // console.log(req.file.path)
        
        
        // await model.create(body)
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

}

module.exports = GoodsController