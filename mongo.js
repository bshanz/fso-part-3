const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

//const password = process.argv[2]
const password = '129ajlzEcNdDf2b0'

const url =
  `mongodb+srv://brianshanley24:${password}>@cluster0.um9s28l.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person1 = new Person({
  name: 'Fred',
  number: 201,
})

person1.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})