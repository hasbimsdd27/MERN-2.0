const express = require('express')
const app = express()
const { handleConnection } = require('./db')
const {
    SAVE_USER_INFORMATION,
    GET_TOTAL_AMOUNT,
    GET_LIST_OF_PARTICIPANTS,
    DELETE_ALL_USERS,
} = require('./models/server_db')
const path = require('path')
const publicPath = path.join(__dirname, './public')
const port = process.env.PORT || 5000
const paypal = require('paypal-rest-sdk')
const session = require('express-session')

paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
})

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false, limit: '50mb' }))
app.use(express.static(publicPath))
app.use(
    session({
        secret: 'my web app',
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: true,
    })
)

app.post('/post_info', async (req, res) => {
    const { email, amount } = req.body

    let return_info = {}
    if (amount <= 1) {
        return_info.error = true
        return_info.message = 'The amount should be greater than 1'
        return res.status(400).send(return_info)
    }
    const fee_amount = amount * 0.9
    const result = await SAVE_USER_INFORMATION({ email, amount: fee_amount })
    req.session.paypal_amount = amount
    const create_payment_json = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal',
        },
        redirect_urls: {
            return_url: `http://localhost:${port}/success`,
            cancel_url: `http://localhost:${port}/cancel`,
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: 'Lottery',
                            sku: 'Funding',
                            price: amount,
                            currency: 'USD',
                            quantity: 1,
                        },
                    ],
                },
                amount: {
                    currency: 'USD',
                    total: amount,
                },
                payee: {
                    email: 'sb-j7gug10140103@personal.example.com',
                },
                description: 'Lottery purchase',
            },
        ],
    }

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log(error)
            return res.status(500).send({ message: error.message })
        } else {
            console.log('Create Payment Response')
            console.log(payment)
            payment.links.forEach((item) => {
                if (item.rel === 'approval_url') {
                    return res.send(item.href)
                }
            })
        }
    })
})

app.get('/success', async (req, res) => {
    const { PayerID, paymentId } = req.query

    const execute_payment_json = {
        payer_id: PayerID,
        transactions: [
            {
                amount: {
                    currency: 'USD',
                    total: req.session.paypal_amount,
                },
            },
        ],
    }

    paypal.payment.execute(paymentId, execute_payment_json, (err, payment) => {
        if (err) {
            console.log(err.response)
            throw err
        } else {
            console.log(payment)
        }
    })

    if (req.session.winner_picked) {
        await DELETE_ALL_USERS()
    }
    req.session.winner_picked = false
    res.redirect(`http://localhost:${port}`)
})

app.get('/get_total_amount', async (req, res) => {
    try {
        const result = await GET_TOTAL_AMOUNT()
        return res.send(result)
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: true, message: error.message })
    }
})

app.get('/pick_winner', async (req, res) => {
    try {
        const result = await GET_TOTAL_AMOUNT()
        const total_amount = result[0].total_amount
        req.session.paypal_amount = total_amount

        const list_of_participants = await GET_LIST_OF_PARTICIPANTS()
        const allParticipants = list_of_participants.map((item) => item.email)
        const winner =
            allParticipants[Math.round(Math.random() * allParticipants.length)]
        req.session.winner_picked = true
        const create_payment_json = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: `http://localhost:${port}/success`,
                cancel_url: `http://localhost:${port}/cancel`,
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: 'Lottery',
                                sku: 'Funding',
                                price: total_amount,
                                currency: 'USD',
                                quantity: 1,
                            },
                        ],
                    },
                    amount: {
                        currency: 'USD',
                        total: total_amount,
                    },
                    payee: {
                        email: winner,
                    },
                    description: 'Lottery purchase',
                },
            ],
        }
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                console.log(error)
                return res.status(500).send({ message: error.message })
            } else {
                console.log('Create Payment Response')
                console.log(payment)
                payment.links.forEach((item) => {
                    if (item.rel === 'approval_url') {
                        return res.redirect(item.href)
                    }
                })
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: true, message: error.message })
    }
})

app.listen(port, () => {
    handleConnection()
    console.log(`server is running on ${port}`)
})
