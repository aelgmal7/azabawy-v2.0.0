const {ProductModel} = require("../Classes/Product")
const {Product} = require("../Models/Product")
const {WeightAndAmount} = require("../Models/WeightAndAmount")

const createProduct = async({
    productName,
    weightsAndAmounts,
    kiloPrice,
    alarm,
}) => {
    const p =await Product.findOne({where: {productName: productName}})
    if(p != null) {
        if ( p.enabled === false) {
            WeightAndAmount.findAll({where: {enabled:true,productName: p.productName}}).then((weights) => {
                return weights.map((weight) =>{
                    weight.destroy();
                    weight.save();
                })
            })
            p.destroy();
            p.save();
        }else {
            
            return {
                message: "product already exists",
                code : 500
            }
        }
    }
    console.log('p :>> ', p);
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
        include: [{model:WeightAndAmount,where: {enabled: true}}]
    })
}
const deleteProductWeight = async(productId,weightReq) => {
    try{

        const product = await Product.findOne({where: {enabled: true,id: productId}, include: [{model:WeightAndAmount,where: {enabled: true}}]}).then((product) => {
            return product
        })
        if (product === null) return {
            message: `no product with id ${productId}`,
            code: 404
        }
        return WeightAndAmount.findOne({where: {enabled: true,productName: product.productName,weight:weightReq}}).then((weight) => {
           if ( weight === null ) return {
            message: `no weight equals ${weightReq} to product ${product.productName}`,
            code:404
           } 
            weight.enabled = false;
            WeightAndAmount.findAll({where: {enabled:true,productName: product.productName}}).then((weights) => {
                const tmpTotalWeights= weights.map(weight =>{
    
                 return  weight.weight * weight.amount
                }
                )
                const tmpAmounts = weights.map(weight => weight.amount)
                const totalAmount = tmpAmounts.reduce((total,amount) =>{
                    return total + amount
                })
                const totalWeight = tmpTotalWeights.reduce((total,weight) =>{
                    return total + weight
                })
                product.totalAmount = totalAmount;
                product.totalWeight = totalWeight;
                product.save();
            })
            weight.save()
            return weight;
        })
    }
    catch(err){
        console.log(err)
    }
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
    deleteProduct: deleteProduct,
    deleteProductWeight:deleteProductWeight
}