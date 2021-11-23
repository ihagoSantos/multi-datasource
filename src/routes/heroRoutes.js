const Joi = require("joi")
const BaseRoute = require("./base/baseRoute")
const Boom = require('boom')

const failAction = (requrest, headers, error) => {
    throw error
}
class HeroRoutes extends BaseRoute{
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config:{
                validate: {
                    // payload -> body
                    // headers -> header
                    // params -> na URL :id
                    // query -> ?skip=10&limit=1000
                    failAction,
                    query: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    })
                }
            },
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query
                    let query = { nome: {$regex: `.*${nome}*.`} }
                    
                    return this.db.read(query, skip, limit)    
                } catch (error) {
                    console.log('DEU RUIM', error)
                    return Boom.internal()
                }
            }
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                validate: {
                    failAction,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(2).max(100),
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { nome, poder } = request.payload
                    const result = await this.db.create({ nome, poder })
                    return {
                        message: "Heroi cadastrado com sucesso!",
                        _id: result._id
                    }

                } catch (error) {
                    console.log('DEU RUIM', error)
                    return Boom.internal()
                }
            }
        }
    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                validate: {
                    failAction,
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(100),
                    }
                }
            },
            handler: async (request) => {
                try {
                    const {id} = request.params
                    const {payload} = request
                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)

                    const result = await this.db.update(id, dados)
                    if(result.modifiedCount !== 1) return Boom.preconditionFailed('ID não encontrado no banco de dados')
                    
                    return {
                        message: 'Heroi atualizado com sucesso!'
                    }
                } catch (error) {
                    console.error('DEU RUIM', error)
                    return Boom.internal()
                }
            }
        }
    }
    delete() {
        return {
            path: '/herois/{id}',
            method: 'DElETE',
            config: {
                validate: {
                    failAction,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    const {id} = request.params
                    const result = await this.db.delete(id)
                    

                    if(result.deletedCount !== 1) return Boom.preconditionFailed('ID não encontrado no banco de dados')

                    return {
                        message: 'Heroi Removido com sucesso!'
                    }
                } catch (error) {
                    console.error('DEU RUIM', error)
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = HeroRoutes