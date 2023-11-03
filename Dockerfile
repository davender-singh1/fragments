# Dockerfile for the fragments microservice
# This Dockerfile is used to containerize the microservice for deployment.
# Here we will define the base image and set up all the necessary configurations.
# More details about Dockerfile can be found at: https://docs.docker.com/engine/reference/builder/
# Stage 1: Build
FROM node:20.6.0 AS build-stage

LABEL maintainer="Davender Singh <davender-singh1@myseneca.ca>"
LABEL description="Fragments node.js microservice build stage"

ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

WORKDIR /app-build

# Only copy package files to use Docker cache effectively
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy all necessary files from your project into the Docker image
COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd
# If there's a build script in your package.json, run it here
# RUN npm run build

# Stage 2: Runtime
FROM node:20.6.0

WORKDIR /app

# Environment variables
ENV PORT=8080

# Copy from build stage
COPY --from=build-stage /app-build /app
COPY --from=build-stage /app-build/tests/.htpasswd /app/tests/.htpasswd

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]

