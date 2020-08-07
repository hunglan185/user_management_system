/**
 * Created by hunglan185 on 30/07/20.
 */
import React, { Component } from 'react';
import authClient from './Auth';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errors: {}
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    async onSubmit(e) {
        e.preventDefault();

        try {
            let userLogged = await authClient.login(this.state.email, this.state.password);
            if (userLogged.isAuthed) {
                this.props.onLogin();
                this.props.history.push(`/`);
            }
        } catch(e) {
            this.setState({
                ...this.state,
                errors: e
            });
            alert(e);
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form noValidate onSubmit={this.onSubmit} className="needs-validation">
                            <h1 className="h3 mb-3 font-weight-normal">
                                Please sign in
                            </h1>
                            <div className="form-group">
                                <label htmlFor="email">Email address</label>
                                <input type="email" className="form-control" name="email" placeholder="Enter email"
                                       value={this.state.email} onChange={this.onChange}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" name="password" placeholder="Password"
                                       value={this.state.password} onChange={this.onChange} />
                            </div>
                            <button type="submit" className="btn btn-lg btn-primary btn-block" >
                                Sign in
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;