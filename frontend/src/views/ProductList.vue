<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-toolbar>
          <v-toolbar-title>Products</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="logout" color="error">Logout</v-btn>
          <v-btn @click="goToProductRegistration" color="primary">Register Product</v-btn>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-else-if="products.length === 0" class="no-products">
          No products have been created
        </div>
      </v-col>
    </v-row>
    <v-row v-if="!errorMessage && products.length > 0">
      <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="4">
        <v-card>
          <v-img :src="product.images[0]" height="200px" v-if="product.images.length"></v-img>
          <v-card-title class="bold-title">{{ product.name }}</v-card-title>
          <v-card-subtitle class="price">${{ product.price.toFixed(2) }}</v-card-subtitle>
          <v-card-subtitle>{{ product.status }}</v-card-subtitle>
          <v-card-subtitle>Created by: {{ product.userId }}</v-card-subtitle>
          <v-card-actions>
            <router-link :to="`/products/${product.id}`">
              <v-btn>View Details</v-btn>
            </router-link>
            <v-btn
              v-if="product.userId === userId"
              @click="deleteProduct(product.id)"
              color="error"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axiosInstance from '../axiosConfig'
import { useRouter } from 'vue-router'
// @ts-ignore
import { jwtDecode } from 'jwt-decode'

interface User {
  id: number
  email: string
}

interface Product {
  id: number
  name: string
  price: number
  status: string
  userId: number
  images: string[]
}

interface DecodedToken {
  userId: number
}

const products = ref<Product[]>([])
const errorMessage = ref<string | null>(null)
const router = useRouter()

const token = localStorage.getItem('token')
let userId: number | null = null

if (token) {
  const decodedToken = jwtDecode<DecodedToken>(token)
  userId = decodedToken.userId
}

const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get('/api/products')
    products.value = response.data.products
  } catch (error) {
    console.error('Failed to fetch products', error)
    errorMessage.value = 'Failed to fetch products. Please try again later.'
  }
}

const deleteProduct = async (id: number) => {
  try {
    await axiosInstance.delete(`/api/products/${id}`)
    products.value = products.value.filter((product) => product.id !== id)
  } catch (error) {
    console.error('Failed to delete product', error)
    errorMessage.value = 'Failed to delete product. Please try again later.'
  }
}

const goToProductRegistration = () => {
  router.push('/products/new')
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.bold-title {
  font-weight: bold;
}
.price {
  color: green;
}
.error-message {
  color: red;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
}
.no-products {
  color: gray;
  font-style: italic;
  text-align: center;
  margin-top: 20px;
}
</style>
