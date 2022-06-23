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
        return weightsAndAmounts.map(e => {
            return product.createWeightAndAmount({weight:e.w,amount:e.a,productName:product.productName})
        })
    })

}

const getProducts = () => {
    return Product.findAll({
        where : {enabled: true},
        include: ['weightAndAmounts']
    })
}

const deleteProduct = async (prodId) => {
    try {
        const product = await Product.findOne({ where: { id: prodId } });
        console.log("product>>>", product);
        product.enabled = false;
        return await product.save();
    } catch (err) {
        console.log(err);
    }
}

module.exports ={
    getProducts: getProducts,
    createProduct: createProduct,
    deleteProduct: deleteProduct
}