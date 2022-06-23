const Sequelize = require('Sequelize')
const Op = Sequelize.Op;
const { Client } = require("../Models/Client");
const {Order} = require("../Models/Order")
const {OrderItem} = require("../Models/OrderItem")
const {Product} = require("../Models/Product")

//get all orders 
const getAllOrders = async() => {
   return await Order.findAll(
      // {include: ['products']} // to eager load
      )
}

// create new order 
const createOrder = async(clientId,payload,productsIds) => {
  return  await Client.findByPk(clientId).then((client) => {
     return client.createOrder({ClientId:client.id,...payload}).then(order => {
        return Product.findAll({where :{ id:{[Op.or] :productsIds}}})
        .then((products) => {

         return order.addProducts(products.map(product => {
            console.log("Product.id", product.id);
            

               product.orderItem = {kiloPrice:20,productNeededWeight:50,completed:false,delivered:10,productId:1,productName: product.name}
               return product
         }))
          // return order.addProduct(product,{through:{kiloPrice:20,productNeededWeight:50,completed:false,delivered:10,productId:1,productName: "homs"}})
        })
      
     })
   }).catch(error =>{
      console.log(error)
     // return error
   })
   // TODO: موقتا علي ما اذاكر تاني 
}
const getOrderById = async ({clientId,orderId}) => {
   return Client.findByPk(clientId).then((client) => {

      return client.getOrders().then(orders => {
         const order = orders.find(order => order.dataValues.id == orderId)
         // console.log(order)
          return order.getProducts().then((products) => {
               console.log(products)
               return products
            })
            .then((products) => {
               const payload = products.map((product) =>{
                  const tmp = {
                     itemId:product.id,
                     itemName:product.productName,
                     orderDetails: {
                        id:product.orderItem.id,
                        completed: product.orderItem.completed,
                        delivered: product.orderItem.delivered
                     }
                  }
                  return tmp
               })
               //console.log(payload);
               return payload
            })

         

       // return order
   })
   }).catch(error=>{
      console.log(error)
   })
 
}
//TODO not completed 
// i think not useful at all
const getOrderItemsAsProduct = async() => {
   return Client.findByPk(1).then(client => {
      return client.getOrders().then(async(orders) => {
         return  await orders[46].getProducts().then(prod => {
             return prod
          });
         })
      })

}

module.exports = {createOrder, getOrderById,getOrderItemsAsProduct,getAllOrders}