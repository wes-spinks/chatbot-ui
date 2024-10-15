FROM registry.access.redhat.com/ubi9/nodejs-20-minimal AS production

WORKDIR app_home

COPY node_modules ./node_modules
COPY dist ./dist
COPY package*.json ./
    
# Create .cache directories 
USER root

# Install npm
RUN microdnf install -y npm

# Install srdv
RUN npm install -g snyk-resolve-deps

# Expose the port the app will run on
USER 1001

EXPOSE 3000

# Start the application
CMD ["npm", "start"]
