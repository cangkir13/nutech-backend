'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_goods extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tbl_goods.init({
    name: DataTypes.STRING,
    price_buy: DataTypes.INTEGER,
    price_sell: DataTypes.INTEGER,
    stok: DataTypes.INTEGER,
    image: DataTypes.STRING,
    fullpath : DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'tbl_goods',
  });
  return tbl_goods;
};