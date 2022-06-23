const {ProductModel} = require("../Classes/Product")
const {Product} = require("../Models/Product")

const createProduct = ({
    productName,
    weightsAndAmounts,
    kiloPrice,
    alarm,
}) => {
    const product = new ProductModel(
        productName,
        weightsAndAmounts,
        kiloPrice,
         alarm, 
        
    );
    return Product.create(product).then((product) => {
        console.log("asdfgh  gf ",weightsAndAmounts)
        return weightsAndAmounts.map(e => {

            return product.createWeightAndAmount({weight:e.w,amount:e.a,productName:product.productName})
        })
    })

}

const getProducts = () => {
    return Product.findAll()
}

module.exports ={
    getProducts: getProducts,
    createProduct : createProduct
}