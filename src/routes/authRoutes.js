const Joi = require("joi")
const BaseRoute = require("./base/baseRoute")
const Boom = require('boom')

// npm install jsonwebtoken
const Jwt = require('jsonwebtoken')

const failAction = (requrest, headers, error) => {
    throw error
}
const USER = {
    username: 'xuxadasilva',
    password: '123'
}

class AuthRoutes extends BaseRoute{
    
    constructor(secret) {
        super()
        this.secret = secret
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                validate: {
                    failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { username, password } = request.payload

                    if(username.toLowerCase() !== USER.username || password !== USER.password) {
                        return Boom.unauthorized()
                    } 

                    const token = Jwt.sign({
                        username,
                        id: 1
                    }, this.secret)

                    return {
                        token
                    }
                } catch (error) {
                    console.error('DEU RUIM', error)
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = AuthRoutes