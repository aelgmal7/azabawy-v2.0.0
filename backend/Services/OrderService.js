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
const createOrder = async(clientId,payload,productsDetails) => {
   const productsIds = productsDetails.map(product => product.id)
   const productsCheck = await Product.findAll({where :{ id:{[Op.or] :productsIds}}})
  return  await Client.findByPk(clientId).then((client) => {
      // validate client existence
      if(client === null) {
        
         return {
            errorCode: 500,
            message: `no client with id ${clientId}`
            }
            // validate products existence 
      }else if(productsCheck.length !== productsIds.length) {
         const missedId = productsIds.map(productId => {
            if(!productsCheck.includes(productId.id )){
               return productId
            }
            return 1
         })
       
         return {
            errorCode: 500,
            message: `no product with id ${missedId}`
            }
      }
      else {

         return client.createOrder({ClientId:client.id,...payload}).then(order => {
            return Product.findAll({where :{ id:{[Op.or] :productsIds}}})
            .then((products) => {
               
               return order.addProducts(products.map(product => {
                  console.log("Product.id", product.id);
                  const {productNeededWeight,completed,delivered} = productsDetails.find(item => item.id === product.id);
                  
               product.orderItem = {kiloPrice:product.kiloPrice,productNeededWeight:productNeededWeight,completed:completed,delivered:delivered,productId:product.id,productName: product.name}
               return product
            })).then(products => {
               return {order,orderItems:products}
            })
          // return order.addProduct(product,{through:{kiloPrice:20,productNeededWeight:50,completed:false,delivered:10,productId:1,productName: "homs"}})
         })
         
      })
   }
   }).catch(error =>{
      console.log(error)
     // return error
   })
   // TODO: موقتا علي ما اذاكر تاني 
}
const getOrderById = async ({clientId,orderId}) => {
   return Client.findByPk(clientId).then((client) => {
      if(client == null) return {
         errorCode: 500,
         message: `no client with id ${clientId}`
         }
      return client.getOrders().then(orders => {

         const order = orders.find(order => order.dataValues.id == orderId)
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
                        delivered: product.orderItem.delivered,
                        productNeededWeight: product.orderItem.productNeededWeight
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
const changeOrderItemsDeliveredWeight = async(clientId,orderId) => {
   return Client.findByPk(clientId).then((client)=> {
      return client.getOrders().then(orders =>{
      const order = orders.find(order => order.dataValues.id == orderId)
      return order.getOrderItems({where: { id:{[Op.or] :[20]}}}).then(items =>{
       
         return items.map(item =>{
            item.delivered = 9;
            item.save();
            return item;       
        })
      })
      })
   })
  
}

module.exports = {createOrder, getOrderById,getOrderItemsAsProduct,getAllOrders,changeOrderItemsDeliveredWeight}