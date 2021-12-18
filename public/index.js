class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            total_amount: 1000,
            amount: '',
            email: '',
        }
    }

    onSubmit = async (e) => {
        e.preventDefault()
        const response = await axios.post('/post_info', {
            amount: this.state.amount,
            email: this.state.email,
        })
        console.log(response)
    }

    async componentDidMount() {
        const result = await axios.get('/get_total_amount')
        this.setState({
            ...this.state,
            total_amount: result.data[0].total_amount,
        })
    }

    render() {
        return (
            <div>
                <h1>Lottery APP WEB 2.0</h1>
                <div>
                    <p>Total Lottery amount is {this.state.total_amount}</p>
                </div>
                <form onSubmit={this.onSubmit}>
                    <input
                        placeholder="amount"
                        value={this.state.amount}
                        onChange={(e) =>
                            this.setState({
                                ...this.state,
                                amount: e.target.value,
                            })
                        }
                    />
                    <input
                        placeholder="email"
                        value={this.state.email}
                        onChange={(e) =>
                            this.setState({
                                ...this.state,
                                email: e.target.value,
                            })
                        }
                    />
                    <button type="submit">Participate</button>
                </form>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('ReactBinding'))
