const {Order} = require('../Models/Order')
const {OrderItem} = require('../Models/OrderItem')
const {Product} = require('../Models/Product')
const {Material} = require('../Models/Material')
const {WeightAndAmount} = require('../Models/WeightAndAmount')
const {WeightAndAmountMat} = require('../Models/WeightAndAmountMat')
const { Client } = require("../Models/Client");
const { Supplier } = require("../Models/Supplier");
const {Bill} = require("../Models/Bill");
const {BillItem} = require("../Models/BillItem");
const {BillPay} = require("../Models/BillPay");
const {DirectPay} = require("../Models/DirectPay");
const {ClientLogger} = require("../Models/ClientLogger");


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

    //bill - client
    Client.hasMany(Bill)
    Bill.belongsTo(Client)

    // bill - product
    Bill.belongsToMany(Product,{through:BillItem})
    Product.belongsToMany(Bill,{through:BillItem})

    // bill - billPay
    Bill.hasMany(BillPay)
    BillPay.belongsTo(Bill)

    // billPay - client
    Client.hasMany(BillPay)
    BillPay.belongsTo(Client)

    // DirectPay - client
    Client.hasMany(DirectPay)
    DirectPay.belongsTo(Client)
    
}
