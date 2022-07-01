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

    return supplier.createMaterial(material).then((material) => {

        return weightsAndAmountsMat.map(e => {
            return material.createWeightAndAmountMat({weight:e.w,amount:e.a,materialName:material.materialName})
        })
    })
}
const getAllMaterials = async () => {

    try {
       return Material.findAll({where : {enabled: true}})
    } catch (err) {
        console.log(err)
    }
}


module.exports = {
    createMaterial :createMaterial,
    getAllMaterials :getAllMaterials

}