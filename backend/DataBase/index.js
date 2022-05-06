const Sequelize = require('sequelize');
const path = require('path')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, `AzabawyDB.sqlite`)
})

// export default Database
module.exports = {sequelize}
