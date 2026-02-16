# Commercia – eCommerce Platform

🚀 Overview

Commercia is a modern full-stack eCommerce application designed to simulate a real-world online retail system. The platform provides secure authentication, product browsing, cart management, checkout, payment processing, inventory tracking, shipping management, and administrative controls.

🛠 Tech Stack

Backend

Spring Boot

Spring Security (JWT)

JPA / Hibernate

MySQL

Frontend

React.js

Axios

CSS

Payments

Stripe (Test Mode)

Mock Provider

🔐 Security

JWT Authentication

Role-based Access (USER / ADMIN)

🛒 Core Features

✔ User Authentication
✔ Product Management
✔ Shopping Cart
✔ Checkout Flow
✔ Order Processing
✔ Payment Integration
✔ Inventory Tracking
✔ Shipping / Fulfilment
✔ Admin Dashboard

⚙ Setup Instructions
Prerequisites

Java 17+

MySQL

Node.js

Backend Setup

Configure MySQL in application.properties

Create database:

CREATE DATABASE commercia;


Insert roles:

INSERT INTO roles(name) VALUES ('ROLE_ADMIN');
INSERT INTO roles(name) VALUES ('ROLE_USER');


Run Spring Boot application

Frontend Setup
npm install
npm start

💳 Stripe Test Mode

Use Stripe test cards:

4242 4242 4242 4242
Any future date
Any CVC

📌 Project Status

🚧 MVP Complete
🚀 Enhancements Ongoing
