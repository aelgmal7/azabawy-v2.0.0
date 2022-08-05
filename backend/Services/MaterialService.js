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
    const materialM= new MaterialModel(materialName, weightsAndAmountsMat, kiloPrice,unit,alarm)
    // console.log(material);

    const material= await supplier.createMaterial(materialM)
    
    const temp = await  weightsAndAmountsMat.map(async(e) => {
        const a =  await material.createWeightAndAmountMat({weight:e.w,amount:e.a,materialName:material.materialName})
        return  Promise.resolve(a)
    })
    
    console.log(temp);
    const response = {
        material: material,
        weightAndAmountMats: await Promise.all(temp)
    }
    return response
}
const getAllMaterials = async () => {

    try {
        const suppliers = await Supplier.findAll({where: {enabled: true}})
       let materials = await  Material.findAll({where : {enabled: true},include: [{model:WeightAndAmountMat,where: {enabled: true}}]
       })
    //    const weightsAndAmountsMat = await WeightAndAmountMat.findAll({where: {enabled: true}})
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
                supplierName:supplierName,
                weightAndAmountMats: material.weightAndAmountMats.map(item=> {
                    return {
                        id:item.id,
                        w: item.weight,
                        a: item.amount
                }
                })
            }
           return response
        })
        return Promise.all(temp)
    } catch (err) {
        console.log(err)
    }
}
const deleteMaterial= async (materialId)=> {
    const material = await Material.findOne({where: {enabled: true,id: materialId}})
    if (material === null) return {
        message: `no material with id ${materialId}`,
        code : 404
    }
    material.enabled = false
    material.save();
    return material
}
const updateMaterial = async (materialId,materialName,alarm,kiloPrice) => {
    const material = await Material.findOne({where: {id: materialId}})
    if (material === null) return {
        message: `no material with id ${materialId}`,
        code : 404
    }
    material.materialName = materialName;
    material.kiloPrice = kiloPrice;
    material.alarm = alarm;
    material.save();
    return material;
}

const deleteMaterialWeight = async (materialId,weightReq)=> {
    const material = await Material.findOne({where: {enabled: true,id: materialId}})
    if (material === null) return {
        message: `no material with id ${materialId}`,
        code : 404
    }
    const weightAmount = await WeightAndAmountMat.findOne({where:{enabled: true,materialName:material.materialName,weight:weightReq}})
    material.totalAmount -= Number(weightAmount.amount)
    material.totalWeight -= Number(weightAmount.amount) * Number(weightAmount.weight)
    material.save();
    weightAmount.enabled = false
    weightAmount.save();
    return material
}

const changeAmountOfMaterial= async(materialId,weightReq,newAmount) => {
    const material = await Material.findOne({where: {enabled: true,id: materialId}})
    if (material === null) return {
        message: `no material with id ${materialId}`,
        code : 404
    }
    const weightAmount = await WeightAndAmountMat.findOne({where:{enabled: true,materialName:material.materialName,weight:weightReq}})
    material.totalAmount += Number(newAmount)
    material.totalWeight += Number(newAmount) * Number(weightAmount.weight)
    material.save();
    weightAmount.amount += Number(newAmount)
    weightAmount.save();
    return material

}
module.exports = {
    createMaterial :createMaterial,
    getAllMaterials :getAllMaterials,
    deleteMaterial:deleteMaterial,
    updateMaterial:updateMaterial,
    deleteMaterialWeight:deleteMaterialWeight,
    changeAmountOfMaterial:changeAmountOfMaterial

}