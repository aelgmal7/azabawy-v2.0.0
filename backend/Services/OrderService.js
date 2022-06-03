const { Client } = require("../Models/Client");
const {Order} = require("../Models/Order")
const {OrderItem} = require("../Models/OrderItem")
const {Product} = require("../Models/Product")

const createOrder = async() => {
   return  Order.addProduct()
   // TODO: موقتا علي ما اذاكر تاني 
}
const getOrderById = async ({clientId,orderId}) => {
   return Client.findByPk(clientId).then((client) => {

      return client.getOrders().then(orders => {
         const order = orders.find(order => order.dataValues.id == orderId)
          return order.getProducts().then((products) => {
               //console.log(products)
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
               console.log(payload);
               return payload
            })

         

       // return order
   })
   }).catch(error=>{
      console.log(error)
   })
 
}

module.exports = {createOrder, getOrderById}