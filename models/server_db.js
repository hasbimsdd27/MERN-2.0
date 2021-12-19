const { GetDBSession } = require('../db')

const SAVE_USER_INFORMATION = (data) =>
    new Promise((res, rej) => {
        GetDBSession().query(
            'INSERT INTO lottery_information SET ?',
            data,
            (err, results, fields) => {
                if (err) {
                    rej('could not insert into lotery information', err)
                }
                res('Succesful')
            }
        )
    })

const GET_TOTAL_AMOUNT = () =>
    new Promise((res, rej) => {
        GetDBSession().query(
            'SELECT SUM(amount) as total_amount from lottery_information',
            null,
            (err, results, fields) => {
                if (err) {
                    rej('could not get total amount', err)
                }
                res(results)
            }
        )
    })

const GET_LIST_OF_PARTICIPANTS = () =>
    new Promise((res, rej) => {
        GetDBSession().query(
            'SELECT email from lottery_information',
            null,
            (err, results, fields) => {
                if (err) {
                    rej('could not get participant list', err)
                }
                res(results)
            }
        )
    })

const DELETE_ALL_USERS = () =>
    new Promise((res, rej) => {
        GetDBSession().query(
            'DELETE from lottery_information WHERE id >0',
            null,
            (err, results, fields) => {
                if (err) {
                    rej('could not delete all users', err)
                }
                res('success on deleting all users')
            }
        )
    })

module.exports = {
    SAVE_USER_INFORMATION,
    GET_TOTAL_AMOUNT,
    GET_LIST_OF_PARTICIPANTS,
    DELETE_ALL_USERS,
}
