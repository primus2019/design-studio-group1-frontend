import Vue from 'vue'
import VueRouter from 'vue-router'
import Order from '../views/Order.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Order',
    component: Order
  },
  {
    path: '/Booking',
    name: 'Booking',
    // route level code-splitting
    // this generates a separate chunk (Book.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "Book" */ '../views/Booking.vue')
  },
  {
    path: '/Takeout',
    name: 'Takeout',
    component: () => import(/* webpackChunkName: "Book" */ '../views/Takeout.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
