require('dotenv').config()
const app = require('./src/app')

const mongoose = require('mongoose');



app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})