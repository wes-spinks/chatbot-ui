FROM registry.access.redhat.com/ubi9/nodejs-20-minimal AS production

WORKDIR app_home

COPY . .
    
# Create .cache directories 
USER root

RUN npm install

# Expose the port the app will run on
USER 1001

EXPOSE 3000

# Start the application
CMD /bin/sh -c "npm run build && npm start"
