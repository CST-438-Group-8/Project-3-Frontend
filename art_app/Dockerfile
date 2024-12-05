# DOCKER(use below cmnds)
# - docker build -t web_app .
# - docker run web_app

# Use a Node.js base image to run the app
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the app's source code into the container
COPY . .

# Expose the ports used by Expo
EXPOSE 8080 8081

# Start the Expo development server with web support enabled
CMD ["npx","expo", "start", "--web"]
