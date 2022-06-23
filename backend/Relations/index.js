const {Order} = require('../Models/Order')
const {OrderItem} = require('../Models/OrderItem')
const {Product} = require('../Models/Product')
const {Material} = require('../Models/Material')
const {WeightAndAmount} = require('../Models/WeightAndAmount')
const {WeightAndAmountMat} = require('../Models/WeightAndAmountMat')
const { Client } = require("../Models/Client");
const { Supplier } = require("../Models/Supplier");


exports.relations =() => {
    //order - orderItem
    Order.hasMany(OrderItem)
    OrderItem.belongsTo(Order)
    
    //product - weights
    Product.hasMany(WeightAndAmount)
    WeightAndAmount.belongsTo(Product)
    //material - weights
    Material.hasMany(WeightAndAmountMat)
    WeightAndAmountMat.belongsTo(Material)

    //Supplier - material
    Supplier.hasMany(Material)
    Material.belongsTo(Supplier)

    // orderItem - product
    Product.belongsToMany(Order,{through:OrderItem})
    Order.belongsToMany(Product,{through:OrderItem})

    //order - client
    Client.hasMany(Order)
    Order.belongsTo(Client)
}
