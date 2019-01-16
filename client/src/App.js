import React, { Component, Fragment } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom'
import MainPage from './components/mainPage'
import LoginForm from './components/loginForm'

class App extends Component {
  render() {
    return (
      <Fragment>
        <Switch>
          <Route exact path='/' component={ () => <LoginForm /> } />
          <Route exact path='/home' component={ () => <MainPage /> } />
        </Switch>
      </Fragment>
    )
  }
}

export default withRouter(App);
