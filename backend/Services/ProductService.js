const {ProductModel} = require("../Classes/Product")
const {Product} = require("../Models/Product")
const {WeightAndAmount} = require("../Models/WeightAndAmount")

const createProduct = async({
    productName,
    weightsAndAmounts,
    kiloPrice,
    alarm,
    type
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
         type
        
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
        const product = await Product.findOne({ where: { id: prodId,enabled: true } });
        if (product === null) return {
            message:`no product with id ${prodId}`,
            code: 404
        }
        console.log("product>>>", product);
        product.enabled = false;
        return await product.save();
    } catch (err) {
        console.log(err);
    }
}
const addNewWeightToProduct = async (productId,weight,amount) => {
    console.log(productId,weight,amount);
    return Product.findOne({where: {enabled: true,id: productId}}).then((product) => {
        return product.createWeightAndAmount({weight:weight,amount:amount,productName:product.productName})
    }).then(async(weightAndAmount) => {
        const p = await Product.findOne({where: {enabled: true,id: productId}})
        console.log(weightAndAmount)
        p.totalAmount += Number(weightAndAmount.amount);
        p.totalWeight += (Number(weightAndAmount.weight) * Number(weightAndAmount.amount));
        console.log(p.totalAmount,p.totalWeight)
        p.save();
        return p
    })
}
const updateProduct = async (productId,productName,alarm,kiloPrice) => {
    try{
        const p = await Product.findOne({where: {id: productId , enabled: true}})
        if(p === null){
            return {
                message:`no product with id ${productId}`,
                code: 404
            }
        }
        p.productName = productName;
        p.alarm = alarm;
        p.kiloPrice = kiloPrice;
        p.save();
        return p;
    }catch (err) {
        console.log(err)
    }

}
const changeAmountOfWeight = async(productId,weight,newAmount) => {

    const p = await Product.findOne({where: {id: productId , enabled: true}})
    if(p === null){
        return {
            message:`no product with id ${productId}`,
            code: 404
        }
    }
    const w = await WeightAndAmount.findOne({where: {productName: p.productName, weight:weight,enabled: true}})
    if(w === null){
        return {
            message:`no weight with for product ${p.productName} equals ${weight}`,
            code: 404
        }
    }
    try {
        w.amount += Number(newAmount)
        p.totalAmount += Number(newAmount);
        p.totalWeight += (Number(newAmount) * Number(weight))
        w.save();
        p.save();
        return p;
    }catch (err) {
        console.error(err)
    }
}


module.exports ={
    getProducts: getProducts,
    createProduct: createProduct,
    deleteProduct: deleteProduct,
    deleteProductWeight:deleteProductWeight,
    addNewWeightToProduct:addNewWeightToProduct,
    updateProduct:updateProduct,
    changeAmountOfWeight:changeAmountOfWeight
}