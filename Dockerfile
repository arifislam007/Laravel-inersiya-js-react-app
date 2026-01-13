FROM php:8.4-cli-bullseye AS node_builder

WORKDIR /app

# Install Node 20 and other build deps so artisan (PHP 8.4) can run during build
COPY package.json package-lock.json ./
RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gnupg \
        unzip \
        git \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install composer in the node build stage (so php artisan can run)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN npm ci --silent
COPY . .

# Install PHP dependencies (no-dev) so artisan commands used by build plugins can execute
RUN composer install --no-interaction --prefer-dist --no-dev --no-scripts || true

# Run frontend build (Vite) which may call artisan via plugins
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
