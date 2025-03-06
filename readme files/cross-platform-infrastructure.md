# FootballChess Cross-Platform Development Infrastructure

## Overview

This document outlines the comprehensive development infrastructure for the FootballChess project, enabling seamless development and deployment across multiple platforms while maintaining a consistent experience. The setup leverages DevContainers, Docker, environment configuration, and modern CI/CD practices to ensure a smooth development workflow.

## Repository Structure

```
/footballchess/
├── .devcontainer/                # Development container configurations
│   ├── devcontainer.json         # Main DevContainer configuration
│   ├── docker-compose.yml        # Multi-container setup for development
│   └── Dockerfile                # Development environment image
├── .github/
│   └── workflows/                # GitHub Actions CI/CD pipelines
├── docker/                       # Production Docker configurations
│   ├── api/                      # API server Docker setup
│   ├── client/                   # Client Docker setup
│   ├── database/                 # Database Docker setup
│   └── nginx/                    # Reverse proxy configuration
├── packages/                     # Monorepo packages
│   ├── core/                     # Shared game logic and types
│   ├── api/                      # Backend API service
│   ├── web/                      # Web client (React)
│   ├── mobile/                   # React Native mobile app
│   │   ├── android/              # Android-specific code
│   │   └── ios/                  # iOS-specific code
│   └── desktop/                  # Electron desktop app
├── .env.example                  # Example environment variables
├── docker-compose.yml            # Production multi-container setup
└── package.json                  # Root package configuration
```

## DevContainer Setup

### `.devcontainer/devcontainer.json`

```json
{
  "name": "FootballChess Development",
  "dockerComposeFile": "docker-compose.yml",
  "service": "dev",
  "workspaceFolder": "/workspace",
  
  "settings": {
    "terminal.integrated.shell.linux": "/bin/bash",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  },
  
  "extensions": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-azuretools.vscode-docker",
    "ms-vsliveshare.vsliveshare",
    "mongodb.mongodb-vscode",
    "redhat.vscode-yaml",
    "graphql.vscode-graphql",
    "mikestead.dotenv"
  ],
  
  "forwardPorts": [3000, 4000, 8080, 27017, 6379],
  
  "postCreateCommand": "yarn install && yarn setup",
  
  "remoteUser": "node",
  
  "features": {
    "docker-in-docker": "latest",
    "github-cli": "latest",
    "azure-cli": "latest"
  }
}
```

### `.devcontainer/docker-compose.yml`

```yaml
version: '3.8'

services:
  dev:
    build: 
      context: ..
      dockerfile: .devcontainer/Dockerfile
    volumes:
      - ..:/workspace:cached
      - node_modules:/workspace/node_modules
      - ~/.ssh:/home/node/.ssh
      - /var/run/docker.sock:/var/run/docker.sock
    command: sleep infinity
    environment:
      - NODE_ENV=development
    env_file: ../.env.development
    networks:
      - footballchess-network
  
  mongodb:
    image: mongo:latest
    restart: unless-stopped
    volumes:
      - mongodb-data:/data/db
    networks:
      - footballchess-network
  
  redis:
    image: redis:alpine
    restart: unless-stopped
    volumes:
      - redis-data:/data
    networks:
      - footballchess-network

  postgres:
    image: postgres:13
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-footballchess}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - footballchess-network

networks:
  footballchess-network:
    driver: bridge

volumes:
  node_modules:
  mongodb-data:
  redis-data:
  postgres-data:
```

### `.devcontainer/Dockerfile`

```dockerfile
FROM node:18-bullseye

# Install additional tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    jq \
    python3 \
    python3-pip \
    openjdk-11-jdk \
    ruby-full \
    build-essential \
    cmake \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Android SDK
ENV ANDROID_HOME=/opt/android-sdk
RUN mkdir -p ${ANDROID_HOME}
RUN wget -q https://dl.google.com/android/repository/commandlinetools-linux-9123335_latest.zip -O /tmp/android-sdk.zip \
    && unzip -q /tmp/android-sdk.zip -d ${ANDROID_HOME}/cmdline-tools \
    && rm /tmp/android-sdk.zip \
    && mv ${ANDROID_HOME}/cmdline-tools/* ${ANDROID_HOME}/cmdline-tools/latest \
    && yes | ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager --licenses \
    && ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

# Install iOS build tools
RUN gem install fastlane cocoapods

# Install global node packages
RUN npm install -g yarn firebase-tools @aws-amplify/cli

# Create app directory with proper permissions
WORKDIR /workspace
RUN chown -R node:node /workspace

# Switch to non-root user
USER node

# Set environment variables for tools
ENV PATH="${PATH}:${ANDROID_HOME}/platform-tools"
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
```

## Environment Configuration

### `.env.example`

```env
# Core Application Settings
NODE_ENV=development
APP_NAME=FootballChess
API_PORT=4000
WEB_PORT=3000
LOG_LEVEL=debug

# Database Credentials
MONGODB_URI=mongodb://mongodb:27017/footballchess
REDIS_URI=redis://redis:6379
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=footballchess
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=86400
COOKIE_SECRET=your_cookie_secret_here

# Third-Party Services
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_APP_ID=your_firebase_app_id

# AWS Services
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET=footballchess-assets

# Payment Processing
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Push Notifications
FCM_SERVER_KEY=your_fcm_server_key
APNS_KEY_ID=your_apns_key_id
APNS_TEAM_ID=your_apns_team_id
APNS_BUNDLE_ID=com.yourcompany.footballchess

# Game Services
MATCHMAKING_TIMEOUT=60000
DEFAULT_ELO_RATING=1200
MAXIMUM_RECONNECT_TIME=120000

# Analytics
GOOGLE_ANALYTICS_ID=your_google_analytics_id
AMPLITUDE_API_KEY=your_amplitude_api_key

# Feature Flags
ENABLE_TOURNAMENTS=true
ENABLE_CLANS=false
ENABLE_CHAT=true
```

## Docker Production Setup

### `docker-compose.yml`

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: docker/api/Dockerfile
    restart: always
    env_file: .env
    depends_on:
      - mongodb
      - redis
      - postgres
    networks:
      - footballchess-network
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure

  web:
    build:
      context: .
      dockerfile: docker/client/Dockerfile.web
    restart: always
    env_file: .env
    networks:
      - footballchess-network
    depends_on:
      - api

  matchmaking:
    build:
      context: .
      dockerfile: docker/api/Dockerfile.matchmaking
    restart: always
    env_file: .env
    depends_on:
      - redis
    networks:
      - footballchess-network

  game-server:
    build:
      context: .
      dockerfile: docker/api/Dockerfile.game
    restart: always
    env_file: .env
    depends_on:
      - mongodb
      - redis
    networks:
      - footballchess-network
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure

  mongodb:
    image: mongo:latest
    restart: always
    volumes:
      - mongodb-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_INITDB_ROOT_USERNAME:-root}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_INITDB_ROOT_PASSWORD:-rootpassword}
    networks:
      - footballchess-network
    deploy:
      resources:
        limits:
          memory: 1G

  redis:
    image: redis:alpine
    restart: always
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-redispassword}
    networks:
      - footballchess-network
    deploy:
      resources:
        limits:
          memory: 512M

  postgres:
    image: postgres:13
    restart: always
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-footballchess}
    networks:
      - footballchess-network
    deploy:
      resources:
        limits:
          memory: 1G

  nginx:
    build:
      context: .
      dockerfile: docker/nginx/Dockerfile
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/conf.d:/etc/nginx/conf.d
      - ./docker/nginx/ssl:/etc/nginx/ssl
      - static-assets:/var/www/static
    depends_on:
      - api
      - web
      - game-server
    networks:
      - footballchess-network

networks:
  footballchess-network:
    driver: bridge

volumes:
  mongodb-data:
  redis-data:
  postgres-data:
  static-assets:
```

### `docker/api/Dockerfile`

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock lerna.json ./
COPY packages/core/package.json ./packages/core/
COPY packages/api/package.json ./packages/api/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY packages/core ./packages/core
COPY packages/api ./packages/api

# Build packages
RUN yarn workspace @footballchess/core build
RUN yarn workspace @footballchess/api build

# Production image
FROM node:18-alpine

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Copy built packages and dependencies
COPY --from=builder /app/package.json /app/yarn.lock /app/lerna.json ./
COPY --from=builder /app/packages/core/package.json ./packages/core/
COPY --from=builder /app/packages/api/package.json ./packages/api/
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/api/dist ./packages/api/dist

# Install production dependencies only
RUN yarn install --frozen-lockfile --production

# Expose API port
EXPOSE 4000

# Start the API server
CMD ["node", "packages/api/dist/index.js"]
```

### `docker/client/Dockerfile.web`

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock lerna.json ./
COPY packages/core/package.json ./packages/core/
COPY packages/web/package.json ./packages/web/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY packages/core ./packages/core
COPY packages/web ./packages/web

# Build packages
RUN yarn workspace @footballchess/core build
RUN yarn workspace @footballchess/web build

# Production stage
FROM nginx:alpine

# Copy nginx configuration
COPY docker/nginx/conf.d/web.conf /etc/nginx/conf.d/default.conf

# Copy built static files
COPY --from=builder /app/packages/web/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### `docker/nginx/conf.d/default.conf`

```nginx
# Default server configuration
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # Redirect all HTTP requests to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name footballchess.com www.footballchess.com;

    # SSL configuration
    ssl_certificate /etc/nginx/ssl/footballchess.com.crt;
    ssl_certificate_key /etc/nginx/ssl/footballchess.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1h;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Web application
    location / {
        proxy_pass http://web:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API endpoints
    location /api/ {
        proxy_pass http://api:4000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket for game
    location /socket.io/ {
        proxy_pass http://game-server:8080/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static assets
    location /static/ {
        alias /var/www/static/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

## CI/CD Pipelines

### `.github/workflows/build.yml`

```yaml
name: Build and Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      - name: Lint code
        run: yarn lint

  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:latest
        ports:
          - 27017:27017
      redis:
        image: redis:alpine
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      - name: Run tests
        run: yarn test

  build-web:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      - name: Build web app
        run: yarn workspace @footballchess/web build
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: web-build
          path: packages/web/build/

  build-api:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      - name: Build API
        run: yarn workspace @footballchess/api build
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: api-build
          path: packages/api/dist/

  build-mobile:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      - name: Set up JDK
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '11'
      - name: Build Android app
        run: yarn workspace @footballchess/mobile android:build
      - name: Upload Android build
        uses: actions/upload-artifact@v3
        with:
          name: android-build
          path: packages/mobile/android/app/build/outputs/apk/release/
```

### `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [ main ]
    tags:
      - 'v*'

jobs:
  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: Login to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - name: Build and push API
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./docker/api/Dockerfile
          push: true
          tags: footballchess/api:latest
      - name: Deploy to AWS ECS
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: .aws/task-definitions/api.json
          service: footballchess-api
          cluster: footballchess
          wait-for-service-stability: true

  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Download web build
        uses: actions/download-artifact@v3
        with:
          name: web-build
          path: web-build
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - name: Deploy to S3
        run: aws s3 sync web-build/ s3://footballchess-web/ --delete
      - name: Invalidate CloudFront cache
        run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"

  deploy-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Download Android build
        uses: actions/download-artifact@v3
        with:
          name: android-build
          path: android-build
      - name: Upload to Google Play
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON }}
          packageName: com.footballchess.app
          releaseFiles: android-build/app-release.apk
          track: internal
          status: completed
      - name: Build iOS app
        uses: maierj/fastlane-action@v2.3.0
        with:
          lane: beta
          subdirectory: packages/mobile/ios
```

## Environment Management

### Environment Handling with dotenv

Create a script to manage environment configurations:

```javascript
// scripts/setup-env.js
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const envFile = path.join(__dirname, '..', '.env');
const exampleEnvFile = path.join(__dirname, '..', '.env.example');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if .env file exists
if (!fs.existsSync(envFile)) {
  console.log('Creating .env file from .env.example...');
  
  // Read .env.example file
  const exampleEnv = fs.readFileSync(exampleEnvFile, 'utf8');
  const envVars = exampleEnv.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  // Create .env file with user input
  const newEnvContent = [];
  
  const askForValue = (index) => {
    if (index >= envVars.length) {
      fs.writeFileSync(envFile, newEnvContent.join('\n'));
      console.log('.env file created successfully!');
      rl.close();
      return;
    }
    
    const line = envVars[index];
    const [key, defaultValue] = line.split('=');
    
    rl.question(`Enter value for ${key} (default: ${defaultValue}): `, (value) => {
      newEnvContent.push(`${key}=${value || defaultValue}`);
      askForValue(index + 1);
    });
  };
  
  askForValue(0);
} else {
  console.log('.env file already exists.');
  rl.close();
}
```

### Environment Loading in Different Files

#### React Native (mobile)

```javascript
// packages/mobile/src/config/env.js
import { Platform } from 'react-native';
import Config from 'react-native-config';

const ENV = {
  API_URL: Config.API_URL || 'https://api.footballchess.com',
  SOCKET_URL: Config.SOCKET_URL || 'https://game.footballchess.com',
  ENV: Config.NODE_ENV || 'development',
  PLATFORM: Platform.OS,
  VERSION: Config.VERSION || '1.0.0',
  BUILD: Config.BUILD_NUMBER || '1',
  // ... other environment variables
};

export default ENV;
```

#### React (web)

```javascript
// packages/web/src/config/env.js
const ENV = {
  API_URL: process.env.REACT_APP_API_URL || 'https://api.footballchess.com',
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'https://game.footballchess.com',
  ENV: process.env.NODE_ENV || 'development',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  // ... other environment variables
};

export default ENV;
```

#### Node.js (API)

```javascript
// packages/api/src/config/env.js
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.API_PORT || 4000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/footballchess',
  REDIS_URI: process.env.REDIS_URI || 'redis://localhost:6379',
  // ... other environment variables
};

export default ENV;
```

## Cross-Platform Database Migration

```javascript
// packages/api/src/db/migrations/index.js
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import ENV from '../../config/env';

const runMigrations = async () => {
  const client = new MongoClient(ENV.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Get migration collection
    const migrationsCollection = db.collection('migrations');
    
    // Get all migration files
    const migrationsDir = path.join(__dirname, 'scripts');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort();
    
    // Get already executed migrations
    const executedMigrations = await migrationsCollection.find().toArray();
    const executedMigrationNames = new Set(executedMigrations.map(m => m.name));
    
    // Execute pending migrations
    for (const file of migrationFiles) {
      if (!executedMigrationNames.has(file)) {
        console.log(`Running migration: ${file}`);
        
        const migration = require(path.join(migrationsDir, file));
        await migration.up(db);
        
        // Record migration
        await migrationsCollection.insertOne({
          name: file,
          executedAt: new Date()
        });
        
        console.log(`Migration completed: ${file}`);
      }
    }
    
    console.log('All migrations completed!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
};

export default runMigrations;
```

## Multi-Platform Build Configuration

### Root `package.json`

```json
{
  "name": "footballchess",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "setup": "node scripts/setup-env.js",
    "start": "yarn workspace @footballchess/api start & yarn workspace @footballchess/web start",
    "build": "lerna run build",
    "test": "lerna run test",
    "lint": "lerna run lint",
    "dev": "lerna run --parallel dev",
    "mobile:android": "yarn workspace @footballchess/mobile android",
    "mobile:ios": "yarn workspace @footballchess/mobile ios",
    "desktop": "yarn workspace @footballchess/desktop start",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:build": "docker-compose build",
    "release": "lerna version",
    "deploy": "lerna run deploy"
  },
  "devDependencies": {
    "lerna": "^6.0.0",
    "concurrently": "^7.6.0",
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix"
    ]
  }
}
```

## Cross-Platform Testing Setup

### Jest Configuration

```javascript
// jest.config.js in core package
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

// jest.config.js in web package
module.exports = {
  preset: 'react-scripts',
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    # FootballChess Cross-Platform Development Infrastructure

## Overview

This document outlines the comprehensive development infrastructure for the FootballChess project, enabling seamless development and deployment across multiple platforms while maintaining a consistent experience. The setup leverages DevContainers, Docker, environment configuration, and modern CI/CD practices to ensure a smooth development workflow.

## Repository Structure

```
/footballchess/
├── .devcontainer/                # Development container configurations
│   ├── devcontainer.json         # Main DevContainer configuration
│   ├── docker-compose.yml        # Multi-container setup for development
│   └── Dockerfile                # Development environment image
├── .github/
│   └── workflows/                # GitHub Actions CI/CD pipelines
├── docker/                       # Production Docker configurations
│   ├── api/                      # API server Docker setup
│   ├── client/                   # Client Docker setup
│   ├── database/                 # Database Docker setup
│   └── nginx/                    # Reverse proxy configuration
├── packages/                     # Monorepo packages
│   ├── core/                     # Shared game logic and types
│   ├── api/                      # Backend API service
│   ├── web/                      # Web client (React)
│   ├── mobile/                   # React Native mobile app
│   │   ├── android/              # Android-specific code
│   │   └── ios/                  # iOS-specific code
│   └── desktop/                  # Electron desktop app
├── .env.example                  # Example environment variables
├── docker-compose.yml            # Production multi-container setup
└── package.json                  # Root package configuration
```

## DevContainer Setup

### `.devcontainer/devcontainer.json`

```json
{
  "name": "FootballChess Development",
  "dockerComposeFile": "docker-compose.yml",
  "service": "dev",
  "workspaceFolder": "/workspace",
  
  "settings": {
    "terminal.integrated.shell.linux": "/bin/bash",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  },
  
  "extensions": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-azuretools.vscode-docker",
    "ms-vsliveshare.vsliveshare",
    "mongodb.mongodb-vscode",
    "redhat.vscode-yaml",
    "graphql.vscode-graphql",
    "mikestead.dotenv"
  ],
  
  "forwardPorts": [3000, 4000, 8080, 27017, 6379],
  
  "postCreateCommand": "yarn install && yarn setup",
  
  "remoteUser": "node",
  
  "features": {
    "docker-in-docker": "latest",
    "github-cli": "latest",
    "azure-cli": "latest"
  }
}
```

### `.devcontainer/docker-compose.yml`

```yaml
version: '3.8'

services:
  dev:
    build: 
      context: ..
      dockerfile: .devcontainer/Dockerfile
    volumes:
      - ..:/workspace:cached
      - node_modules:/workspace/node_modules
      - ~/.ssh:/home/node/.ssh
      - /var/run/docker.sock:/var/run/docker.sock
    command: sleep infinity
    environment:
      - NODE_ENV=development
    env_file: ../.env.development
    networks:
      - footballchess-network
  
  mongodb:
    image: mongo:latest
    restart: unless-stopped
    volumes:
      - mongodb-data:/data/db
    networks:
      - footballchess-network
  
  redis:
    image: redis:alpine
    restart: unless-stopped
    volumes:
      - redis-data:/data
    networks:
      - footballchess-network

  postgres:
    image: postgres:13
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-footballchess}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - footballchess-network

networks:
  footballchess-network:
    driver: bridge

volumes:
  node_modules:
  mongodb-data:
  redis-data:
  postgres-data:
```

### `.devcontainer/Dockerfile`

```dockerfile
FROM node:18-bullseye

# Install additional tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    jq \
    python3 \
    python3-pip \
    openjdk-11-jdk \
    ruby-full \
    build-essential \
    cmake \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Android SDK
ENV ANDROID_HOME=/opt/android-sdk
RUN mkdir -p ${ANDROID_HOME}
RUN wget -q https://dl.google.com/android/repository/commandlinetools-linux-9123335_latest.zip -O /tmp/android-sdk.zip \
    && unzip -q /tmp/android-sdk.zip -d ${ANDROID_HOME}/cmdline-tools \
    && rm /tmp/android-sdk.zip \
    && mv ${ANDROID_HOME}/cmdline-tools/* ${ANDROID_HOME}/cmdline-tools/latest \
    && yes | ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager --licenses \
    && ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

# Install iOS build tools
RUN gem install fastlane cocoapods

# Install global node packages
RUN npm install -g yarn firebase-tools @aws-amplify/cli

# Create app directory with proper permissions
WORKDIR /workspace
RUN chown -R node:node /workspace

# Switch to non-root user
USER node

# Set environment variables for tools
ENV PATH="${PATH}:${ANDROID_HOME}/platform-tools"
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
```

## Environment Configuration

### `.env.example`

```env
# Core Application Settings
NODE_ENV=development
APP_NAME=FootballChess
API_PORT=4000
WEB_PORT=3000
LOG_LEVEL=debug

# Database Credentials
MONGODB_URI=mongodb://mongodb:27017/footballchess
REDIS_URI=redis://redis:6379
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=footballchess
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=86400
COOKIE_SECRET=your_cookie_secret_here

# Third-Party Services
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_APP_ID=your_firebase_app_id

# AWS Services
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET=footballchess-assets

# Payment Processing
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Push Notifications
FCM_SERVER_KEY=your_fcm_server_key
APNS_KEY_ID=your_apns_key_id
APNS_TEAM_ID=your_apns_team_id
APNS_BUNDLE_ID=com.yourcompany.footballchess

# Game Services
MATCHMAKING_TIMEOUT=60000
DEFAULT_ELO_RATING=1200
MAXIMUM_RECONNECT_TIME=120000

# Analytics
GOOGLE_ANALYTICS_ID=your_google_analytics_id
AMPLITUDE_API_KEY=your_amplitude_api_key

# Feature Flags
ENABLE_TOURNAMENTS=true
ENABLE_CLANS=false
ENABLE_CHAT=true
```

## Docker Production Setup

### `docker-compose.yml`

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: docker/api/Dockerfile
    restart: always
    env_file: .env
    depends_on:
      - mongodb
      - redis
      - postgres
    networks:
      - footballchess-network
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure

  web:
    build:
      context: .
      dockerfile: docker/client/Dockerfile.web
    restart: always
    env_file: .env
    networks:
      - footballchess-network
    depends_on:
      - api

  matchmaking:
    build:
      context: .
      dockerfile: docker/api/Dockerfile.matchmaking
    restart: always
    env_file: .env
    depends_on:
      - redis
    networks:
      - footballchess-network

  game-server:
    build:
      context: .
      dockerfile: docker/api/Dockerfile.game
    restart: always
    env_file: .env
    depends_on:
      - mongodb
      - redis
    networks:
      - footballchess-network
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on