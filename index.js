const express = require('express')
const app = express()
const morgan = require('morgan')

const cors = require('cors')

app.use(cors())

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', function(req, res) {
    return JSON.stringify(req.body)
})

const PORT = process.env.PORT || 3001;

app.use(morgan(':method :url :status :res[content-length] - :response-time :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end();
    }
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> 
    <p>${new Date(Date.now())}</p>`)
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(404).json({
            error: 'name or number field missing'
        })
    }

    const isNameExisting = persons.some(person => person.name === body.name);

    if (isNameExisting) {
        return response.status(404).json({
            error: `name ${body.name} is already available`
        })
    }

    const id = Math.floor(Math.random() * 10000);

    const person = {
        id: id,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person);

    response.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.json(persons)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})