const ICrud = require('../interfaces/interfaceCrud')
const Sequelize = require('sequelize')

class Postgres extends ICrud {
    constructor(connection, schema){
        super()
        this._connection = connection
        this._schema = schema
    }

    async isConnected(){
        try {
            await this._connection.authenticate()
            return true
        } catch (error) {
            console.log('fail!', error)
            return false
        }
    }

    static async connect() {
        const connection = new Sequelize(
            'heroes',
            'root',
            'root',
            {
                host: 'localhost',
                dialect: 'postgres',
                quoteIdentifiers: false,
                // operatorsAliases: false,
                logging: false
            }
        )    
        return connection
    }

    static async defineModel(connection, schema) {
        
        const model = connection.define(
            schema.name,
            schema.schema,
            schema.options
        )
        await model.sync()
        return model
    }

    async create(item) {
        const {dataValues} = await this._schema.create(item)
        return dataValues
    }

    async read(query = {}) {
        return this._schema.findAll({ where: query, raw: true })

    }
    async update(id, item) {
        const result = await this._schema.update(item, {
            where: { id: id}
        })

        return result
    }
    async delete(id) {
        const query = id ? { id } : {}
        return this._schema.destroy({ where: query })
    }
}

module.exports = Postgres