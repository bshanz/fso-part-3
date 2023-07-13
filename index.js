const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

// Include the standard 'tiny' format information, plus the body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use(express.static('build'))

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

  app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    
  
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/notes/:id', (request, response) => {
    // Get the ID of the request
    const id = Number(request.params.id)
    // Filter the notes so that they no longer contain that ID
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })


const generateId = () => {
    const randomNumber = Math.floor(Math.random() * 10001);
    return randomNumber
}
  
  app.post('/api/notes', (request, response) => {
    const body = request.body
    console.log(body.content)
    console.log(body.important)
  
    if (!body.content || !body.important) {
      return response.status(400).json({ 
        error: 'content or importance missing' 
      })
    }

    let exists = notes.some(note => note.content === body.content)

    if (exists){
        return response.status(400).json({
            error: "content must be unique"
        })
    }
  
    const note = {
      content: body.content,
      important: body.important || false,
      id: generateId(),
    }
  
    notes = notes.concat(note)
  
    response.json(note)
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)


  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })



