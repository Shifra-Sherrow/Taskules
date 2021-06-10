import Vue from 'vue';
import VueRouter from 'vue-router';
import homePage from '../views/home-page';
import boardList from '../views/board-list';
import boardDetails from '../views/board-details';
import cardDetails from '../views/card-details';
import login from '../views/login';

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: homePage
    },
    {
        path: '/board',
        name: 'board-list',
        component: boardList
    },
    {
        path: '/board/:boardId',
        name: 'board-details',
        component: boardDetails,
        children: [{
            path: 'card/:cardId',
            name: 'card-details',
            component: cardDetails
        }, ]
    },
    {
        path: '/login',
        name: 'login',
        component: login
    },
    {
        path: '/signup',
        name: 'signup',
        component: login
    },
]

const router = new VueRouter({
    mode: 'hash',
    routes
})

export default router