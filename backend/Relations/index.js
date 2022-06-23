const {Order} = require('../Models/Order')
const {OrderItem} = require('../Models/OrderItem')
const {Product} = require('../Models/Product')
const {WeightAndAmount} = require('../Models/WeightAndAmount')
const { Client } = require("../Models/Client");


exports.relations =() => {
    //order - orderItem
    Order.hasMany(OrderItem)
    OrderItem.belongsTo(Order)
    //product - weights
    Product.hasMany(WeightAndAmount)
    WeightAndAmount.belongsTo(Product)
    // orderItem - product
    Product.belongsToMany(Order,{through:OrderItem})
    Order.belongsToMany(Product,{through:OrderItem})

    //order - client
    Client.hasMany(Order)
    Order.belongsTo(Client)
}
