import React from 'react';
import authClient from './Auth';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const isLoggedIn = authClient.isAuthentication();
    return (
        <Route {...rest} render={ props =>
                isLoggedIn ? (
                        <Component {...props} />
                    ) : (
                        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                    )
            }
        />
    )
};

const PublicRoute = ({ component: Component, path: pathRoute, ...rest }) => {
    const isLoggedIn = authClient.isAuthentication();
    return (
        <Route path={pathRoute} render={ props =>
            !isLoggedIn ? (
                    <Component {...rest} {...props} />
                ) : (
                    <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                )
        }
        />
    )
};

export {PrivateRoute, PublicRoute};