class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {toggle: 'off'};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.setState({toggle: (e === '↓' ? 'off' : 'on')}, ()=>{
      console.log(this.state.toggle);
    });
  }

  render() {
    return (
      <table className="col-lg-10">
        <tbody>
          <Title />
          <Header onFilter={this.handleClick}/>
          <List filter={this.state.toggle} />
        </tbody>
      </table>
    )
  }
}

class Title extends React.Component {
  render() {
    return <th id="title" colspan="4">Leaderboard</th>;
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {thirty: '↓', total: ''};
    this.filterRecent = this.filterRecent.bind(this);
    this.filterAllTime = this.filterAllTime.bind(this);
  }

  filterRecent() {
    this.setState({thirty: '↓', total: ''}, () => {
      this.props.onFilter(this.state.thirty);
    });
  }

  filterAllTime() {
    this.setState({thirty: '', total: '↓'}, () => {
      this.props.onFilter(this.state.thirty);
    });
  }

  render() {
    return (
      <tr>
        <th>#</th>
        <th>Camper Name</th>
        <th onClick={this.filterRecent} style={{color: 'green'}}><u>Points in past 30 days</u>{this.state.thirty}</th>
        <th onClick={this.filterAllTime} style={{color: 'green'}}><u>All time points</u>{this.state.total}</th>
      </tr>
    )
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: ''};
  }

  componentWillMount() {
    var url = (this.props.filter === 'off' ? 'https://fcctop100.herokuapp.com/api/fccusers/top/recent' :'https://fcctop100.herokuapp.com/api/fccusers/top/alltime');
    $.getJSON(url, (data) => {this.setState({data: data});
    })
  }
  
  componentWillReceiveProps(nextProps) {
    var url = (nextProps.filter === 'off' ? 'https://fcctop100.herokuapp.com/api/fccusers/top/recent' :'https://fcctop100.herokuapp.com/api/fccusers/top/alltime');
    $.getJSON(url, (data) => {this.setState({data: data});
    })
  }

  render() {
    console.log('render happening');
    var campers = (this.state.data.length < 1 ? [] : this.state.data);
    var rows = [];
    campers.forEach((camper, i) => {
      rows.push(
      <tr>
        <td>{i+1}</td>
        <td><img src={this.state.data[i].img}/>{this.state.data[i].username}</td>
        <td dangerouslySetInnerHTML = {{__html: this.state.data[i].recent}}/>
        <td dangerouslySetInnerHTML = {{__html: this.state.data[i].alltime}}/>
      </tr>
      )
    });
    return rows;  
  }
}

ReactDOM.render(
  <Container />,
  document.getElementById('root')
)