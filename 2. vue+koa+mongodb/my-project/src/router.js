import Vue from "vue";
import Router from "vue-router";

import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
      {
          path: "/",
          redirect: '/login'
      },
      {
          path: "/login",
          name: "login",
          component: Login
      },
      {
          path: "/register",
          name: "resigter",
          component: Register
      },
    {
      path: "/home",
      name: "home",
      component: Home
    },
  ]
});