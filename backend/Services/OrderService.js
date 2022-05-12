const { Client } = require("../Models/Client");
const {Order} = require("../Models/Order")
const {OrderItem} = require("../Models/OrderItem")
const {Product} = require("../Models/Product")

const createOrder = async() => {
   return  Order.findAll()
   // TODO: موقتا علي ما اذاكر تاني 
}

module.exports = {createOrder}