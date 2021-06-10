import { httpService } from './http.service.js';
import { utilService } from './util.service';

export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    getGuest
};

function getGuest() {
    return {
        _id: 'guest',
        username: 'Guest' + utilService.getRandomInt(1, 1000),
        email: 'guest@guesti.com',
        password: 'guest',
        imgUrl: ''
    };
}

function getUsers() {
    return httpService.get('user');
}

function getById(userId) {
    return httpService.get(`user/${userId}`);
}

function remove(userId) {
    return httpService.delete(`user/${userId}`);
}

function update(user) {
    return httpService.put(`user/${user._id}`, user);
}

async function login(userCred) {
    const user = await httpService.post('auth/login', userCred);
    return _handleLogin(user);
}

async function signup(userCred) {
    const user = await httpService.post('auth/signup', userCred);
    return _handleLogin(user);
}

async function logout() {
    await httpService.post('auth/logout');
    sessionStorage.clear();
}

// private functions

function _handleLogin(user) {
    sessionStorage.setItem('user', JSON.stringify(user));
    return user;
}