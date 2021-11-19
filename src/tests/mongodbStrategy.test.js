const assert = require('assert')
const MongoDb = require('./../db/strategies/mongodb')
const Context = require('./../db/strategies/base/contextStrategy')

const MOCK_HEROI_CADASTRAR = {
    nome: 'Mulher Maravilha',
    poder: 'Laço'
}
const MOCK_HEROI_ATUALIZAR = {
    nome: `PATOLINO-${Date.now()}`,
    poder: 'Velocidade'
}
let MOCK_HEROI_ID = ''

const context = new Context(new MongoDb())
describe('MongoDb suite de testes', function() {
    this.timeout(Infinity)

    this.beforeAll(async () => {
        await context.connect()
        const result = await context.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ID = result._id
    })
    it('verificar conexao', async () => {
        const result = await context.isConnected()
        const expected = 'Conectado'

        assert.deepStrictEqual(result, expected)
    })
    it('cadastrar', async () => {
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR)
        
        assert.deepStrictEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })
    it('listar', async () => {
        const [{ nome, poder }] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome })
        
        assert.deepStrictEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })
    it('atualizar', async () => {
        const result = await context.update(MOCK_HEROI_ID, {
            nome: 'Pernalonga'
        })

        assert.deepStrictEqual(result.modifiedCount, 1)
    })
    it('remover', async () => {
        const result = await context.delete(MOCK_HEROI_ID)
        
        assert.deepStrictEqual(result.deletedCount, 1)

    })
})