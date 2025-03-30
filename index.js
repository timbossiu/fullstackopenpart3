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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

const PORT = process.env.PORT || 3001;

app.use(morgan(':method :url :status :res[content-length] - :response-time :body'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
      })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        response.json(person)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.countDocuments().then(number => 
    response.send(`<p>Phonebook has info for ${number} people</p> 
      <p>${new Date(Date.now())}</p>`)
  )
})

app.post('/api/persons', (request, response) => {
    const body = request.body

  if (!body.name || !body.number) {
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

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.use(errorHandler)