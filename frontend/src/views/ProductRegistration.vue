<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>Register Product</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="registerProduct">
              <v-text-field
                v-model="name"
                :rules="[(v) => !!v || 'Product Name is required']"
                label="Product Name"
                required
              ></v-text-field>
              <v-text-field
                v-model="price"
                :rules="[(v) => !!v || 'Price is required']"
                label="Price"
                type="number"
                required
              ></v-text-field>
              <v-textarea
                v-model="description"
                :rules="[(v) => !!v || 'Description is required']"
                label="Description"
                required
              ></v-textarea>
              <v-file-input multiple @change="onFileChange" label="Product Images"></v-file-input>
              <v-btn type="submit" color="primary">Submit</v-btn>
              <v-btn @click="cancel" color="secondary">Cancel</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axiosInstance from '../axiosConfig'
import { useRouter } from 'vue-router'

const name = ref('')
const price = ref<number | null>(null)
const description = ref('')
const images = ref<File[]>([])
const router = useRouter()

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    images.value = Array.from(target.files)
  }
}

const registerProduct = async () => {
  try {
    const formData = new FormData()
    // Add JSON object with all the data
    const data = {
      name: name.value,
      price: price.value,
      description: description.value,
      // Add images
      images: images.value
    }
    // formData.append('name', name.value)
    // formData.append('price', price.value!.toString())
    // formData.append('description', description.value)
    // images.value.forEach((file) => formData.append('images', file))
    // console.log('FORM DATA: ', JSON.stringify(formData))

    await axiosInstance.post('/api/products', data, {
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'multipart/form-data'
      }
    })

    router.push('/products')
  } catch (error) {
    console.error('Failed to register product', error)
  }
}

const cancel = () => {
  router.push('/products')
}
</script>

<style scoped>
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
