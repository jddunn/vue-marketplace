## Vue Marketplace

### Overview

This project is a small web application that allows users to buy and sell their belongings online (no payments are done, the UI is demo only). The application supports a negotiation process where buyers can make offers and sellers can counter-offer. The tech stack includes TypeScript, Node.js, Express, Vue.js with Vuetify for UI design, Sequelize for ORM, and PostgreSQL for the database. Docker / Docker-compose is used for portability.

### Features

- User authentication with JWT.
- Role-based actions (buyers and sellers).
- Create a new listing for an item
- Delete listings if you are the owner of one
- Make bids / purchases of listings from other users

### To-do

- Make record of inventory and track who owns what in the database
- Make list of offers viewable
- Allow for counter-offers and acceptance of offers

### Tech Stack

- Frontend: Vue.js, Vuetify, Vite
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL, Sequelize ORM
- Authentication: JWT (JSON Web Tokens)
- Dev Tools: Nodemon, Prettier, ESLint

### Prerequisites

- Node.js (v18 or later)
- Docker
- PostgreSQL

### Database Schema

**User** - id (Integer, Primary Key, Auto Increment) - email (String, Unique, Not Null) - password (String, Not Null)

**Product** - id (Integer, Primary Key, Auto Increment) - name (String, Not Null) - price (Float, Not Null) - description (String, Not Null) - images (Array of Strings) - status (Enum: 'Available', 'Reserved', 'Sold', Default: 'Available') - userId (Foreign Key to User, Not Null) (NOTE: A "owner" of a product hasn't been implemented but will be necessary)

**Offer** - id (Integer, Primary Key, Auto Increment) - price (Float, Not Null) - type (Enum: 'BuyerOffer', 'SellerCounterOffer', Not Null) - status (Enum: 'Pending', 'Accepted', 'Rejected', Default: 'Pending') - productId (Foreign Key to Product, Not Null) - userId (Foreign Key to User, Not Null)

**Summary of Database Relations**

- User and Product: One-to-Many relationship. A user can create multiple products.
- Product and Offer: One-to-Many relationship. A product can have multiple offers.
- User and Offer: One-to-Many relationship. A user can create multiple offers on various products.

### Getting Started

**Pre-requisites**

- Create a .env file in the root directory in `/backend` and add the following:

```
PORT=5000
DATABASE_URL=postgres://user:password@db:5432/market
JWT_SECRET=your_jwt_secret
```

- Create a .env file in the root directory in `/frontend` and add the following:

```
VITE_API_URL=http://localhost:5000
```

**Running with Docker**
Ensure Docker is installed and running on your machine.

`docker-compose up --build`

- Build the Docker images for the backend and frontend.
- Run the PostgreSQL database container, and seed the database with example users with Sequelize.
- Start the backend and frontend services with live reloading.

**Accessing the Application**

- Backend API: http://localhost:5000
- Frontend UI: http://localhost:3000

**Using the Application**

- Login with one of the two accounts generated from the seed file in `/seeders`

  - Email: user1@example.com
    Password: password123
  - Email: user2@example.com
    Password: password123

### Live Reloading

Both backend and frontend support live reloading:

Backend: Uses nodemon to watch for changes in the source files and automatically restarts the server.

Frontend: Uses vite with hot module replacement to reflect changes immediately.
Backend Setup

### Linting

Automatic formatting is achieved using Prettier. Ensure Prettier is configured in your package.json and integrated with your IDE/editor.

### Authentication and JWT

The application uses JSON Web Tokens (JWT) for authentication. When a user logs in, a JWT is generated and returned to the client. The token is stored in localStorage and is included in the headers of subsequent API requests to authenticate the user.

### Example API Endpoints

Login: POST /login

Get Products: GET /api/products

Get Product Details: GET /api/products/:id

Create Product: POST /api/products

Delete Product: DELETE /api/products/:id

Create Offer: POST /api/offers

Get Offers for a Product: GET /api/offers/:productId

Accept Offer: POST /api/offers/:id/accept
