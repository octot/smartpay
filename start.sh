#!/bin/bash

# Start frontend server

npm start &

# # Change directory to the backend folder
cd backend

# # Start backend server
npx nodemon WhatsAppserver.js
