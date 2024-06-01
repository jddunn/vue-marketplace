<template>
  <v-container>
    <v-form @submit.prevent="handleLogin">
      <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
      <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
      <v-btn type="submit" color="primary">Login</v-btn>
      <v-alert v-if="errorMessage" type="error" dismissible @input="errorMessage = ''">
        {{ errorMessage }}
      </v-alert>
    </v-form>
  </v-container>
</template>

<script>
import axiosInstance from '../axiosConfig'

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axiosInstance.post('/api/users/login', {
          email: this.email,
          password: this.password
        })
        console.log('RESPONSE: ', response)
        // Save the JWT to localStorage
        const token = response.data.token
        console.log('GOT THE TOKEN: ', token)
        localStorage.setItem('token', token)
        console.log('TOKEN SAVED', localStorage.getItem('token'))
        // Redirect to products page on successful login
        this.$router.push('/products')
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.errorMessage = 'Invalid email or password'
        } else {
          this.errorMessage = 'An error occurred. Please try again later.'
        }
      }
    }
  }
}
</script>

<style scoped></style>
