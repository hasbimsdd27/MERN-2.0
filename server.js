const express = require('express')
const app = express()

app.get('/', (req, res) => {
 const {email, amount} = req.body
 res.send({amount, email})
})

app.listen(3000, () => {
    console.log(`server is running on port 3000`)
})
