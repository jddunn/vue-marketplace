<!-- eslint-disable vue/valid-v-slot -->
<!-- @ts-nocheck -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Product Details</v-card-title>
          <v-card-text>
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <div v-else>
              <div class="bold-title">{{ product?.name ?? 'Loading...' }}</div>
              <div>{{ product?.description ?? 'Loading...' }}</div>
              <div class="price">{{ product ? `$${product.price.toFixed(2)}` : 'Loading...' }}</div>
              <div>{{ product?.status ?? 'Loading...' }}</div>
              <div>Created by: {{ product?.userId ?? 'Loading...' }}</div>
              <div v-for="image in product?.images ?? []" :key="image">
                <v-img :src="image" alt="Product Image" height="200px"></v-img>
              </div>
              <v-btn v-if="canPurchase" @click="purchase" color="primary">Purchase</v-btn>
              <v-btn v-if="canMakeOffer && product" @click="showOfferForm = true" color="secondary"
                >Make Offer</v-btn
              >
              <v-btn v-if="canDelete && product" @click="deleteProduct" color="error">Delete</v-btn>
              <v-card v-if="showOfferForm" class="mt-4">
                <v-card-text>
                  <v-text-field
                    v-model="offerPrice"
                    label="Enter your offer"
                    type="number"
                  ></v-text-field>
                  <v-btn @click="submitOffer" color="primary">Submit Offer</v-btn>
                </v-card-text>
              </v-card>
              <v-list v-if="offers.length">
                <v-subheader>Offers</v-subheader>
                <v-data-table :headers="offerHeaders" :items="offers" class="elevation-1">
                  <template #item.user="{ item }">
                    {{ item.userId }}
                  </template>
                  <template #item.price="{ item }"> ${{ item.price.toFixed(2) }} </template>
                  <template #item.actions="{ item }">
                    <v-btn v-if="canAcceptOffer(item)" @click="acceptOffer(item.id)" color="primary"
                      >Accept</v-btn
                    >
                    <v-btn v-if="canCounterOffer(item)" color="secondary">Counter Offer</v-btn>
                  </template>
                </v-data-table>
              </v-list>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" top color="success" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axiosInstance from '../axiosConfig'
import { useRoute, useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'

interface Product {
  id: number
  name: string
  price: number
  description: string
  status: string
  images: string[]
  userId: number
}

interface Offer {
  id: number
  price: number
  type: string
  status: string
  userId: number
  productId: number
}

interface DecodedToken {
  userId: number
}

const product = ref<Product | null>(null)
const offers = ref<Offer[]>([])
const showOfferForm = ref(false)
const offerPrice = ref(0)
const errorMessage = ref<string | null>(null)
const snackbar = ref(false)
const snackbarMessage = ref('')
const route = useRoute()
const router = useRouter()

const token = localStorage.getItem('token')
let userId: number | null = null

if (token) {
  const decodedToken = jwtDecode<DecodedToken>(token)
  userId = decodedToken.userId
}

const fetchProductDetails = async () => {
  try {
    const response = await axiosInstance.get(`/api/products/${route.params.id}`)
    product.value = response.data
    fetchOffers()
    if (product.value) {
      canDelete.value = product.value.userId === userId
      canPurchase.value = product.value.status === 'Available' && product.value.userId !== userId
      canMakeOffer.value = product.value.status === 'Available' && product.value.userId !== userId
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      errorMessage.value = 'Product not found'
    } else {
      console.error('Failed to fetch product details', error)
      errorMessage.value = 'Failed to fetch product details. Please try again later.'
    }
  }
}

const fetchOffers = async () => {
  try {
    const response = await axiosInstance.get(`/api/offers/${route.params.id}`)
    offers.value = response.data
    console.log('Offers:', offers.value)
    return offers.value
  } catch (error) {
    console.error('Failed to fetch offers', error)
  }
}

const purchase = async () => {
  if (!product.value) return

  try {
    await axiosInstance.post(`/api/products/purchase/${product.value.id}`)
    snackbarMessage.value = 'Purchase successful'
    snackbar.value = true
    router.push('/products')
  } catch (error) {
    snackbarMessage.value = 'Failed to purchase product'
    snackbar.value = true
    console.error('Failed to purchase product', error)
  }
}

const submitOffer = async () => {
  if (!product.value || offerPrice.value <= product.value.price) {
    snackbarMessage.value = 'Offer must be higher than current price'
    snackbar.value = true
    return
  }

  try {
    await axiosInstance.post('/api/offers', {
      productId: product.value.id,
      price: offerPrice.value,
      type: 'BuyerOffer'
    })
    fetchOffers()
    showOfferForm.value = false
  } catch (error) {
    console.error('Failed to submit offer', error)
  }
}

const acceptOffer = async (offerId: number) => {
  try {
    await axiosInstance.post(`/api/offers/${offerId}/accept`)
    snackbarMessage.value = 'Offer accepted and product marked as sold'
    snackbar.value = true
    fetchOffers()
    fetchProductDetails()
  } catch (error) {
    console.error('Failed to accept offer', error)
  }
}

const deleteProduct = async () => {
  if (!product.value) return

  try {
    await axiosInstance.delete(`/api/products/${product.value.id}`)
    router.push('/products')
  } catch (error) {
    console.error('Failed to delete product', error)
  }
}

const canPurchase = ref(true)
const canMakeOffer = ref(true)
const canDelete = ref(false)
const canAcceptOffer = (offer: Offer) => offer.type === 'BuyerOffer' && offer.status === 'Pending'
const canCounterOffer = (offer: Offer) =>
  offer.type === 'SellerCounterOffer' && offer.status === 'Pending'

const offerHeaders = [
  { text: 'Email', value: 'user.email' },
  { text: 'Price', value: 'price' },
  { text: 'Type', value: 'type' },
  { text: 'Status', value: 'status' },
  { text: 'Actions', value: 'actions', sortable: false }
]

onMounted(() => {
  fetchProductDetails()
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
</style>
