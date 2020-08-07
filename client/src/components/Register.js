/**
 * Created by hunglan185 on 30/07/20.
 */
import React, { Component } from 'react';
import authClient from './Auth';

class Register extends Component {
    constructor() {
        super();
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            errors: {}
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    async onSubmit (e) {
        e.preventDefault();

        const newUser = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password
        }

        try {
            await authClient.signUp(newUser);
            this.props.history.push(`/login`);
        } catch (e) {
            this.setState({
                ...this.state,
                errors: e
            });
        }
    }

    render () {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form noValidate onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">
                                Register
                            </h1>
                            <div className="form-group">
                                <label htmlFor="name">First name</label>
                                <input type="text" className={this.state.errors.first_name ? "form-control is-invalid" : "form-control"} name="first_name" placeholder="Enter your first name" value={this.state.first_name} onChange={this.onChange} />
                                <div className="invalid-feedback">{this.state.errors.first_name}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name">Last name</label>
                                <input type="text" className={this.state.errors.last_name ? "form-control is-invalid" : "form-control"} name="last_name" placeholder="Enter your last name" value={this.state.last_name} onChange={this.onChange} />
                                <div className="invalid-feedback">{this.state.errors.last_name}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email address</label>
                                <input type="email" className={this.state.errors.email ? "form-control is-invalid" : "form-control"} name="email" placeholder="Enter email" value={this.state.email} onChange={this.onChange} />
                                <div className="invalid-feedback">{this.state.errors.email}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" className={this.state.errors.password ? "form-control is-invalid" : "form-control"} name="password" placeholder="Password" value={this.state.password} onChange={this.onChange} />
                                <div className="invalid-feedback">{this.state.errors.password}</div>
                            </div>
                            <button type="submit" className="btn btn-lg btn-primary btn-block" >
                                Register!
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register;