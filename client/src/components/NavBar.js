/**
 * Created by hunglan185 on 30/07/20.
 */
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import authClient from './Auth';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.onLogout = this.onLogout.bind(this);
    }

    async onLogout() {
        try {
            await authClient.logout();
            this.props.onLogout();
        } catch (e) {
            alert(e);
        }
    }

    render() {
        const loggedUser = this.props.loggedUser;
        return (
            <div className="container">
                <header className="navbar navbar-expand navbar-dark flex-column flex-md-row bd-navbar bg-info">
                    <Link className="navbar-brand mr-0 mr-md-2" to="/">Home</Link>

                    <ul className="navbar-nav ml-md-auto">
                        {
                            loggedUser.isAuthed ? (
                                <>
                                    <li className="nav-item">
                                        <span className="nav-link text-white">Sign in as {loggedUser.email}</span>
                                    </li>
                                    <li className="nav-item">
                                        <span onClick={this.onLogout} className="btn btn-link">Logout</span>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link to="/login" className="nav-link">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/register" className="nav-link">Register</Link>
                                    </li>
                                </>
                            )
                        }
                    </ul>
                </header>
            </div>
        )
    }
}

export default NavBar;