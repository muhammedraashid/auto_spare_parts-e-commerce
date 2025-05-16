
# Qitaf Auto Parts - Backend API

This is the Django REST Framework backend for the Qitaf Auto Parts e-commerce application.

## Project Setup

1. Create a virtual environment:
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory with the following content:
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=qitaf_auto
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

4. Run migrations:
```
python manage.py makemigrations
python manage.py migrate
```

5. Create a superuser:
```
python manage.py createsuperuser
```

6. Run the development server:
```
python manage.py runserver
```

## API Endpoints

### Authentication
- `POST /api/auth/token/` - Get authentication token
- `POST /api/auth/token/refresh/` - Refresh token
- `GET /api/auth/me/` - Get current user

### Products
- `GET /api/products/` - List products
- `GET /api/products/{id}/` - Retrieve product
- `GET /api/products/featured/` - List featured products
- `GET /api/products/top-rated/` - List top-rated products
- `POST /api/products/{id}/review/` - Add product review

### Categories
- `GET /api/categories/` - List categories

### Banners
- `GET /api/banners/` - List banners
- `GET /api/banners/active/` - List active banners

### Orders
- `GET /api/orders/` - List orders
- `POST /api/orders/` - Create order
- `GET /api/orders/{id}/` - Retrieve order
- `GET /api/orders/my-orders/` - List user orders

## Admin Access

Access the Django admin panel at `/admin/` to manage products, orders, users, and other resources.

## Documentation

API documentation is available at:
- Browsable API: [http://localhost:8000/api/](http://localhost:8000/api/)
