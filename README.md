# Booky

Booky is a full-stack web application for cataloging, sharing, and reviewing books. It integrates the Google Books API to provide real-time metadata and cover art. Users can create personal libraries, interact socially with other users, and explore books dynamically through a responsive interface.

---

## Tech Stack

- **Backend:** Java, Spring Boot, Maven, RESTful APIs  
- **Frontend:** React, JavaScript  
- **Database:** PostgreSQL  
- **Deployment & Dev Tools:** Docker, Docker Compose, CI/CD pipelines  
- **APIs:** Google Books API  

---

## Features

- Catalog books and maintain personal libraries  
- Search and display book metadata and cover art in real-time  
- Add reviews and social interactions  
- Scalable backend with Dockerized deployment  

---

## Project Structure

/backend has directories
  /server which holds backend business logic and daos
  /data-loader which holds init data and shell scripts

/frontend holds react code and frontend logic

---

## Getting Started

Follow these steps to set up and run the Booky application locally:

```bash
1. Start services with Docker from the server directory:
   docker-compose up -d

2. Load initial data from the data-loader directory:
   ./load_data.sh

3. Start the backend from the server directory:
   mvn spring-boot:run

4. Start the frontend from the frontend directory:
   npm start
