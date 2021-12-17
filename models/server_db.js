const {GetDBSession} = require('../db')

 const SAVE_USER_INFORMATION = (data) => new Promise((res, rej)=>{
     GetDBSession().query('INSERT INTO lottery_information SET ?', data, (err, results, fields)=>{
        if(err){
            rej('could not insert into lotery information', err)
        }
        res('Succesful')
    })
})

const GET_TOTAL_AMOUNT = () => new Promise((res, rej)=>{
    GetDBSession().query('SELECT SUM(amount) as total_amount from lottery_information', null, (err, results, fields)=>{
       if(err){
           rej('could not get total amount', err)
       }
       res(results)
   })
})


module.exports = {SAVE_USER_INFORMATION, GET_TOTAL_AMOUNT}