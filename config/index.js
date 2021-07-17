require('dotenv').config()
const env = process.env
module.exports = {
    JWT: env.JWT_SECRET || "LKJ1214",
    PORT: env.PORT || 3001,
    NODE_ENV:env.NODE_ENV || 'development'
}