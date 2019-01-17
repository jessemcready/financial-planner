import React, { Component } from 'react'
import Navbar from '../styled_components/navbar'
import NavList from '../styled_components/navList'
import ListItem from '../styled_components/listItem'

class NavBar extends Component{
    render(){
        const { user } = this.props
        return (
            <Navbar>
                <NavList>
                    <ListItem logo>FinPlanner</ListItem>
                    <ListItem>Home</ListItem>
                    <ListItem>Hi, {user.name}</ListItem>
                    <ListItem>Log Out</ListItem>
                </NavList>
            </Navbar>
        )
    }
}

export default NavBar