require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

const cors = require('cors')

app.use(cors())

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', function(req, res) {
    return JSON.stringify(req.body)
})

const PORT = process.env.PORT || 3001;

app.use(morgan(':method :url :status :res[content-length] - :response-time :body'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
      })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
      })
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> 
    <p>${new Date(Date.now())}</p>`)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

  if (!body.content || !body.number) {
    return response.status(400).json({ error: 'missing one of those fields: name, number' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.json(persons)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})