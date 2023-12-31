// This file is no longer used.

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Usage:')
  console.log('To add a person: node mongo.js <password> <name> <number>')
  console.log('To display all people: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://brianshanley24:${password}@phonebook.e241vxt.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})


const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const person = new Person({
    name,
    number
  })

  // person.save().then(result => {
  //   console.log(`added ${name} number ${number} to phonebook`)
  //   mongoose.connection.close()
  // }).catch(error => {
  //   console.log('Error:', error.message);
  //   mongoose.connection.close();
  // });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  }).catch(error => {
    console.log('Error:', error.message);
    mongoose.connection.close();
  });


} else if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
