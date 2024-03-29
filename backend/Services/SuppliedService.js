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

const deleteSupplier = async(supplierId)=> {
    return Supplier.findOne({where: {id:supplierId,enabled: true}}).then((supplier)=> {
        if(!supplier) {
            return {
                message: `no supplier with id ${supplierId}`,
                code:404
            }
        }
        supplier.enabled = false
        supplier.save()
        return supplier
    })
}
const updateSupplier = async (supplierId,supplierName,totalBalance,paid) => {
    return Supplier.findOne({where: {id:supplierId,enabled: true}})
    
    .then((supplier)=> {
        if(!supplier) {
            return {
                message: `no supplier with id ${supplierId}`,
                code:404
            }
        }
        supplier.supplierName = supplierName || supplier.supplierName
        supplier.totalBalance = totalBalance;
        supplier.paid = paid
        supplier.remain = Number(totalBalance) - Number(paid)
        supplier.save()
        return supplier
    })
}
module.exports = {
    getAllSuppliers:getAllSuppliers,
    getSupplierMaterials:getSupplierMaterials,
    addSupplier:addSupplier,
    deleteSupplier:deleteSupplier,
    updateSupplier:updateSupplier
}