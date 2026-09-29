# Gold Trading Backend System

A RESTful backend service for a Gold Trading System. This system allows users to register, deposit money, buy/sell gold, and withdraw money. It includes an Admin panel for user and transaction management.

## Features
- **User Management**: Register/Login with JWT Authentication (RBAC: user/admin).
- **Wallet Management**: Deposit/Withdraw simulation with transactions history and balance validation.
- **Gold Trading**: Buy and sell gold at a static mocked price with inventory validation.
- **Admin Panel**: View all users, view transactions (with search, filter, pagination), and Soft Delete users (Deactivate).
- **Security**: Password hashing (Bcrypt), Request validation (Zod), Rate Limiting.

## Technologies Used
- Node.js & TypeScript
- Express.js
- Sequelize ORM (MySQL)
- Docker & Docker Compose

## How to Run

### Using Docker (Recommended)
1. Ensure Docker and Docker Compose are installed.
2. Run the following command in the root directory:
   ```bash
   docker-compose up -d
   ```
3. The API will be available at `http://localhost:3000`.

### Running Locally
1. Ensure MySQL is running on your machine.
2. Configure your `.env` file with your DB credentials.
3. Install dependencies: `npm install`
4. Start the server: `npm run dev`
   *(Tables will be automatically synced upon server start)*

---

## API Documentation & Sample Requests

*Note: All protected routes require a JWT token in the header: `Authorization: Bearer <your_token>`*

### 1. Authentication
**Register**
- `POST /api/auth/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "message": "User registered successfully",
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "user" }
  }
  ```

**Login**
- `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOi...",
    "user": { "balance": 0, "goldBalance": 0, ... }
  }
  ```

### 2. Wallet (Requires Auth)
**Get Balance**
- `GET /api/wallet/balance`
- **Response** (200 OK):
  ```json
  {
    "balance": "1000.00",
    "goldBalance": "5.0000"
  }
  ```

**Deposit Money**
- `POST /api/wallet/deposit`
- **Body**:
  ```json
  {
    "amount": 1000
  }
  ```

**Withdraw Money**
- `POST /api/wallet/withdraw`
- **Body**:
  ```json
  {
    "amount": 500
  }
  ```

### 3. Gold Trading (Requires Auth)
*Note: Gold price is statically mocked at $65.00 per gram.*

**Buy Gold**
- `POST /api/trade/buy`
- **Body**:
  ```json
  {
    "goldAmount": 2
  }
  ```
- **Response** (200 OK): Returns updated balance and gold balance.

**Sell Gold**
- `POST /api/trade/sell`
- **Body**:
  ```json
  {
    "goldAmount": 1
  }
  ```

### 4. Admin Panel (Requires Admin Auth)
*(To test this, you must manually change a user's role to 'admin' in your database for the first admin)*

**Get All Users**
- `GET /api/admin/users?page=1&limit=10`
- **Response**: Paginated list of users.

**Get All Transactions**
- `GET /api/admin/transactions?type=deposit&page=1`
- **Query Params**: `page`, `limit`, `type`, `userId`, `startDate`, `endDate`

**Deactivate/Activate User (Soft Delete)**
- `PATCH /api/admin/users/:id/toggle-active`
- **Response**: Toggles `isActive` boolean.
