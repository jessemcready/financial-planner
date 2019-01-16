import React, { Component, Fragment } from 'react';
import Wrapper from '../styled_components/wrapper'
import Row from '../styled_components/row'
import Form from '../styled_components/form'
import Input from '../styled_components/input'
import Button from '../styled_components/button'
import Header from '../styled_components/header'
import Span from '../styled_components/span'
import Table from '../styled_components/table'
import TD from '../styled_components/td'
import TH from '../styled_components/th'
import TR from '../styled_components/tr'
import axios from 'axios';
import { withRouter } from 'react-router-dom'

class MainPage extends Component {
    state = {
        data: [],
        user: {},
        salary: '',
        id: 0,
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
          price: price
        })
      }
    
      deleteFromDB = () => {
        let objIdToDelete = null
        this.state.data.forEach(data => {
          if(data.id === this.state.id){
            objIdToDelete = data._id
          }
        })
        axios.delete('http://localhost:3001/api/deleteData',{
          data: {id: objIdToDelete}
        })
        this.setState({editing: false, name: '', price:''})
      }
    
      updateDB = (idToUpdate, nameToApply, priceToApply) => {
        let objIdToUpdate = null
        this.state.data.forEach(data => {
          if (data.id === idToUpdate) {
            objIdToUpdate = data._id
          }
        })
        axios.post("http://localhost:3001/api/updateData", {
          id: objIdToUpdate,
          update: { name: nameToApply, price: priceToApply }
        })
      }
    
      handleChange = e => this.setState({ [e.target.name]: e.target.value })
    
      handleSalary = e => {
        this.setState({ salary: e.target.value })
        localStorage.setItem('salary', e.target.value)
      }
    
      handleSubmit = e => {
        e.preventDefault()
        const { id, name, price, editing } = this.state 
        if(editing){
          this.updateDB(id, name, price)
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
        this.setState({ editing: true, id: expense.id, name: expense.name, price: expense.price })
      }
    
      render() {
        debugger
        const { data, salary, name, price, expenseTotal, editing } = this.state;
        let salAfterTax = 0
        if(!!salary){
          salAfterTax = this.taxBracket(salary);
        }
        return (
          <Wrapper>
            <Row>
              <Header>Salary</Header>
              <Input type='number' name='salary' placeholder='Salary' onChange={this.handleSalary} value={salary}></Input><br></br><br></br>
              <Row between borderless>
                <Span>${salAfterTax} Yearly After Taxes</Span>
                <Span>${(salAfterTax / 12).toFixed(2)} Monthly</Span>
                <Span>${(salAfterTax / 52).toFixed(2)} Weekly</Span>
              </Row>
            </Row>
            <Row>
              <Header>Add Monthly Expenses</Header>
              <Form onSubmit={this.handleSubmit}>
                <Input name='name' value={name} onChange={this.handleChange} placeholder='Name of Expense'></Input><br></br>
                <Input type='number' name='price' value={price} onChange={this.handleChange} placeholder='Price of Expense'></Input><br></br>
              </Form>
              <Row borderless between>
                {
                  editing ? 
                  <Fragment>
                    <Button type='submit' onClick={this.handleSubmit}>Edit Expense</Button>
                    <Button delete onClick={this.deleteFromDB}>Remove</Button>
                  </Fragment> :
                  <Button type='submit' onClick={this.handleSubmit}>
                    Add Expense
                  </Button>
                }
              </Row>
            </Row>
            <Row>
                <Header>You Spend ${expenseTotal} per month in expenses</Header>
                <Row between borderless>
                  <Span>${(salAfterTax / 12).toFixed(2) - expenseTotal} Left per Month</Span>
                  <Span>${(salAfterTax) - (expenseTotal * 12)} Left per year</Span>
                </Row>            
            </Row>
            <Row>
              <Header>Here's your monthly and yearly breakdown</Header>
                <Table>
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
                </Table>
            </Row>
          </Wrapper>
        );
      }
}

export default withRouter(MainPage)