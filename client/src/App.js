import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import NavBar from './components/NavBar';
import Home from './components/Users';
import Login from './components/Login';
import User from './components/User';
import Register from './components/Register';
import authClient from './components/Auth';
import {PrivateRoute, PublicRoute} from './components/CustomRoute';

class App extends Component {
    constructor(props) {
        super(props);
        this.updateAuthenStatus = this.updateAuthenStatus.bind(this);
    }

    state = {
        loggedUser: authClient.getProfile()
    };

    updateAuthenStatus() {
        this.setState({loggedUser: authClient.getProfile()});
    }

    render() {
        let loggedUser = this.state.loggedUser;
        return (
            <Router>
                <div className="App">
                    <NavBar loggedUser={loggedUser} onLogout={this.updateAuthenStatus} />
                    <PrivateRoute path={`/user/:id`} component={User} />
                    <PrivateRoute exact path="/" component={Home} />
                    <PublicRoute exact path="/login" component={Login} onLogin={this.updateAuthenStatus} />
                    <PublicRoute exact path="/register" component={Register} />
                </div>
            </Router>
        )
    }
}

export default App;