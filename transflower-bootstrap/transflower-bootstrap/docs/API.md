# Transflower API Documentation

This document describes the Express API used by the Transflower project.

## Base URL

```text
http://localhost:3000/api
```

## Response Format

Most API responses use this shape:

```json
{
  "success": true,
  "message": "Action completed."
}
```

Error responses use:

```json
{
  "success": false,
  "message": "Error message."
}
```

## Status Codes

| Status | Meaning |
| --- | --- |
| 200 | Successful read or update |
| 201 | Resource created |
| 400 | Missing or invalid request data |
| 401 | Login failed |
| 404 | Resource not found |
| 409 | Duplicate email during registration |

## Health

### GET `/health`

Checks if the backend server is running.

Example:

```bash
curl http://localhost:3000/api/health
```

Success response:

```json
{
  "success": true,
  "message": "Transflower API is running",
  "timestamp": "2026-05-04T05:31:56.000Z"
}
```

## Products

### GET `/products`

Returns all products.

Example:

```bash
curl http://localhost:3000/api/products
```

Success response:

```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Red Roses",
      "price": 499,
      "category": "Roses",
      "image": "image/red rose.jpg"
    }
  ]
}
```

### GET `/products/:id`

Returns one product by id.

Example:

```bash
curl http://localhost:3000/api/products/1
```

Success response:

```json
{
  "success": true,
  "product": {
    "id": 1,
    "name": "Red Roses",
    "price": 499,
    "category": "Roses",
    "image": "image/red rose.jpg"
  }
}
```

Not found response:

```json
{
  "success": false,
  "message": "Product not found."
}
```

## Authentication

### POST `/auth/register`

Registers a new user.

Request body:

```json
{
  "name": "Asha Flower",
  "email": "asha@example.com",
  "password": "pass123",
  "phone": "9876543210"
}
```

PowerShell example:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/auth/register" `
  -ContentType "application/json" `
  -Body '{"name":"Asha Flower","email":"asha@example.com","password":"pass123","phone":"9876543210"}'
```

Success response:

```json
{
  "success": true,
  "message": "Registration successful.",
  "user": {
    "id": 3,
    "name": "Asha Flower",
    "email": "asha@example.com",
    "phone": "9876543210",
    "registeredAt": "2026-05-04T05:34:08.843Z"
  }
}
```

Duplicate email response:

```json
{
  "success": false,
  "message": "Email already registered."
}
```

### POST `/auth/login`

Logs in an existing user.

Request body:

```json
{
  "email": "john@example.com",
  "password": "pass123"
}
```

PowerShell example:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/auth/login" `
  -ContentType "application/json" `
  -Body '{"email":"john@example.com","password":"pass123"}'
```

Success response:

```json
{
  "success": true,
  "message": "Login successful.",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

Invalid login response:

```json
{
  "success": false,
  "message": "Invalid email or password."
}
```

Demo users:

| Email | Password |
| --- | --- |
| john@example.com | pass123 |
| jane@example.com | pass123 |

## Cart

Cart routes use the user id in the URL.

Example user id:

```text
1
```

### GET `/cart/:userId`

Returns the cart for a user.

Example:

```bash
curl http://localhost:3000/api/cart/1
```

Success response:

```json
{
  "success": true,
  "cart": [],
  "total": 0
}
```

### POST `/cart/:userId/items`

Adds a product to a user's cart.

Request body:

```json
{
  "productId": 1,
  "quantity": 2
}
```

PowerShell example:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/cart/1/items" `
  -ContentType "application/json" `
  -Body '{"productId":1,"quantity":2}'
```

Success response:

```json
{
  "success": true,
  "message": "Product added to cart.",
  "cart": [
    {
      "id": 1,
      "name": "Red Roses",
      "price": 499,
      "category": "Roses",
      "image": "image/red rose.jpg",
      "quantity": 2
    }
  ],
  "total": 998
}
```

### PATCH `/cart/:userId/items/:productId`

Updates a product quantity in the cart. If `quantity` is `0` or lower, the item is removed.

Request body:

```json
{
  "quantity": 3
}
```

PowerShell example:

```powershell
Invoke-RestMethod -Method Patch `
  -Uri "http://localhost:3000/api/cart/1/items/1" `
  -ContentType "application/json" `
  -Body '{"quantity":3}'
```

Success response:

```json
{
  "success": true,
  "message": "Cart updated.",
  "cart": [
    {
      "id": 1,
      "name": "Red Roses",
      "price": 499,
      "category": "Roses",
      "image": "image/red rose.jpg",
      "quantity": 3
    }
  ],
  "total": 1497
}
```

### DELETE `/cart/:userId/items/:productId`

Removes one product from the cart.

Example:

```bash
curl -X DELETE http://localhost:3000/api/cart/1/items/1
```

Success response:

```json
{
  "success": true,
  "message": "Cart item removed.",
  "cart": [],
  "total": 0
}
```

### DELETE `/cart/:userId`

Clears the full cart for a user.

Example:

```bash
curl -X DELETE http://localhost:3000/api/cart/1
```

Success response:

```json
{
  "success": true,
  "message": "Cart cleared.",
  "cart": []
}
```

## Orders

### GET `/orders/:userId`

Returns all orders for a user.

Example:

```bash
curl http://localhost:3000/api/orders/1
```

Success response:

```json
{
  "success": true,
  "orders": []
}
```

### POST `/orders/:userId`

Places an order from the user's current backend cart. The cart must contain at least one item.

Request body:

```json
{
  "address": "Pune, Maharashtra",
  "phone": "9876543210",
  "paymentMethod": "Cash on Delivery"
}
```

PowerShell example:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/orders/1" `
  -ContentType "application/json" `
  -Body '{"address":"Pune, Maharashtra","phone":"9876543210","paymentMethod":"Cash on Delivery"}'
```

Success response:

```json
{
  "success": true,
  "message": "Order placed successfully.",
  "order": {
    "orderId": "ORD-1777872848893",
    "userId": 1,
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "items": [
      {
        "id": 1,
        "name": "Red Roses",
        "price": 499,
        "category": "Roses",
        "image": "image/red rose.jpg",
        "quantity": 2
      }
    ],
    "total": 998,
    "address": "Pune, Maharashtra",
    "phone": "9876543210",
    "paymentMethod": "Cash on Delivery",
    "status": "Pending",
    "orderDate": "2026-05-04T05:34:08.893Z"
  }
}
```

Empty cart response:

```json
{
  "success": false,
  "message": "Cart is empty."
}
```

## Full API Test Flow

Use this order when testing manually:

```text
1. GET /api/health
2. GET /api/products
3. POST /api/auth/login
4. POST /api/cart/1/items
5. GET /api/cart/1
6. PATCH /api/cart/1/items/1
7. POST /api/orders/1
8. GET /api/orders/1
```

## MySQL Database

The API reads and writes the MySQL database:

```text
transflower
```

Tables:

```text
users
products
carts
orders
order_items
```

The server creates these tables automatically. You can also run the manual script:

```text
backend/database/schema.sql
```

This storage is for demo use only. In production, never store plain-text passwords.
