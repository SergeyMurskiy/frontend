import Vue from "vue";
import Router from "vue-router";

import EmployeesPage from "./components/EmployeesPage"

Vue.use(Router);

export default new Router({
    mode: 'history',

    routes: [
        {
            path: '/employees',
            component: EmployeesPage
        }
    ]
})