const express = require('express');
const Router = express.Router()

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const routers = {}

fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    }).forEach((file) => {
        let routes = require(path.join(__dirname, file));
        routers[file] = routes;
    })
 
let setValues = Object.values(routers) ;

let mergeMap = [].concat.apply([], setValues);


module.exports = mergeMap.map((el) => {
    let isArr = Array.isArray(el.middleware)
    if (!el.middleware || !isArr) {
        return Router[el.method](el.path, el.controller)
    }else{
        return Router[el.method](el.path, el.middleware, el.controller)
    }
})