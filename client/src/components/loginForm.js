import React, { Component } from 'react';
import OuterDiv from '../styled_components/form/outerDiv'
import FlexDiv from '../styled_components/form/flexDiv'
import FormDiv from '../styled_components/form/formDiv'
import Form from '../styled_components/form/form'
import Title from '../styled_components/form/title'
import InputDiv from '../styled_components/form/inputDiv'
import FormInput from '../styled_components/form/formInput'
import ButtonContainerDiv from '../styled_components/form/buttonContainerDiv'
import ButtonDiv from '../styled_components/form/buttonDiv'
import ButtonBackgroundDiv from '../styled_components/form/buttonBackgroundDiv'
import FormButton from '../styled_components/form/formButton'
import FormChangeDiv from '../styled_components/form/formChangeDiv'
import FormChangeSpan from '../styled_components/form/formChangeSpan'
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
            <OuterDiv>
                <FlexDiv>
                    <FormDiv>
                        <Form onSubmit={this.handleSubmit}>
                            <Title>{ login ? 'Login' : 'Sign Up' }</Title>
                            <InputDiv>
                                <FormInput type='text' placeholder='Email' name='email' value={email} onChange={this.handleChange} />
                            </InputDiv>
                            { 
                                login ? 
                                null :
                                <InputDiv> 
                                    <FormInput type='text' name='name' value={name} placeholder='Name' onChange={this.handleChange} />
                                </InputDiv>
                            }
                            <InputDiv>
                                <FormInput type='password' name='password' value={password} placeholder="Password" onChange={this.handleChange} />
                            </InputDiv>
                            <ButtonContainerDiv>
                                <ButtonDiv>
                                    <ButtonBackgroundDiv></ButtonBackgroundDiv>
                                    <FormButton>{ login ? 'Login' : 'Sign Up' }</FormButton>
                                </ButtonDiv>
                            </ButtonContainerDiv>
                            <FormChangeDiv>
                                <FormChangeSpan onClick={() => this.setState({ login: !this.state.login })}>
                                { 
                                    login ?
                                    'Click here to Sign Up' : 
                                    'Already have an account? Log in' 
                                }
                                </FormChangeSpan>
                            </FormChangeDiv>
                        </Form>
                    </FormDiv>
                </FlexDiv>
            </OuterDiv>
        );
    }
}

export default withRouter(LoginForm)