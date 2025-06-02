import {createRouter, createWebHistory} from 'vue-router';
import Home from './views/Home.vue';
import NotFound from './views/NotFound.vue';
import PhpStan from './views/phpstan/PhpStan.vue';

const routes = [
    {path: '/', name: 'Home', component: Home},
    {path: '/phpstan', name: 'PhpStan', component: PhpStan},
    {path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;