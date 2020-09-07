const express = require("express")
const connectDb = require('./config/db')
const app = express()

//connect db
connectDb()
//init middleware
app.use(express.json({extended: false}))

app.get('/', (req, res) => res.send('API running'))

//define routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))

const PORT = process.env.PORT || 5000

app.listen(PORT)