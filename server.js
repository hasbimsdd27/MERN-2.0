const express = require('express')
const app = express()
const {handleConnection} = require("./db")
const {SAVE_USER_INFORMATION, GET_TOTAL_AMOUNT} = require('./models/server_db')
const path = require('path')
const publicPath = path.join(__dirname, './public')

app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({extended:false, limit:"50mb"}))
app.use(express.static(publicPath))

app.post('/', async (req, res) => {
   const {email, amount} = req.body

   let return_info = {}
   if(amount <=1) {
    return_info.error=true
    return_info.message="The amount should be greater than 1";
    return res.status(400).send(return_info)
   }
  const result = await SAVE_USER_INFORMATION({email, amount})
   return res.send(result)
})

app.get('/get_total_amount', async (req, res)=>{
    try {
        const result = await GET_TOTAL_AMOUNT()
        return res.send(result)
    } catch (error) {
        console.log(error)
        return res.status(500).send({error:true, message:error.message})
    }
     
})

app.listen(3000, () => {
    handleConnection()
    console.log(`server is running on port 3000`)
})
