# 01Blog – Social Blogging Platform

01Blog is a fullstack social blogging platform where students can share their learning journey, discover insights, and interact with each other’s posts. Users can follow others, like, comment, and report inappropriate content. Administrators can manage users, posts, and reports.

---

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Setup & Installation](#setup--installation)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Database](#database)
- [Running the Project](#running-the-project)
- [Evaluation](#evaluation)

---

## Features

### User
- Register and login securely (password hashing, JWT)
- Role-based access control (User vs Admin)
- Personal “block” page listing all user posts
- Follow/unfollow other users
- Like and comment on posts
- Upload media (images/videos) with previews
- Notifications for subscribed users
- Report users or posts for inappropriate content

### Admin
- Manage all users, posts, and reports
- Ban or delete users and posts
- View user reports and take moderation actions
- Admin panel with clean UI

- **login :** `admin` 

 - **passord :** `admin123`

### General
- Responsive and interactive UI (Angular + Bootstrap or Angular Material)
- Real-time updates or refresh-based for comments
- Secure media storage (local filesystem or cloud)

---

## Technologies

- **Backend:** Java, Spring Boot, Spring Security, JWT
- **Frontend:** Angular, TypeScript, Bootstrap/Angular Material
- **Database:** PostgreSQL
- **ORM:** Hibernate, JPA
- **Containerization:** Docker
- **Version Control:** Git, GitHub

---

## Setup & Installation

### 1️⃣ Database (PostgreSQL via Docker)

1. Pull the official PostgreSQL image:
```bash
docker pull postgres:15
```

2. Run the container:
```bash
docker run --name my-postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -e POSTGRES_DB=blogdb \
  -p 9876:5432 \
  -d postgres:15
```

3. Access PostgreSQL (Optional, using VS Code or pgAdmin):
- **Host:** `localhost`
- **Port:** `9876`
- **Username:** `admin`
- **Password:** `admin123`
- **Database:** `blogdb`

4. Stop container:
```bash
docker stop my-postgres
```

5. Start container:
```bash
docker start my-postgres
```

---

### 2️⃣ Backend (Spring Boot)

1. Navigate to the backend folder:
```bash
cd backend
```

2. Configure `application.properties` (database connection):
```properties
spring.datasource.url=jdbc:postgresql://localhost:9876/blogdb
spring.datasource.username=admin
spring.datasource.password=admin123
spring.jpa.hibernate.ddl-auto=update
```

3. Build and run the backend:
```bash
./mvnw clean install
./mvnw spring-boot:run
```
- Backend should run on: `http://localhost:8080`

---

### 3️⃣ Frontend (Angular)

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the Angular app:
```bash
ng serve
```
- App will run on: `http://localhost:4200`

---

## Running the Project

1. Make sure PostgreSQL container is running (`docker start my-postgres` if needed)
2. Run the backend (`./mvnw spring-boot:run`)
3. Run the frontend (`ng serve`)
4. Open browser at `http://localhost:4200`
5. Register a new user or login with admin credentials to test full functionality

---

## Evaluation

✅ **Functionality:** Full implementation of posts, likes, comments, subscriptions, and admin moderation.  
✅ **Security:** Role-based access and JWT authentication.  
✅ **UI/UX:** Responsive, interactive, clean interface with Angular + Bootstrap.

