# Spring Boot REST API Assignment

## Project Overview

This project is a simple Spring Boot REST API application created as a Postman assignment.

The application demonstrates how to create REST APIs using Spring Boot and test them using Postman.

The project contains two APIs:

1. Hello World API
2. Books API


## Technologies Used

- Java
- Spring Boot
- Spring Web
- Maven
- Postman


## Project Structure


src
└── main
    └── java
        └── com.example.demo
            │── DemoApplication.java
            │── Book.java
            │
            └── controller
                │── HelloController.java
                │── BookController.java

## File Description

### 1. DemoApplication.java

- Main class of the Spring Boot application.
- Starts the embedded server.
- Runs the application.

### 2. HelloController.java

This controller contains a simple GET API.

//Endpoint

GET /hello

//Response


Hello World


Purpose:
- Demonstrates the basic REST API creation in Spring Boot.


### 3. Book.java

This is a Model (POJO) class.

It represents a Book object with:

- id
- title
- author

It also contains:

- Constructor
- Getter methods


### 4. BookController.java

This controller provides a list of books.

**Endpoint**

GET /books

The API returns a list of Book objects in JSON format.

Example Response

 json
[
  {
    "id":101,
    "title":"Java Programming",
    "author":"James Gosling"
  },
  {
    "id":102,
    "title":"Effective Java",
    "author":"Joshua Bloch"
  }
]


The current implementation returns 10 sample books.


# API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /hello | Returns Hello World |
| GET | /books | Returns a list of books |


# Running the Project

## Step 1

Clone the repository

```bash
git clone <repository-url>
```


## Step 2

Open the project in:

- VS Code
or
- IntelliJ IDEA
or
- Eclipse

---

## Step 3

Run the Spring Boot application.

You can run:

```
DemoApplication.java
```

or execute:

```bash
mvn spring-boot:run
```

---

## Step 4

The application will start on

```
http://localhost:8080
```

---

# Testing with Postman

## Hello API

Method

```
GET
```

URL

```
http://localhost:8080/hello
```

Expected Output

```
Hello World
```

---

## Books API

Method

```
GET
```

URL

```
http://localhost:8080/books
```

Expected Output

A JSON array containing sample book details.

---

# Sample JSON Response

```json
[
  {
    "id":101,
    "title":"Java Programming",
    "author":"James Gosling"
  },
  {
    "id":102,
    "title":"Effective Java",
    "author":"Joshua Bloch"
  }
]

# Features

- Spring Boot REST API
- Simple GET Endpoints
- JSON Response
- Model Class (POJO)
- REST Controller
- Tested using Postman
- Maven Project

---

# Learning Outcomes

Through this project, I learned:

- Creating a Spring Boot application
- Creating REST Controllers
- Using @RestController
- Using @GetMapping
- Returning String responses
- Returning JSON objects
- Creating a POJO model class
- Testing APIs with Postman
- Running Spring Boot using Maven

