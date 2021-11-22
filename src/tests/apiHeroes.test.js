const assert = require('assert')
const api = require('./../api')
let app = {}

describe('Suite de testes da API Heroes', function() {
    this.timeout(Infinity)

    this.beforeAll(async () => {
        app = await api
    })

    it('listar /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois'
        })
        
        const dados = JSON.parse(result.payload)
        const statusCode = parseInt(result.statusCode)
        

        assert.deepStrictEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })
    it('listar /herois - deve retornar um erro com limit incorreto', async () => {
        const TAMANHO_LIMITE = 'AEEE'
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })        
        
        assert.deepStrictEqual(result.statusCode, 400)
        
    })

    it('listar /herois - deve filter um item', async () => {
        const TAMANHO_LIMITE = 1000
        const NAME = 'Batman'
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}&nome=${NAME}`
        })
        
        const dados = JSON.parse(result.payload)
        
        const statusCode = parseInt(result.statusCode)
        
        assert.deepStrictEqual(statusCode, 200)
        assert.ok(dados[0].nome === NAME)
    })
})