const {Product} = require('../Models/Product')
const { Material} = require('../Models/Material')
const {WeightAndAmount} = require("../Models/WeightAndAmount")
const {WeightAndAmountMat} = require("../Models/WeightAndAmountMat")
const {createLog} = require('./LogService')

const convertMat = async(materialInfo,productInfo) => {
    const materials = await Material.findAll({where: {enabled: true}})
    const products = await Product.findAll({where: {enabled: true}})
    // material changes
    const materialChanges = materialInfo.map(async (material)=> {
        const item = await WeightAndAmountMat.findOne({where:{enabled: true, id:material.weightId}})
        if (item == null ) {
            return null
        }else {
            const mat = materials.find(m => m.id === material.id)
            //for logs
            const oldAmount = item.amount
            item.amount -= material.amount
            item.save();
            mat.totalAmount -= Number(material.amount);
            mat.totalWeight -= (Number(material.amount) * Number(material.weight))
            createLog(new Date(),material.materialName,"عملية تحويل مادة خام ل منتج" ,item.weight,oldAmount,item.amount,(item.amount - oldAmount))
            mat.save()
            return mat
        }
    })

    // product changes
    const prod = products.find(i => i.id == productInfo.id)
    if (!prod) return {
        message: 'Product not found',
        code: 404,
    }
    const productChanges = productInfo.weightsAndAmounts.map(async(weightAmount)=> {
        const item = await WeightAndAmount.findOne({where: {enabled: true,productName:productInfo.productName,weight: weightAmount.weight}})
        if (item == null ) {
            return null
        }else {
            const oldAmount = item.amount
        item.amount += weightAmount.amount;
        item.save();
        prod.totalAmount += Number(weightAmount.amount);
        prod.totalWeight += (Number(weightAmount.amount) * Number(weightAmount.weight))
        createLog(new Date(),prod.productName,"انتاج المنتج" ,item.weight,oldAmount,item.amount,(item.amount - oldAmount))

        prod.save()
        return prod
        }
    })

    const matTmp = await Promise.all(materialChanges)
    const prodTmp = await Promise.all(productChanges)
    if (matTmp.includes(null) || prodTmp.includes(null)){
        return {
            message: 'some weights of materials or product not found',
            code: 500,
        } 
    }else {
        return {
            matTmp,
            prodTmp
        }
    }
    // console.log(await Promise.all(changes));

}

module.exports = {
    convertMat
}

// class p  {
//     materialInfo = [
//         {
//             id,
//             materialName,
//             weight,
//             amount,
//             weightId
//         },
//     ]
//         productInfo = {
//             id,
//             productName,
//             weightsAndAmounts : [
//                 {
//                     weight,
//                     amount,
//                 }
//             ]
//         }
// }
