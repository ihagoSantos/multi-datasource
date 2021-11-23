// npm install hapi
// npm i vision inert hapi-swagger
// npm i hapi-auth-jwt2
const Hapi = require("hapi")
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema')
const HeroRoute = require('./routes/heroRoutes')
const AuthRoute = require('./routes/authRoutes')
const HapiJwt = require('hapi-auth-jwt2')

const app = new Hapi.Server({
    port: 5000
})

const JWT_SECRET = 'MEU_SEGREDÃO_123'

function mapRoutes(instance, methods) {
    return methods.map(method => {
        return instance[method]()
    })
}

async function main() {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroiSchema))
    
    await app.register([
        HapiJwt
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // }
        validate: (dado, request) => {
            // verifica no banco se o usuário continua ativo
            // verifica no banco se o usuário continua pagando

            return {
                isValid: true // caso não válido -> false
            }
        }
    })
    
    app.auth.default('jwt')

    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET), AuthRoute.methods())
    ])
    
    await app.start()
    console.log('Servidor rodando na porta', app.info.port)

    return app
}
module.exports = main()