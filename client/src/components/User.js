/**
 * Created by hunglan185 on 30/07/20.
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import authClient from './Auth';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_loading: true,
            edit_type: 'normal',
            user_info : {
                first_name: '',
                last_name: '',
                email: '',
                type: '',
            },
            errors: {}
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({
            user_info : {
                ...this.state.user_info,
                [e.target.name]: e.target.value
            }
        });
    }

    componentDidMount() {
        const { params } = this.props.match;
        let id = params.id;
        axios.get('/api/user/' + id, {
            headers: { TOKEN: `${localStorage.token}` }
        }).then(response => {
            this.setState({
                is_loading: false,
                edit_type: response.data.edit_type,
                user_info: {
                    first_name: response.data.user_info.first_name,
                    last_name: response.data.user_info.last_name,
                    email: response.data.user_info.email,
                    type: response.data.user_info.type,
                },
            });
        }).catch(err => {
            if (err.response.data.no_valid_token === 1) {
                alert('The token is not validate!');
                authClient.destroySession();
                window.location.reload();
            } else {
                alert(err.response.data.message);
                this.props.history.push(`/`);
            }
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const { params } = this.props.match;
        let id = params.id;

        let updatedUser = this.state.user_info;

        axios.patch('/api/user/' + id, updatedUser, {
            headers: { TOKEN: `${localStorage.token}` }
        }).then(response => {
            alert('Updated successfully');
        }).catch(err => {
            if (err.response.data.no_valid_token === 1) {
                alert('The token is not validate!');
                authClient.destroySession();
                window.location.reload();
            } else {
                this.setState({
                    ...this.state,
                    errors: err.response.data
                });
            }
        });
    }

    render() {
        if (this.state.is_loading === true) {
            return (
                <div className="container">
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>)
        }

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form noValidate onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">
                                Edit user
                            </h1>
                            <div className="form-group">
                                <label htmlFor="first_name">First name</label>
                                <input type="text" className={this.state.errors.first_name ? "form-control is-invalid" : "form-control"} name="first_name" placeholder="Enter first name"
                                       value={this.state.user_info.first_name} onChange={this.onChange}/>
                                <div className="invalid-feedback">{this.state.errors.first_name}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="last_name">Last name</label>
                                <input type="text" className={this.state.errors.last_name ? "form-control is-invalid" : "form-control"} name="last_name" placeholder="Enter last name"
                                       value={this.state.user_info.last_name} onChange={this.onChange}/>
                                <div className="invalid-feedback">{this.state.errors.last_name}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="text" className={this.state.errors.email ? "form-control is-invalid" : "form-control"} name="email" placeholder="Enter email"
                                       value={this.state.user_info.email} onChange={this.onChange}/>
                                <div className="invalid-feedback">{this.state.errors.email}</div>
                            </div>
                            {
                                this.state.edit_type === 'admin' ?
                                    (
                                    <div className="form-group">
                                        <label htmlFor="type">Type</label>
                                        <select name="type" className={this.state.errors.type ? "form-control is-invalid" : "form-control"} value={this.state.user_info.type} onChange={this.onChange}>
                                            <option value="normal">Normal</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <div className="invalid-feedback">{this.state.errors.type}</div>
                                    </div>
                                    )
                                    :
                                    (<></>)
                            }
                            <button type="submit" className="btn btn-lg btn-primary btn-block" >
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(User);