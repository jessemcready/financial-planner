import React, { Component } from 'react'
import Navbar from '../styled_components/navbar'
import NavList from '../styled_components/navList'
import ListItem from '../styled_components/listItem'
import { withRouter } from 'react-router-dom'

class NavBar extends Component{
    handleLogOut = () => {
        localStorage.clear()
        this.props.history.push({ pathname: '/' })
        this.props.handleLogOut();
    }

    handleClick = () => this.props.history.push({ pathname: '/home' })

    render(){
        const { user } = this.props
        return (
            <Navbar>
                <NavList>
                    <ListItem logo onClick={this.handleClick}>FinPlanner</ListItem>
                    <ListItem hover onClick={this.handleClick}>Home</ListItem>
                    <ListItem>Hi, {user.name}</ListItem>
                    <ListItem hover onClick={this.handleLogOut}>Log Out</ListItem>
                </NavList>
            </Navbar>
        )
    }
}

export default withRouter(NavBar)