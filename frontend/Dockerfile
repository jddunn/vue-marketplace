# Use the official Node.js image
FROM node:18-alpine

# Create and change to the app directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
# Dev
CMD ["npm", "run", "dev"]
# Prod
# CMD ["npm", "run", "serve"]

