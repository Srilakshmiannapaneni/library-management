# Library Book Issue & Return Management System

A RESTful backend for managing library books, members, and book issue/return operations using Java and Spring Boot with MySQL.

## Functional Coverage

### Book Management
- Add a new book
- View all books
- View available books
- Search by title or author

### Member Management
- Register a member
- View member details
- View books issued to a member

### Issue Book
- Issue a book to a member
- Book must be available
- Member can issue a maximum of 3 books

### Return Book
- Return an issued book
- Update return date
- Mark book as available

## Prerequisites

- **Java 17+** installed.
- **Maven** installed.
- **MySQL** installed and running on default port `3306`.

## Setup Instructions

1. **Database Configuration:**
   The app uses `library_db` and can auto-create it (`createDatabaseIfNotExist=true`).
   Set credentials through environment variables (recommended):
   ```bash
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   ```

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

Once the application is running:
- Swagger UI: [http://localhost:8082/swagger-ui/index.html](http://localhost:8082/swagger-ui/index.html)
- OpenAPI JSON: [http://localhost:8082/v3/api-docs](http://localhost:8082/v3/api-docs)

## Sample JSON Requests

### 1. Add Book
**POST** `/api/books`
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "coverImage": "clean-code.jpg"
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

## Basic Workflow
1. Add books
2. Register members
3. Issue books
4. Return books

## Postman Collection Idea
You can export the OpenAPI spec from `http://localhost:8080/v3/api-docs` and import it directly into Postman to automatically generate all requests, variables, and body schemas!
