import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/UserLogin.vue'
import ProductList from '../views/ProductList.vue'
import ProductRegistration from '../views/ProductRegistration.vue'
import ProductDetails from '../views/ProductDetails.vue'

// Simulated authentication check function
// Replace this with your actual authentication logic
const isAuthenticated = () => {
  return !!localStorage.getItem('token') // Example: check if a token is stored in localStorage
}

const routes = [
  {
    path: '/',
    redirect: () => (isAuthenticated() ? '/products' : '/login') // Redirect based on authentication
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/products',
    name: 'ProductList',
    component: ProductList,
    meta: { requiresAuth: true } // Mark this route as requiring authentication
  },
  {
    path: '/products/new',
    name: 'ProductRegistration',
    component: ProductRegistration,
    meta: { requiresAuth: true } // Mark this route as requiring authentication
  },
  {
    path: '/products/:id',
    name: 'ProductDetails',
    component: ProductDetails,
    meta: { requiresAuth: true } // Mark this route as requiring authentication
  },
  {
    path: '/about',
    name: 'About',
    // Lazy-load this route
    component: () => import('../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to check for authentication
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next('/login') // Redirect to login page if not authenticated
    } else {
      next() // Proceed to the route if authenticated
    }
  } else {
    next() // Proceed to the route if it does not require authentication
  }
})

export default router
