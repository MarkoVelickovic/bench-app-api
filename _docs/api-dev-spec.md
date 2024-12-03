# Bench App API Documentation

## Introduction

Welcome to the Bench App API documentation. This guide is intended for developers who wish to interact with the Bench App backend services. The API is built using Node.js and Express, leveraging Firebase services for authentication, database, and storage.

The API allows companies to:

- Sign up and log in.
- Create and manage their company profiles.
- Add and manage employees.
- Create and manage job positions.
- List employees and positions associated with their company.

---

## Table of Contents

- [Authentication](#authentication)
  - [Signup](#signup)
  - [Login](#login)
- [Company Endpoints](#company-endpoints)
  - [Create Company Profile](#create-company-profile)
  - [Get Company Details](#get-company-details)
  - [List All Companies](#list-all-companies)
- [Employee Endpoints](#employee-endpoints)
  - [Add Employee](#add-employee)
  - [Get Employee Details](#get-employee-details)
  - [Upload Employee CV](#upload-employee-cv)
  - [Download Employee CV](#download-employee-cv)
  - [List Employees for a Company](#list-employees-for-a-company)
- [Position Endpoints](#position-endpoints)
  - [Create Position](#create-position)
  - [Get Position Details](#get-position-details)
  - [List Positions for a Company](#list-positions-for-a-company)
- [Models](#models)
  - [User Model](#user-model)
  - [Company Model](#company-model)
  - [Employee Model](#employee-model)
  - [Position Model](#position-model)
- [Usage Examples](#usage-examples)
  - [Scenario: Listing Employees for a Company](#scenario-listing-employees-for-a-company)
  - [Scenario: Listing Positions for a Company](#scenario-listing-positions-for-a-company)
- [Conclusion](#conclusion)

---

## Authentication

All endpoints, except for signup and login, require authentication via a Firebase ID token provided in the `Authorization` header.

### Signup

**Endpoint:** `POST /auth/signup`

**Description:** Registers a new user (company).

**Request Headers:**

- `Content-Type: application/json`

**Request Body:**

```json
{
  "email": "company@example.com",
  "password": "SecurePassword123",
  "userType": "company",
  "displayName": "Company Name"
}
```

**Response:**

```json
{
  "message": "User registered successfully.",
  "token": "FIREBASE_CUSTOM_TOKEN"
}
```

### Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticates a user and returns a Firebase ID token.

**Request Headers:**

- `Content-Type: application/json`

**Request Body:**

```json
{
  "email": "company@example.com",
  "password": "SecurePassword123"
}
```

**Response:**

```json
{
  "message": "User logged in successfully.",
  "token": "FIREBASE_ID_TOKEN"
}
```

---

## Company Endpoints

### Create Company Profile

**Endpoint:** `POST /company/create`

**Description:** Creates a new company profile.

**Request Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer FIREBASE_ID_TOKEN`

**Request Body:**

```json
{
  "name": "Company Name",
  "logo": "https://example.com/logo.png",
  "coverImage": "https://example.com/cover.jpg",
  "description": "Company description.",
  "services": ["Service1", "Service2"],
  "location": "Company Location",
  "industry": "Industry",
  "contact": "contact@example.com",
  "yearFounded": 2020,
  "socialLinks": [
    "https://twitter.com/company",
    "https://linkedin.com/company/company"
  ],
  "industries": ["Industry1", "Industry2"]
}
```

**Response:**

```json
{
  "message": "Company profile created successfully.",
  "companyId": "COMPANY_ID"
}
```

### Get Company Details

**Endpoint:** `GET /company/:id`

**Description:** Retrieves detailed information about a company.

**Request Headers:**

- `Authorization: Bearer FIREBASE_ID_TOKEN`

**Response:**

```json
{
  "id": "COMPANY_ID",
  "name": "Company Name",
  "logo": "https://example.com/logo.png",
  "coverImage": "https://example.com/cover.jpg",
  "description": "Company description.",
  "services": ["Service1", "Service2"],
  "location": "Company Location",
  "industry": "Industry",
  "contact": "contact@example.com",
  "yearFounded": 2020,
  "socialLinks": [
    "https://twitter.com/company",
    "https://linkedin.com/company/company"
  ],
  "industries": ["Industry1", "Industry2"]
}
```

### List All Companies

**Endpoint:** `GET /company/`

**Description:** Lists all companies.

**Request Headers:**

- `Authorization: Bearer FIREBASE_ID_TOKEN`

**Response:**

```json
[
  {
    "id": "COMPANY_ID",
    "name": "Company Name",
    // ... other company fields
  },
  // ... other companies
]
```

---

## Employee Endpoints

### Add Employee

**Endpoint:** `POST /employee/create`

**Description:** Adds a new employee to the company.

**Request Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer FIREBASE_ID_TOKEN`

**Request Body:**

```json
{
  "companyId": "COMPANY_ID",
  "name": "Employee Name",
  "position": "Job Title",
  "seniority": "Senior",
  "skills": ["Skill1", "Skill2"],
  "availability": "Available",
  "yearsOfExperience": 5,
  "shortDescription": "Brief description.",
  "availabilityUntil": "2024-12-31",
  "contact": "employee@example.com"
}
```

**Response:**

```json
{
  "message": "Employee added successfully.",
  "employeeId": "EMPLOYEE_ID"
}
```

### Get Employee Details

**Endpoint:** `GET /employee/:id`

**Description:** Retrieves detailed information about an employee.

**Request Headers:**

- `Authorization: Bearer FIREBASE_ID_TOKEN`

**Response:**

```json
{
  "id": "EMPLOYEE_ID",
  "companyId": "COMPANY_ID",
  "name": "Employee Name",
  "position": "Job Title",
  "seniority": "Senior",
  "skills": ["Skill1", "Skill2"],
  "availability": "Available",
  "yearsOfExperience": 5,
  "shortDescription": "Brief description.",
  "availabilityUntil": "2024-12-31",
  "contact": "employee@example.com",
  "cvUrl": "https://storage.googleapis.com/..."
}
```

### Upload Employee CV

**Endpoint:** `POST /employee/:id/uploadCV`

**Description:** Uploads a CV for an employee.

**Request Headers:**

- `Authorization: Bearer FIREBASE_ID_TOKEN`
- `Content-Type: multipart/form-data`

**Form Data:**

- `cv`: The CV file to upload.

**Response:**

```json
{
  "message": "CV uploaded successfully.",
  "cvUrl": "https://storage.googleapis.com/..."
}
```

### Download Employee CV

**Endpoint:** `GET /employee/:id/downloadCV`

**Description:** Downloads an employee's CV.

**Request Headers:**

- `Authorization: Bearer FIREBASE_ID_TOKEN`

**Response:**

- Returns the CV file as a downloadable attachment.

### List Employees for a Company

**Endpoint:** `GET /employee?companyId=COMPANY_ID`

**Description:** Lists all employees associated with a specific company.

**Request Headers:**

- `Authorization: Bearer FIREBASE_ID_TOKEN`

**Response:**

```json
[
  {
    "id": "EMPLOYEE_ID",
    "companyId": "COMPANY_ID",
    "name": "Employee Name",
    // ... other employee fields
  },
  // ... other employees
]
```

---

## Position Endpoints

### Create Position

**Endpoint:** `POST /positions/create`

**Description:** Creates a new job position for the company.

**Request Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer FIREBASE_ID_TOKEN`

**Request Body:**

```json
{
  "companyId": "COMPANY_ID",
  "jobTitle": "Job Title",
  "requiredSkills": ["Skill1", "Skill2"],
  "status": "Open",
  "description": "Job description."
}
```

**Response:**

```json
{
  "message": "Position created successfully.",
  "positionId": "POSITION_ID"
}
```

### Get Position Details

**Endpoint:** `GET /positions/:id`

**Description:** Retrieves detailed information about a job position.

**Request Headers:**

- `Authorization: Bearer FIREBASE_ID_TOKEN`

**Response:**

```json
{
  "id": "POSITION_ID",
  "companyId": "COMPANY_ID",
  "jobTitle": "Job Title",
  "requiredSkills": ["Skill1", "Skill2"],
  "status": "Open",
  "description": "Job description."
}
```

### List Positions for a Company

**Endpoint:** `GET /positions?companyId=COMPANY_ID`

**Description:** Lists all positions associated with a specific company.

**Request Headers:**

- `Authorization: Bearer FIREBASE_ID_TOKEN`

**Response:**

```json
[
  {
    "id": "POSITION_ID",
    "companyId": "COMPANY_ID",
    "jobTitle": "Job Title",
    // ... other position fields
  },
  // ... other positions
]
```

---

## Models

### User Model

Represents a user in the system.

**Fields:**

- `uid`: Firebase User ID.
- `email`: User's email address.
- `displayName`: User's display name.
- `userType`: Type of user (`company`).

### Company Model

Represents a company profile.

**Fields:**

- `id`: Company ID.
- `name`: Company name.
- `logo`: URL to the company's logo.
- `coverImage`: URL to the company's cover image.
- `description`: Company description.
- `services`: Array of services offered.
- `location`: Company location.
- `industry`: Industry the company operates in.
- `contact`: Contact email.
- `yearFounded`: Year the company was founded.
- `socialLinks`: Array of social media URLs.
- `industries`: Array of industries the company covers.

### Employee Model

Represents an employee associated with a company.

**Fields:**

- `id`: Employee ID.
- `companyId`: ID of the company the employee belongs to.
- `name`: Employee's full name.
- `position`: Job title.
- `seniority`: Seniority level (e.g., Junior, Mid, Senior).
- `skills`: Array of skills or technologies.
- `availability`: Availability status (`Available` or `Not Available`).
- `yearsOfExperience`: Number of years of experience.
- `shortDescription`: Brief description of the employee.
- `availabilityUntil`: Date until the employee is unavailable.
- `contact`: Contact email.
- `cvUrl`: URL to the employee's CV.

### Position Model

Represents a job position offered by a company.

**Fields:**

- `id`: Position ID.
- `companyId`: ID of the company offering the position.
- `jobTitle`: Title of the job position.
- `requiredSkills`: Array of required skills.
- `status`: Status of the position (`Open` or `Closed`).
- `description`: Detailed description of the job position.

---

## Usage Examples

### Scenario: Listing Employees for a Company

**Objective:** Retrieve all employees associated with a specific company.

**Endpoint:** `GET /employee?companyId=COMPANY_ID`

**Request:**

```bash
curl -X GET 'http://api.example.com/employee?companyId=COMPANY_ID' \
  -H "Authorization: Bearer FIREBASE_ID_TOKEN"
```

**Response:**

```json
[
  {
    "id": "EMPLOYEE_ID",
    "companyId": "COMPANY_ID",
    "name": "Employee Name",
    // ... other employee fields
  },
  // ... other employees
]
```

### Scenario: Listing Positions for a Company

**Objective:** Retrieve all job positions offered by a specific company.

**Endpoint:** `GET /positions?companyId=COMPANY_ID`

**Request:**

```bash
curl -X GET 'http://api.example.com/positions?companyId=COMPANY_ID' \
  -H "Authorization: Bearer FIREBASE_ID_TOKEN"
```

**Response:**

```json
[
  {
    "id": "POSITION_ID",
    "companyId": "COMPANY_ID",
    "jobTitle": "Job Title",
    // ... other position fields
  },
  // ... other positions
]
```

---

## Conclusion

This documentation provides an overview of the Bench App API, including authentication procedures, endpoints, data models, and usage examples. By following the guidelines and examples provided, developers can integrate and interact with the Bench App backend services effectively.

