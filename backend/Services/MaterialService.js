const {  Material } = require("../Models/Material");
const {  Supplier } = require("../Models/Supplier");
const {  WeightAndAmountMat } = require("../Models/WeightAndAmountMat");
const { MaterialModel } = require("../Classes/Material");

const createMaterial =async ({
    materialName,
    weightsAndAmountsMat,
    kiloPrice,
    unit,
    alarm,
    supplierId
}) => {
    
    const supplier = await Supplier.findByPk(supplierId).then(supplier => {

        return supplier
    });
    const ww = await WeightAndAmountMat.findAll().then(ws => {
        console.log(ws)
        return ws
    })
    if (!supplier) {
        return {
            message: `no supplier with id ${supplierId}`,
            code: 404,
        }
    }
    const materialCheck= await Material.findOne({where: {materialName:materialName}})
    if(materialCheck != null) {
        if ( materialCheck.enabled === false) {
            WeightAndAmountMat.findAll({where: {materialName: materialCheck.materialName}}).then((weights) => {
                return weights.map(async(weight) =>{
                   await  weight.destroy();
                    await weight.save();
                })
            })
            await materialCheck.destroy();
            await materialCheck.save();
        }else {
            
            return {
                message: "material already exists",
                code : 500
            }
        }
    }
    const material = new MaterialModel(materialName, weightsAndAmountsMat, kiloPrice,unit,alarm)
    console.log(material);

    const newRecord= await supplier.createMaterial(material).then((material) => {
        const temp =  weightsAndAmountsMat.map(async(e) => {
            return await material.createWeightAndAmountMat({weight:e.w,amount:e.a,materialName:material.materialName})
        })
        return Promise.resolve(temp)
    })
    return await Promise.resolve(newRecord)
}
const getAllMaterials = async () => {

    try {
        const suppliers = await Supplier.findAll({where: {enabled: true}})
       let materials = await  Material.findAll({where : {enabled: true}})
        const temp =  materials.map(async(material) =>{
            const supplierName= suppliers.find((supplier) => supplier.id === material.SupplierId).supplierName
            const response =  {
                id:material.id,
                materialName:material.materialName,
                totalWeight:material.totalWeight,
                totalAmount:material.totalAmount,
                kiloPrice:material.kiloPrice,
                unit:material.unit,
                alarm:material.alarm,
                enabled:material.enabled,
                SupplierId:material.SupplierId,
                supplierName:supplierName
            }
           return response
        })
        return Promise.all(temp)
    } catch (err) {
        console.log(err)
    }
}


module.exports = {
    createMaterial :createMaterial,
    getAllMaterials :getAllMaterials

}