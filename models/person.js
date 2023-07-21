const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI


console.log('connecting to', url)

mongoose.connect(url)

  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })

const phoneNumberValidator = {
  validator: function(v) {
    return /^(\d{2,3}-\d{2,})$/.test(v) && v.length >= 8;
  },
  message: props => `${props.value} is not a valid phone number. A valid phone number must have a length of 8 or more, be formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers.`
};

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name field is required'],
    minlength: [5, 'Name must have at least 5 characters']
  },
  number: {
    type: String,
    required: [true, 'Number field is required'],
    validate: phoneNumberValidator
  },
});


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)