const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

// Include the standard 'tiny' format information, plus the body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


// let notes = [
//     {
//       id: 1,
//       content: "HTML is easy",
//       important: true
//     },
//     {
//       id: 2,
//       content: "Browser can execute only JavaScript",
//       important: false
//     },
//     {
//       id: 3,
//       content: "GET and POST are the most important methods of HTTP protocol",
//       important: true
//     }
//   ]

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

  app.use(requestLogger)

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
    const requestReceivedAt = new Date();
    console.log(requestReceivedAt);

    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>`
        + `<p>Request received at: ${requestReceivedAt}</p>`
    );
});


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    // Get the ID of the request
    const id = Number(request.params.id)
    // Filter the notes so that they no longer contain that ID
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
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
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body.name)
    console.log(body.number)
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }

    let exists = persons.some(person => person.name === body.name)

    if (exists){
        return response.status(400).json({
            error: "name must be unique"
        })
    }
  
    const person = {
      name: body.name,
      number: body.number || false,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



