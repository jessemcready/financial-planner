import React, { Component } from 'react';
import Wrapper from '../styled_components/wrapper'
import Form from '../styled_components/form'
import Input from '../styled_components/input'
import Button from '../styled_components/button'
import Span from '../styled_components/span'
import Row from '../styled_components/row'
import Header from '../styled_components/header'
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class LoginForm extends Component {
    state = { name: '', email: '', password: '', login: true, errors: false }

    handleChange = e => this.setState({ [e.target.name]: e.target.value })

    handleSubmit = e => {
        e.preventDefault()
        const { name, email, password, login } = this.state 
        this.setState({ name: '', email: '', password: '' })
        if(login){
            axios.post('http://localhost:3001/api/authenticate', { email, password })
            .then(res => {
                if(res.data.success){
                    localStorage.setItem('jwt', res.data.token)
                    this.props.history.push({ pathname: '/home' })
                } else {
                    this.setState({ errors: res.data.msg })
                }
            })
        } else {
            axios.post('http://localhost:3001/api/register', { name, email, password })
            .then(res => {
                debugger
                this.props.history.push({ pathname: '/home' })
            })
        }
    }

    render() {
        const { name, email, password, login, errors } = this.state 
        return (
            <Wrapper>
                <Row borderless>
                    <Form onSubmit={this.handleSubmit} vert>
                        <Header>{ login ? 'Login' : 'Sign Up' }</Header>
                        { 
                            errors ? 
                            <Span>{errors}</Span> : 
                            null
                        }
                        { 
                            login ? 
                            null : 
                            <Row borderless>
                                <Input name='name' value={name} onChange={this.handleChange} placeholder='Name' />
                            </Row>
                        }
                        <Row borderless>
                            <Input name='email' value={email} onChange={this.handleChange} placeholder='Email' />
                        </Row>
                        <Row borderless>
                            <Input name='password' type='password' value={password} onChange={this.handleChange} placeholder='Password' />
                        </Row>
                        <Row borderless>
                            <Button type='submit'>{ login ? 'Login' : 'Sign Up' }</Button>
                        </Row>
                    </Form>
                    <Span onClick={() => this.setState({ login: !this.state.login })}>{ 
                        login ?
                        'Click here to sign up' : 
                        'Already have an account? Log in' 
                    }
                    </Span>
                </Row>
            </Wrapper>
        );
    }
}

export default withRouter(LoginForm)