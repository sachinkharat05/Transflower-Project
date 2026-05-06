# Transflower Setup Guide

This guide explains how to install, run, test, and troubleshoot the full Transflower project.

## 1. Open the Project Folder

In PowerShell or Command Prompt:

```powershell
cd S:\transflower-bootstrap
```

## 2. Install Dependencies

Run:

```bash
npm install
```

Expected result:

```text
found 0 vulnerabilities
```

## 3. Start the Project

Initialize the MySQL database first:

```bash
npm run db:setup-user
npm run db:init
npm run db:test
```

This creates the database, tables, demo users, and demo products.

Recommended command:

```bash
npm start
```

Alternative command:

```bash
node server.js
```

Direct backend command:

```bash
node backend/server.js
```

Expected terminal output:

```text
Transflower full project running at http://localhost:3000
API health check: http://localhost:3000/api/health
```

## 4. Open in Browser

Frontend:

```text
http://localhost:3000
```

API health endpoint:

```text
http://localhost:3000/api/health
```

## MySQL Setup

The server uses `mysql2` and attempts to connect to MySQL when it starts.

Default settings:

```text
DB_HOST=localhost
DB_PORT=3306
DB_USER=transflower_user
DB_PASSWORD=transflower123
DB_NAME=transflower
```

The server creates the `transflower` database automatically if the MySQL user has permission.
It also creates and seeds these tables automatically:

```text
users
products
carts
orders
order_items
```

Manual SQL file:

```text
backend/database/schema.sql
```

If you do not want to use your MySQL `root` account in Node.js, open MySQL Workbench and run:

```text
backend/database/create-user.sql
```

Then create `.env` in the project root:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=transflower_user
DB_PASSWORD=transflower123
DB_NAME=transflower
```

If you prefer setup from terminal, set your MySQL admin password and run:

```powershell
$env:DB_ADMIN_USER="root"
$env:DB_ADMIN_PASSWORD="your_root_password"
npm run db:setup-user
npm run db:init
npm run db:test
```

To use different settings, create a `.env` file from `.env.example`. The server loads `.env` automatically with `dotenv`.

PowerShell example:

```powershell
$env:DB_USER="transflower_user"
$env:DB_PASSWORD="transflower123"
$env:DB_NAME="transflower"
npm start
```

Successful startup logs:

```text
MySQL connected
MySQL database initialized
Server listening on port 3000
```

If `npm run db:test` says `Access denied for user 'transflower_user'`, the app code is reaching MySQL but the MySQL account does not exist or has a different password. Run `npm run db:setup-user` with a valid `DB_ADMIN_PASSWORD`, or run `backend/database/create-user.sql` in MySQL Workbench as an admin user.

## 5. Login Details

Use either demo account:

```text
john@example.com / pass123
jane@example.com / pass123
```

## 6. Verify API with PowerShell

Health:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/health"
```

Products:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/products"
```

Login:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/auth/login" `
  -ContentType "application/json" `
  -Body '{"email":"john@example.com","password":"pass123"}'
```

Add cart item:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/cart/1/items" `
  -ContentType "application/json" `
  -Body '{"productId":1,"quantity":2}'
```

Place order:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/orders/1" `
  -ContentType "application/json" `
  -Body '{"address":"Pune, Maharashtra","phone":"9876543210","paymentMethod":"Cash on Delivery"}'
```

## 7. Common Problems

### Cannot find module `server.js`

Run the command from:

```text
S:\transflower-bootstrap
```

Then run:

```bash
node server.js
```

### Port 3000 is already used

Stop the other running server, or use a different port.

PowerShell:

```powershell
$env:PORT=4000
npm start
```

Then open:

```text
http://localhost:4000
```

### API says connection refused

The server is not running. Start it:

```bash
npm start
```

### Login works but cart is empty after login

Guest items live in `localStorage` (`tf_guest_cart`) until you log in; they are then merged into MySQL. If you cleared site data or used another browser, the guest cart will not be there.

### Reset backend demo data in MySQL

Run these SQL commands:

```sql
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM carts;
```

Keep the demo users and products.

## 8. Development Notes

The backend source is split by responsibility:

```text
routes -> controllers -> config/db.js -> MySQL
```

Example:

```text
backend/src/routes/cartRoutes.js
backend/src/controllers/cartController.js
backend/src/config/db.js
backend/database/schema.sql
```

## 9. Production Improvements

Before real deployment:

- Add password hashing.
- Add token-based authentication.
- Use MongoDB, PostgreSQL, or MySQL.
- Add request validation middleware.
- Add error-handling middleware.
- Add tests.
- Configure production CORS.
- Store secrets in environment variables.
