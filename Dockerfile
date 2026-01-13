FROM node:20-bullseye-slim AS node_builder

WORKDIR /app

# Install build deps
COPY package.json package-lock.json ./
RUN apt-get update && apt-get install -y ca-certificates curl --no-install-recommends && rm -rf /var/lib/apt/lists/*
RUN npm ci --silent
COPY . .
RUN npm run build

FROM php:8.4-fpm

# Install system deps
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpq-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    libpng-dev \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql pgsql mbstring xml zip bcmath gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application source
COPY . /var/www/html

# Copy built frontend from node stage into public
COPY --from=node_builder /app/dist /var/www/html/public/build

# Set permissions for Laravel
RUN mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache || true
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true

# Install PHP deps via composer (use no-dev in production)
RUN composer install --no-interaction --prefer-dist --optimize-autoloader || true

# Expose port (php-fpm will be behind nginx)
EXPOSE 9000

CMD ["php-fpm"]
