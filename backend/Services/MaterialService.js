const {  Material } = require("../Models/Material");
const {  Supplier } = require("../Models/Supplier");
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