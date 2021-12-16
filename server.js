const express = require('express')
const app = express()

app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({extended:false, limit:"50mb"}))

app.post('/', (req, res) => {
   const {email, amount} = req.body

   let return_info = {}
   if(amount <=1) {
    return_info.error=true
    return_info.message="The amount should be greater than 1";
    return res.status(400).send(return_info)
   }

   return res.send({email, amount})
})

app.listen(3000, () => {
    console.log(`server is running on port 3000`)
})
