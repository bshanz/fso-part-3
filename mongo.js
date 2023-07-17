const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

//const password = process.argv[2]
const password = '129ajlzEcNdDf2b0'

const url =
  `mongodb+srv://brianshanley24:${password}@cluster0.um9s28l.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note1 = new Note({
  content: 'HTML is Easy',
  important: true,
})

// note1.save().then(result => {
//   console.log('note saved!')
// })

const note2 = new Note({
  content: 'MongoDB is Awesome',
  important: false,
})

// note2.save().then(result => {
//   console.log('another note saved!')
// }).finally(() => {
//   mongoose.connection.close()
// })

// Note.find({}).then(result => {
//     result.forEach(note => {
//       console.log(note)
//     })
//     mongoose.connection.close()
//   })

  const findNotes = async () =>{
    try {
        const result = await Note.find({})
        result.forEach(note => console.log(note))
    } catch (error) {
        console.log("no notes found")
    } finally{
        mongoose.connection.close()
    }
  }

  findNotes();