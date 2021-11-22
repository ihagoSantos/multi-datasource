// docker ps
// docker exec -it 7ac6dae9a4ae mongo -u dev -p minhasenhasecreta --authenticationDatabase herois

// Databases
show dbs 
// mudando o contexto para uma database
use herois

// mostrar collections (tabelas)
show collections

// create
db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

for(let i=0; i<=10000; i++){
    db.herois.insert({
        nome: `Clone ${i}`,
        poder: 'Velocidade',
        dataNascimento: '1998-01-01'
    })  
}

// read
db.herois.find()
db.herois.find().pretty()

db.herois.count()
db.herois.findOne()
db.herois.find().limit(1000).sort({ nome: -1 })
db.herois.find({}, {poder: 1, _id: 0})

// update
db.herois.update({ _id: ObjectId('61968fec5c166c9a89d44038')}, { nome: 'Mulher Maravilha'})

db.herois.update({ _id: ObjectId("619690505c166c9a89d4403a")}, 
    { $set: { nome: 'Lanterna Verde'} })

db.herois.update({ poder: 'Velocidade'}, 
    { $set: { poder: 'Super Força'} })

// delete
db.herois.remove({})
db.herois.remove({ nome: 'Mulher Maravilha' })