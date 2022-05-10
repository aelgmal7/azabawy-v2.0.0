const {ProductModel} = require("../Classes/Product")
const {Product} = require("../Models/Product")

const createProduct = ({
    productName,
    amounts,
    weights,
    unit,
    alarm,
    supplierName
}) => {
    const product = new ProductModel(
        productName,
         amounts,
         weights,
         unit, 
         alarm, 
         supplierName
    );
    return Product.create(product)

}

const getProducts = () => {
    return Product.findAll()
}

module.exports ={
    getProducts: getProducts,
    createProduct : createProduct
}