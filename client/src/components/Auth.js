import axios from 'axios';

class Auth {
    constructor() {
        this.setSession = this.setSession.bind(this);
        this.destroySession = this.destroySession.bind(this);
        this.isAuthentication = this.isAuthentication.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);

        this.token = localStorage.getItem('token');
        this.email = localStorage.getItem('email');
        this.isAuthed = this.isAuthentication();
    }

    isAuthentication() {
        let isAuthed = false;
        if (typeof localStorage.getItem('token') === 'string' && localStorage.getItem('token') !== ''
            && typeof localStorage.getItem('email') === 'string' && localStorage.getItem('email') !== '') {
            isAuthed = true;
        }
        return isAuthed;
    }

    signUp(newUser) {
        return new Promise((resolve, reject) => {
            axios.post('api/register', newUser, {
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                return resolve(response);
            }).catch(err => {
                return reject(err.response.data);
            });
        });
    }

    login(email, password) {
        return new Promise((resolve, reject) => {
            axios.post('api/login',{
                email: email,
                password: password,
            },{
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                this.setSession(response.data.token, response.data.email);
                return resolve(this.getProfile());
            }).catch(err => {
                this.destroySession();
                let message = err.response.data.message ? err.response.data.message : 'Error';
                return reject(message);
            });
        });
    }

    logout() {
        return new Promise((resolve, reject) => {
            axios.get('api/logout',{
                headers: { TOKEN: `${localStorage.token}` }
            }).then(() => {
                this.destroySession();
                return resolve(this.getProfile());
            }).catch(err => {
                this.destroySession();
                return resolve(this.getProfile());
            });
        });
    }

    setSession(token, email) {
        token = (token === undefined || token === null) ? '' : token;
        email = (email === undefined || email === null) ? '' : email;
        let isAuthed = false;
        if (token !== '' && email !== '') {
            isAuthed = true;
        }

        this.isAuthed = isAuthed;
        this.token = token;
        this.email = email;

        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
    }

    destroySession() {
        this.isAuthed = false;
        this.token = '';
        this.email = '';

        localStorage.removeItem('token');
        localStorage.removeItem('email');
    }

    getProfile() {
        return {
            'isAuthed': this.isAuthed,
            'token': this.token,
            'email': this.email
        }
    }
}

const authClient = new Auth();

export default authClient;