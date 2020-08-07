/**
 * Created by hunglan185 on 30/07/20.
 */
import React, { Component } from 'react';
import axios from 'axios';
import authClient from './Auth';
import {Link} from 'react-router-dom';

class Home extends Component {
    state = {
        'is_loading': true,
        'users': []
    }

    onDelete(id) {
        axios.delete('api/user/'+id , {
            headers: { TOKEN: `${localStorage.token}` }
        }).then(response => {
            this.getUsers();
            alert('Delete successfully');
        }).catch(err => {
            if (err.response.data.no_valid_token === 1) {
                alert('The token is not validate!');
                authClient.destroySession();
                window.location.reload();
            } else {
                let message = 'Can not delete, please try again';
                alert(message);
            }
        });
    }

    getUsers() {
        this.setState({'is_loading': true,'users': []});
        axios.get('api/user', {
            headers: { TOKEN: `${localStorage.token}` }
        }).then(response => {
            this.setState({'is_loading': false,'users': response.data});
        }).catch(err => {
            this.setState({'is_loading': false,'users': []});
            if (err.response.data.no_valid_token === 1) {
                alert('The token is not valid!');
                authClient.destroySession();
                window.location.reload();
            } else {
                let message = err.response.data.message ? err.response.data.message : 'Something wrong';
                alert(message);
            }
        });
    }

    componentDidMount() {
        this.getUsers();
    }

    render() {
        if (this.state.is_loading === true) {
            return (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
        }

        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">User Management</h1>
                    </div>
                </div>

                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First name</th>
                        <th scope="col">Last name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.users.map((user, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">{index+1}</th>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.type}</td>
                                    <td>{user.can_edit ? <Link to={"/user/" + user.id} className="btn btn-info">Edit</Link> : <></>}</td>
                                    <td>
                                        {user.can_delete ? <button onClick={() => this.onDelete(user.id)} className="btn btn-danger">Delete</button> : <></>}
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Home;