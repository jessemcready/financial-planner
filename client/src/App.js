import React, { Component } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom'
import MainPage from './components/mainPage'
import LoginForm from './components/loginForm'

class App extends Component {
  componentDidMount() {
    if(localStorage.getItem('jwt')){
      this.props.history.push({pathname: '/home'})
    }
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={ () => <LoginForm /> } />
          <Route exact path='/home' component={ () => <MainPage /> } />
        </Switch>
      </div>
    )
  }
}

export default withRouter(App);
