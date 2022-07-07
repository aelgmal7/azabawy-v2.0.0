const {Supplier} = require('../Models/Supplier')
const {SupplierModel} = require('../Classes/Supplier')
const {Material} = require('../Models/Material')

const getAllSuppliers = async() => {
    return await Supplier.findAll({where:{enabled: true}})
}
const getSupplierMaterials = async(supplierId) => {
   return await  Supplier.findByPk(supplierId).then(async(supplier)=> {
    if (supplier !== null) {

        return supplier.getMaterials({where: {enabled: true}})
    } else {
        return {
            message :`no supplier with id ${supplierId}`,
            code: 404,
        }
    }

    })
}

const addSupplier = async(payload) => {
    console.log(payload)
    const {supplierName,totalBalance,paid} =payload
    if(supplierName === undefined  || totalBalance === undefined || paid === undefined){ 
        return {
            message:"please enter supplier data right ",
            code: 500,
        }
    }
    const supplier =  new SupplierModel(supplierName,totalBalance,paid)
    
    const temp = await Supplier.findOne({where: {supplierName: supplier.supplierName}})
  if (temp === null) {
    
    return Supplier.create(supplier)
  } 
    if (temp.enabled) return {
      message: "supplier already exists",
      code:404
    }
}

module.exports = {
    getAllSuppliers:getAllSuppliers,
    getSupplierMaterials:getSupplierMaterials,
    addSupplier:addSupplier
}