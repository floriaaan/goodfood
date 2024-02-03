# Use an official Nginx image as the base image
FROM nginx

# Copy your custom Nginx configuration to the container
COPY ./apps/web/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy SSL certificates
COPY ./ssl/lets-encrypt/ /var/ssl/

# Expose ports 80 and 443
EXPOSE 80
EXPOSE 443
