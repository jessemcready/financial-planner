import React, { Component, Fragment } from 'react';
import Wrapper from '../styled_components/wrapper'
import Row from '../styled_components/row'
import Form from '../styled_components/form'
import Input from '../styled_components/input'
import Button from '../styled_components/button'
import CancelButton from '../styled_components/cancelButton'
import Header from '../styled_components/header'
import Span from '../styled_components/span'
import Table from '../styled_components/table'
import TD from '../styled_components/td'
import TH from '../styled_components/th'
import TR from '../styled_components/tr'
import Side from '../styled_components/side'
import MainWrap from '../styled_components/mainWrap'
import NavBar from '../components/navbar'
import axios from 'axios';
import { withRouter } from 'react-router-dom'

class MainPage extends Component {
    state = {
        data: [],
        user: {},
        salary: '',
        id: 0,
        originalName: '',
        originalPrice:'',
        name: '',
        price: '',
        expenseTotal: 0,
        intervalIsSet: false,
        editing: false
      }
    
      componentDidMount(){
        if(!localStorage.getItem('jwt')){
            this.props.history.push({ pathname: '/' })
        }
        this.getDataFromDb() 
        if(!this.state.intervalIsSet){
          let interval = setInterval(this.getDataFromDb, 1000) 
          this.setState({ intervalIsSet: interval }) 
        }
        if(!!localStorage.getItem('salary')){
          this.setState({ salary: localStorage.getItem('salary')})
        }
      }

      handleLogOut = () => {
        if(this.state.intervalIsSet){
          clearInterval(this.state.intervalIsSet)
          this.setState({ intervalIsSet: null })
        }
      }
    
      componentWillUnmount(){
        if(this.state.intervalIsSet){
          clearInterval(this.state.intervalIsSet)
          this.setState({ intervalIsSet: null })
        }
      }
    
      getDataFromDb = () => {
        fetch('http://localhost:3001/api/profile', {
            headers: { 'Authorization': `${localStorage.getItem('jwt')}` }
        }).then(data => data.json())
          .then(res => {
              this.setState({ 
                  data: res.user.expenses, 
                  user: res.user, 
                  expenseTotal: this.total(res.user.expenses) 
                })
            })
      }
    
      total = data => {
        let expenseTotal = 0
        data.forEach(expense => expenseTotal += expense.price)
        return expenseTotal
      }
    
      putDataToDB = (name, price) => {
        let currentIds = this.state.data.map(data => data.id)
        let idToBeAdded = 0
        while(currentIds.includes(idToBeAdded)){
          ++idToBeAdded
        }
        axios.post('http://localhost:3001/api/putData',{
          id: idToBeAdded,
          name: name,
          price: price,
          email: this.state.user.email
        })
      }
    
      deleteFromDB = () => {
        const { name, price } = this.state
        axios.delete('http://localhost:3001/api/deleteData',{
          data: { name, price, email: this.state.user.email }
        })
        this.setState({editing: false, name: '', price:''})
      }
    
      updateDB = (nameToApply, priceToApply) => {
        axios.post("http://localhost:3001/api/updateData", {
          originalName: this.state.originalName,
          originalPrice: this.state.originalPrice,
          update: { name: nameToApply, price: priceToApply },
          email: this.state.user.email
        })
      }
    
      handleChange = e => this.setState({ [e.target.name]: e.target.value })
    
      handleSalary = e => {
        this.setState({ salary: e.target.value })
        localStorage.setItem('salary', e.target.value)
      }
    
      handleSubmit = e => {
        e.preventDefault()
        const { name, price, editing } = this.state 
        if(editing){
          this.updateDB(name, price)
        } else {
          this.putDataToDB(name, price)
        }
        this.setState({ name: '', price: '', editing: false })
      }
    
      taxBracket = salary => {
        salary = parseInt(salary)
        if(salary <= 9525) return (salary * (1 - 0.1))
        if(salary >= 9526 && salary <= 38700) return (salary * (1 - 0.12))
        if(salary >= 38701 && salary <= 82500) return (salary * (1 - 0.22))
        if(salary >= 82501 && salary <= 157500) return (salary * (1 - 0.24))
        if(salary >= 157501 && salary <= 200000) return (salary * (1 - 0.32))
        if(salary >= 200001 && salary <= 500000) return (salary * (1 - 0.35))
        if(salary >= 500001) return (salary * (1 - 0.37))
      }
    
      editExpense = expense => {
        this.setState({ editing: true, 
            id: expense.id, 
            name: expense.name, 
            price: expense.price,
            originalName: expense.name,
            originalPrice: expense.price
         })
      }
    
      render() {
        const { data, salary, name, price, expenseTotal, editing, user } = this.state;
        let salAfterTax = 0
        if(!!salary){
          salAfterTax = this.taxBracket(salary);
        }
        return (
          <Fragment>
            <NavBar user={user} handleLogOut={this.handleLogOut} />
            <MainWrap>
              <Side left>
                <Row>
                  <Header>Salary</Header>
                  <Input type='number' name='salary' placeholder='Salary' onChange={this.handleSalary} value={salary}></Input><br></br><br></br>
                  <Row between borderless>
                    <Span>${salAfterTax} Yearly After Taxes</Span> <br></br>
                    <Span>${(salAfterTax / 12).toFixed(2)} Monthly</Span><br />
                    <Span>${(salAfterTax / 52).toFixed(2)} Weekly</Span>
                  </Row>
                </Row>
                <Row>
                  <Row borderless flex>
                    <Header flex>{ editing ? 'Edit' : 'Add' } Monthly Expenses</Header>
                    { 
                        editing ? 
                        <CancelButton onClick={() => this.setState({editing: false, name: '', price:''})}>Cancel</CancelButton> :
                        null
                    }
                  </Row>
                  <Form onSubmit={this.handleSubmit}>
                    <Input name='name' value={name} onChange={this.handleChange} placeholder='Name of Expense'></Input><br></br>
                    <Input type='number' name='price' value={price} onChange={this.handleChange} placeholder='Price of Expense'></Input><br></br>
                  </Form>
                    {
                      editing ? 
                      <Fragment>
                        <Row between borderless>
                            <Button type='submit' onClick={this.handleSubmit}>Edit Expense</Button>
                            <Button delete onClick={this.deleteFromDB}>Remove</Button>
                        </Row>
                      </Fragment> :
                      <Button type='submit' onClick={this.handleSubmit}>
                        Add Expense
                      </Button>
                    }
                </Row>
              </Side>
              <Side right>
                <Row>
                    <Header>You Spend ${expenseTotal} per month in expenses</Header>
                    <Row between borderless>
                      <Span>${(salAfterTax / 12).toFixed(2) - expenseTotal} Left per Month</Span><br></br>
                      <Span>${(salAfterTax) - (expenseTotal * 12)} Left per year</Span>
                    </Row>            
                </Row>
                <Row>
                  <Header>Here's your monthly and yearly breakdown</Header>
                    <Table>
                      <tbody>
                      <TR header>
                        <TH>Expense Name</TH>
                        <TH>Monthly Cost</TH>
                        <TH>Yearly Cost</TH>
                      </TR>
                      { 
                        data.length < 0 ?
                        <Span>No Expenses Yet</Span> :
                        data.map(expense => (
                          <TR key={expense.id} onClick={e => this.editExpense(expense)}>
                            <TD>{expense.name}</TD>
                            <TD>${expense.price}</TD>
                            <TD>${expense.price * 12}</TD>
                          </TR>
                        ))
                      }
                      </tbody>
                    </Table>
                </Row>
              </Side>
            </MainWrap>
          </Fragment>
        );
      }
}

export default withRouter(MainPage)