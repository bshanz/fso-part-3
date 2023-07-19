require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const person = require('./models/person')

app.use(cors())

app.use(express.json())

app.use(express.static('dist'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

// Include the standard 'tiny' format information, plus the body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

  app.use(requestLogger)

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    console.log("found")
    response.json(persons)
  })
})

app.get('/api/info', (request, response) => {
  const requestReceivedAt = new Date();
  console.log(requestReceivedAt);

  Person.countDocuments({})
    .then(count => {
      response.send(
        `<p>Phonebook has info for ${count} people</p>`
        + `<p>Request received at: ${requestReceivedAt}</p>`
      );
    })
    .catch(err => {
      console.log('Error counting documents:', err);
      response.status(500).json(err);
    });
});

app.get('/api/persons/:id', async (request, response, next) => {
  const id = request.params.id;

  try {
      const person = await Person.findById(id);

      if (person) {
          response.json(person);
      } else {
          response.status(404).end();
      }
  } catch (error) {
      console.log(error);
      next(error);
  }
});


  app.get('/api/person/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })
  

//   const generateId = () => {
//     const maxId = notes.length > 0
//       ? Math.max(...notes.map(n => n.id))
//       : 0
//     return maxId + 1
//   }

const generateId = () => {
    const randomNumber = Math.floor(Math.random() * 10001);
    return randomNumber
}
  
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error)) // When there's an error, pass it to the next middleware (errorHandler)
})

// Handle requests that aren't handled by other routes or middleware functions
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'MongoError' && error.code === 11000) {
    return response.status(400).send({ error: 'duplicate field value' })
  }

  return response.status(500).send({ error: 'something went wrong' })
}


// This should be the last piece of middleware in the file
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
