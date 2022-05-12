const {Order} = require('../Models/Order')
const {OrderItem} = require('../Models/OrderItem')
const {Product} = require('../Models/Product')
const { Client } = require("../Models/Client");


exports.relations =() => {
    //order - orderItem
    Order.hasMany(OrderItem)
    OrderItem.belongsTo(Order)
    
    // orderItem - product
    Product.belongsToMany(Order,{through:OrderItem})
    Order.belongsToMany(Product,{through:OrderItem})

    //order - client
    Client.hasMany(Order)
    Order.belongsTo(Client)
}
