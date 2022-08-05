const {Product} = require('../Models/Product')
const { Material} = require('../Models/Material')
const {WeightAndAmount} = require("../Models/WeightAndAmount")
const {WeightAndAmountMat} = require("../Models/WeightAndAmountMat")


const convertMat = async(materialInfo,productInfo) => {
    const materials = await Material.findAll({where: {enabled: true}})
    const changes = materialInfo.map(async (material)=> {
        const item = await WeightAndAmountMat.findOne({where:{enabled: true, id:material.weightId}})
        if (item == null ) {
            return null
        }else {
            console.log("here");
            const mat = materials.find(m => m.id === material.id)
            item.amount += material.amount
            item.save();
            mat.totalAmount += Number(material.amount);
            mat.totalWeight += (Number(material.amount) * Number(material.weight))
            mat.save()
            return mat
        }
    })
    const tmp = await Promise.all(changes)
    if (tmp.includes(null)){
        console.log("object");
        return {
            message: 'material weight not found',
            code: 404,
        } 
    }else {
        console.log("object");
        return await Promise.all(changes)
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
