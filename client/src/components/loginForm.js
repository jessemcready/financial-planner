import React, { Component } from 'react';
import Wrapper from '../styled_components/wrapper'
import Form from '../styled_components/form'
import Input from '../styled_components/input'
import Button from '../styled_components/button'
import Span from '../styled_components/span'
import Row from '../styled_components/row'
import Header from '../styled_components/header'
// import Table from '../styled_components/table'
// import TD from '../styled_components/td'
// import TH from '../styled_components/th'
// import TR from '../styled_components/tr'
import axios from 'axios';

class MainPage extends Component {
    state = { name: '', email: '', password: '', login: true }

    handleChange = e => this.setState({ [e.target.name]: e.target.value })

    handleSubmit = e => {
        e.preventDefault()
        const { name, email, password, login } = this.state 
        this.setState({ name: '', email: '', password: '' })
        if(login){
            axios.post('http://localhost:3001/api/authenticate', { email, password })
        } else {
            axios.post('http://localhost:3001/api/register', { name, email, password })
        }
    }

    render() {
        const { name, email, password, login } = this.state 
        return (
            <Wrapper>
                <Row borderless>
                    <Form onSubmit={this.handleSubmit} vert>
                        <Header>{ login ? 'Login' : 'Sign Up' } Form</Header>
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
                    <Span onClick={() => this.setState({ login: false })}>{ 
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

export default MainPage