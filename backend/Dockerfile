FROM node:18-alpine

# Create and change to the app directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Copy the entrypoint script
COPY entrypoint.sh /app/entrypoint.sh

# Ensure the environment variables are available
# ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 5000

RUN chmod +x /app/entrypoint.sh

# Start the application using the entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]
