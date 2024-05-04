# Use an existing Docker image as a base
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose a port for the application to listen on
EXPOSE 3000

# Copy the start script into the container
COPY start.sh .

# Make the script executable
RUN chmod +x start.sh

# Command to run when the container starts
CMD ["./start.sh"]
