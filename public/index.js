class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            total_amount:1000
        }
    }

    render(){
        return <div>
           <h1>Lottery APP WEB 2.0</h1>
           <div>
               <p>Total Lottery amount is {this.state.total_amount}</p>
           </div>
           <form>
<input placeholder="amount"/>
<input placeholder="email"/>
<button>Participate</button>

           </form>
        </div>
    }
}


ReactDOM.render(<App/>, document.getElementById('ReactBinding'));