# Nyumba Hub

**A tenant-first platform for verified, recently vacated rentals in Kenya.**
No agents, no landlords. Just honest listings, community-confirmed availability, and transparent house reviews.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)
[![Laravel](https://img.shields.io/badge/Laravel-%3E%3D10-FF2D20?logo=laravel&logoColor=white)](#technologies-used)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](#technologies-used)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%3E%3D12-4169E1?logo=postgresql&logoColor=white)](#technologies-used)

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Steps](#steps)
- [Development Mode](#development-mode)
- [Additional Commands](#additional-commands)
- [License](#license)

## Project Description

Nyumba Hub addresses the challenges of house hunting in Kenya, particularly in Nairobi and satellite towns, where the process is expensive, time-consuming, and often opaque. The platform enables tenants who are moving out to post verified **"just vacated"** listings with condition reports and honest reviews. This creates a trusted inventory of real vacancies, reduces search friction, and encourages market transparency.

The platform does **not** require landlords, property managers, or agents to create listings, verify properties, respond to reviews, manage availability, receive leads, or pay for the service. Instead, trust is built through tenant-submitted evidence, time-sensitive listing lifecycles, and community confirmation.

## Features

- 🏠 Tenant-submitted vacancy reports with condition details and reviews
- ✅ Community verification of vacancy status
- ⭐ Trust score system based on evidence and community confirmations
- ⏱️ Time-sensitive listing lifecycle (upcoming, recently vacated, confirmed, archived)
- 📋 Structured house condition reports covering utilities, security, and hidden costs
- 📝 Former tenant reviews with factual, experience-based feedback
- 📷 Evidence submission including photos, videos, and blurred documents
- 🗺️ Location mapping with privacy controls

## Technologies Used

- **Laravel** (PHP Framework)
- **PostgreSQL**
- **React**
- **Inertia.js** (if applicable) or REST API
- **Tailwind CSS**
- **Leaflet** or **Google Maps API** for location mapping

## Installation

This is a standard Laravel project with a React frontend. Follow the steps below to set it up locally.

### Prerequisites

- PHP >= 8.1
- Composer
- PostgreSQL >= 12
- Node.js and NPM

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/nyumbahub.git
   cd nyumbahub
   ```

2. **Install PHP dependencies**

   ```bash
   composer install
   ```

3. **Install JavaScript dependencies**

   ```bash
   npm install
   ```

4. **Create environment file**

   ```bash
   cp .env.example .env
   ```

5. **Configure your PostgreSQL database** and other environment variables in the `.env` file

   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=nyumbahub
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

6. **Generate application key**

   ```bash
   php artisan key:generate
   ```

7. **Run database migrations and seeders**

   ```bash
   php artisan migrate --seed
   ```

8. **Build frontend assets**

   ```bash
   npm run build
   ```

9. **Start the development server**

   ```bash
   php artisan serve
   ```

The application will be available at [http://localhost:8000](http://localhost:8000).

## Development Mode

For development with hot reloading on the React frontend:

```bash
npm run dev
```

## Additional Commands

| Command | Description |
|---|---|
| `php artisan test` | Run tests |
| `php artisan cache:clear` | Clear cache |
| `php artisan route:list` | View routes |

## License

This project is open-source and available under the [MIT License](LICENSE).