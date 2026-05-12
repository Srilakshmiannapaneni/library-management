# Library Book Issue & Return Management System

A robust REST-based backend application for managing library books, members, and issue/return operations. Built with Spring Boot 3, Java 17, Spring Data JPA, and MySQL.

## Features

- **Book Management:** Add, search (by title/author), update, delete, and check availability of books.
- **Member Management:** Register, view details, get issued books, and delete members.
- **Issue & Return Operations:** Issue books to members (max 3 books per member), return books, and list active issues.
- **Exception Handling:** Centralized exception handling with custom exceptions.
- **Swagger Documentation:** API documentation using OpenAPI/Swagger.

## Prerequisites

- **Java 17** installed.
- **Maven** installed.
- **MySQL** installed and running on default port `3306`.

## Setup Instructions

1. **Database Configuration:**
   Create a database named `library_db` in your MySQL server.
   ```sql
   CREATE DATABASE library_db;
   ```
   *Note: Update the MySQL username and password in `src/main/resources/application.properties` if they differ from root/your_password.*

2. **Build the Application:**
   From the project root directory, run:
   ```bash
   mvn clean install
   ```

3. **Run the Application:**
   Start the Spring Boot server:
   ```bash
   mvn spring-boot:run
   ```

## API Documentation (Swagger)

Once the application is running, you can access the Swagger UI to interact with and test all the REST APIs.
- **Swagger URL:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## Sample JSON Requests

### 1. Add Book
**POST** `/api/books`
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin"
}
```

### 2. Register Member
**POST** `/api/members`
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com"
}
```

### 3. Issue Book
**POST** `/api/issues/issue`
```json
{
  "bookId": 1,
  "memberId": 1
}
```

### 4. Return Book
**PUT** `/api/issues/return/{issueId}`
(No body needed)

## Postman Collection Idea
You can export the OpenAPI spec from `http://localhost:8080/v3/api-docs` and import it directly into Postman to automatically generate all requests, variables, and body schemas!
