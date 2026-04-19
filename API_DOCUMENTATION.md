# EosCarbon Protocol - API Documentation

This document provides the exact formats for requests and responses to the EosCarbon backend.

## 🔗 Global Configuration

- **Base URL**: `https://ec1-backend.onrender.com/api`
- **Content-Type**: `application/json`
- **Authentication**: Most endpoints require a Bearer Token in the headers:
  ```http
  Authorization: Bearer <your_access_token>
  ```

---

## 🔐 1. Authentication Bridge (`/api/auth`)

### Register User
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password@123",
    "role": "FARMER" // Options: FARMER, BUSINESSMAN, NGO, GOVERNMENT
  }
  ```
- **Response (201 Created)**:
  ```json
  { "message": "Registration successful. Please check your email for OTP verification." }
  ```

### Verify OTP
- **Endpoint**: `POST /api/auth/verify-otp`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otp": "123456"
  }
  ```
- **Response (200 OK)**:
  ```json
  { "message": "Email verified successfully. You can now login." }
  ```

### Login
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "government@agriculture.gov.in",
    "password": "Government@123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "accessToken": "eyJhbG...",
    "refreshToken": "...",
    "tokenType": "Bearer",
    "role": "GOVERNMENT",
    "userId": "6622...",
    "email": "government@agriculture.gov.in"
  }
  ```

---

## 🚜 2. Farmer Portal (`/api/farmer-carbon`, `/api/farmer-land`)

### Create Land
- **Endpoint**: `POST /api/farmer-land/create`
- **Request Body**:
  ```json
  {
    "landArea": 15.5,
    "landAddress": "123 Green Valley, Punjab",
    "soilType": "Alluvial",
    "latitude": 30.7333,
    "longitude": 76.7794
  }
  ```

### Generate Carbon Credit
- **Endpoint**: `POST /api/farmer-carbon/create`
- **Request Body**:
  ```json
  {
    "landId": "LAND_ID_HERE",
    "carbonAmount": 500.0,
    "carbonType": "SOIL_REGENERATION",
    "methodology": "Verra VM0042",
    "projectName": "Valley Reforestation 2024",
    "validityYears": 5,
    "assessmentDate": "2024-04-19T10:00:00"
  }
  ```

### List Credit for Sale
- **Endpoint**: `POST /api/farmer-carbon/list-for-sale`
- **Request Body**:
  ```json
  {
    "creditId": "CREDIT_ID",
    "pricePerTon": 25.50
  }
  ```

---

## 💼 3. Businessman Portal (`/api/businessman-carbon`)

### Get Marketplace Listings
- **Endpoint**: `GET /api/businessman-carbon/marketplace`
- **Response**: Array of listing objects with `creditId`, `pricePerTon`, `farmerName`, etc.

### Buy Carbon Credits
- **Endpoint**: `POST /api/transaction/buy` (Wait: Check `TransactionController` for exact path)
- **Request Body**:
  ```json
  {
    "creditId": "CREDIT_ID",
    "quantity": 100
  }
  ```

---

## 🛡️ 4. NGO / Verifier Portal (`/api/ngo-carbon`)

### Get Pending Verifications
- **Endpoint**: `GET /api/ngo-carbon/pending-verification`
- **Response**: List of credits awaiting approval.

### Verify/Approve Credit
- **Endpoint**: `PUT /api/ngo-carbon/verify`
- **Request Body**:
  ```json
  {
    "creditId": "CREDIT_ID",
    "comments": "Verified and site visit completed."
  }
  ```

---

## 🏛️ 5. Government Portal (`/api/government`)

### Register New NGO
- **Endpoint**: `POST /api/government/ngo`
- **Request Body**:
  ```json
  {
    "email": "ngo@verifier.org",
    "password": "SecurePassword123",
    "ngoName": "Green Earth NGO",
    "licenseNumber": "NGO-9988-IN"
  }
  ```

---

## ❌ 6. Error Handling

When an error occurs, the backend returns a JSON with the following format:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid password format",
  "fieldErrors": [
    {
      "field": "password",
      "message": "Password must contain at least one special character"
    }
  ],
  "timestamp": "2024-04-19T16:25:00"
}
```

### Common HTTP Status Codes:
- **200/201**: Success.
- **400**: Validation Failed (check `fieldErrors`).
- **401**: Unauthorized (Token missing or invalid).
- **403**: Forbidden (You don't have the right Role).
- **404**: Resource (Land/Credit) not found.
- **500**: Internal server error.
