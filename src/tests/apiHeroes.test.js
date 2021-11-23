const assert = require('assert')
const api = require('./../api')
let app = {}
const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
}
const MOCK_HEROI_INICIAL = {
    nome: 'Gavião Negro',
    poder: 'Mira'
}
let MOCK_ID = ''
let MOCK_ID_HEROI_INEXISTENTE = '619bd7093987f02ba87c05d8'

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ilh1eGFkYXNpbHZhIiwiaWQiOjEsImlhdCI6MTYzNzY3NjcwM30.H4Cjyg9oId4yQ1wCsJkgWbJV7dNmFfvtFrzWs4kdyZc'
const headers = {
    Authorization: TOKEN
}
describe('Suite de testes da API Heroes', function() {
    this.timeout(Infinity)

    this.beforeAll(async () => {
        app = await api
        const result = await app.inject({
            headers,
            method: 'POST',
            url: '/herois',
            payload: JSON.stringify(MOCK_HEROI_INICIAL)
        })
        const dados = JSON.parse(result.payload)
        MOCK_ID = dados._id
    })

    it('listar /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois',
            headers
        })
        
        const dados = JSON.parse(result.payload)
        const statusCode = parseInt(result.statusCode)
        

        assert.deepStrictEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })
    it('listar /herois - deve retornar um erro com limit incorreto', async () => {
        const TAMANHO_LIMITE = 'AEEE'
        const result = await app.inject({
            headers,
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
        })        
        
        assert.deepStrictEqual(result.statusCode, 400)
        
    })

    it('listar GET /herois - deve filter um item', async () => {
        const TAMANHO_LIMITE = 1000
        const NAME = 'Batman'
        const result = await app.inject({
            headers,
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}&nome=${NAME}`
        })
        
        const dados = JSON.parse(result.payload)
        
        const statusCode = parseInt(result.statusCode)
        
        assert.deepStrictEqual(statusCode, 200)
        assert.ok(dados[0].nome === NAME)
    })
    it('cadastrar POST /herois', async () => {
        const result = await app.inject({
            headers,
            method: 'POST',
            url: `/herois`,
            payload: JSON.stringify(MOCK_HEROI_CADASTRAR)
        }) 
        
        const statusCode = result.statusCode
        const { message, _id } = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepStrictEqual(message, "Heroi cadastrado com sucesso!")
    })
    it('atualizar PATCH /herois/:id', async () => {
        const _id = MOCK_ID
        const expected = {
            poder: 'Super Mira'
        }
    
        const result = await app.inject({
            headers,
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected)
        }) 
        
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepStrictEqual(dados.message, 'Heroi atualizado com sucesso!')
    })
    it('atualizar PATCH /herois/:id - não deve atualizar com ID incorreto', async () => {
        const _id = MOCK_ID_HEROI_INEXISTENTE
        const expected = {
            poder: 'Super Mira'
        }
    
        const result = await app.inject({
            headers,
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected)
        }) 

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 412)
        assert.deepStrictEqual(dados.message, 'ID não encontrado no banco de dados')
    })
    it('remover DELETE/herois/:id', async () => {
        const _id = MOCK_ID
        const result = await app.inject({
            headers,
            method: "DELETE",
            url: `/herois/${_id}`
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepStrictEqual(dados.message, 'Heroi Removido com sucesso!')
    })
    it('remover DELETE/herois/:id - não deve remover com ID incorreto', async () => {
        const _id = MOCK_ID_HEROI_INEXISTENTE
        const result = await app.inject({
            headers,
            method: "DELETE",
            url: `/herois/${_id}`
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 412)
        assert.deepStrictEqual(dados.message, 'ID não encontrado no banco de dados')
    })
})