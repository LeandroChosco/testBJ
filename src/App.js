import React, { Component } from 'react';
import './App.css';
import Login from './pages/Login'
import Map from './pages/Map'
import Header from './components/Header';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Analysis from './pages/Analysis';
import SideBar from './components/SideBar';

class App extends Component {
  
  state = {
    isAuthenticated: true,
    sideMenu:false
  }
  
  componentDidMount(){
    this._checkAuth()
  }

  _checkAuth(){
    const isAuth = sessionStorage.getItem('isAuthenticated')
    this.setState({isAuthenticated:isAuth})
  }

  _makeAuth = () => {
    sessionStorage.setItem('isAuthenticated',true)
    this.setState({isAuthenticated:true})
  }

  _toggleSideMenu = () => {
    console.log('tooglle')
    this.setState({sideMenu: !this.state.sideMenu})
  }

  render() {
    return (
      <Router>
      <div className="fullcontainer">        
        {this.state.isAuthenticated?<Header toggleSideMenu = {this._toggleSideMenu} />:null}     
        <SideBar toggleSideMenu = {this._toggleSideMenu} active={this.state.sideMenu}/>
        <Route path="/" exact render={(props) => this.state.isAuthenticated?<Map />:<Login {...props} makeAuth={this._makeAuth} isAuthenticated={this.state.isAuthenticated}/>} />
        <Route path="/analisis" exact render={(props) => <Analysis {...props}/>} />
      </div>
    </Router>  
    );
  }
}

export default App;
