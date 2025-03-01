# Use an official Node.js image for building React
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend code
COPY . .

# Build the React application
RUN npm run dev

# Use Nginx to serve the built React application
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Expose the port for the frontend application
EXPOSE 8880

# Run Nginx server
CMD ["nginx", "-g", "daemon off;"]
