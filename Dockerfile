# Dockerfile for the fragments microservice
# This Dockerfile is used to containerize the microservice for deployment.
# Here we will define the base image and set up all the necessary configurations.
# More details about Dockerfile can be found at: https://docs.docker.com/engine/reference/builder/

# Use node version 20.6.0
FROM node:20.6.0

# Metadata about the image
LABEL maintainer="Davender Singh <davender-singh1@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Environment variables
ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json before other files
# Utilize Docker cache to save re-installing dependencies if unchanged
COPY package*.json /app/

# Install application dependencies
RUN npm install

# Copy all files from your project into the Docker image
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd


# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]
