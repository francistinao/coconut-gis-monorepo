FROM richarvey/nginx-php-fpm:1.7.2

WORKDIR /var/www/html

COPY . .

RUN composer install --optimize-autoloader --no-dev

ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr
ENV COMPOSER_ALLOW_SUPERUSER 1

# Run the default startup script
CMD ["/start.sh"]
