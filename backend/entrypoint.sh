#!/bin/sh

# Check for running postgres instance in db container
while ! nc -z db 5432; do
  echo "Waiting for postgres..."
    sleep 2
done

# Run migrations and seeds
# npx sequelize-cli db:migrate
# npx sequelize-cli db:seed:all
npm run migrate
npm run seed

# Start the application
# npm start

# Start the server with nodemon for live reload
# nodemon --inspect=0.0.0.0:5000 src/server.ts
# npm run dev
nodemon --legacy-watch
# nodemon --watch src/server.ts --watch models --watch controllers --watch routes --exec ts-node src/server.ts 
