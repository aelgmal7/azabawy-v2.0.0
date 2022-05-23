const { Client } = require("../Models/Client");
const {Order} = require("../Models/Order")
const {OrderItem} = require("../Models/OrderItem")
const {Product} = require("../Models/Product")

const createOrder = async() => {
   return  Order.addProduct()
   // TODO: موقتا علي ما اذاكر تاني 
}
const getOrderById = async ({clientId,orderId}) => {
   return Client.findByPk(clientId).then(() => {

      return Order.findByPk(orderId).then((order) => {
         let payload = []
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
                              completed: product.orderItem.completed
                           }
                        }
                        return tmp
            })
            return payload
         })
      //    .then((result) => {
      //     console.log("prodooood"+ result)
      //     return payload = result.map((product)=> {
         //       const tmp = {
      //          itemName:product.productName,
      //          orderDetails: {
      //             id:product.orderItem.id,
      //             completed: product.orderItem.completed
      //          }
      //       }
      //       return tmp
      //    })
      //  }).then(result => {
      //     return result
      //  })

      //  console.log('order'+order);
      // if(!order) throw  new Error('no order found with id ' + id);
      
      // return order
   })
   }).catch(error=>{
      console.log(error)
   })
 
}

module.exports = {createOrder, getOrderById}