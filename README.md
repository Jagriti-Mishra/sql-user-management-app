# User Management Web App (Node.js + Express + MySQL)

A full-stack CRUD web application built with **Node.js**, **Express**, **EJS**, and **MySQL**. This project demonstrates basic database integration, RESTful routing, server-side template rendering, form handling with method overriding, and password-authenticated updates and deletions.

---

## 🚀 Features

- **Home Dashboard**: Displays total registered user count dynamically queried from the MySQL database.
- **View Users**: Lists all registered users with their details and quick action links.
- **Add User (Create)**: Register new users with automated UUID generation (via Faker).
- **Edit User (Update)**: Update a user's username with password verification for basic security.
- **Delete User (Delete)**: Remove user records after password confirmation.
- **RESTful Architecture**: Uses `method-override` to support standard `PATCH` and `DELETE` HTTP methods directly from HTML forms.

---

## 🛠️ Tech Stack

- **Runtime & Framework**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
- **Database**: [MySQL](https://www.mysql.com/) with [`mysql2`](https://www.npmjs.com/package/mysql2) driver
- **Templating Engine**: [EJS](https://ejs.co/) (Embedded JavaScript templates)
- **Utilities**:
  - [`method-override`](https://www.npmjs.com/package/method-override) (for `PATCH` / `DELETE` form submissions)
  - [`@faker-js/faker`](https://fakerjs.dev/) (for UUID and mock data generation)
  - [`uuid`](https://www.npmjs.com/package/uuid)

---

## 📁 Project Structure

```text
SQLClass/
├── views/
│   ├── delete.ejs       # Confirmation page for deleting a user
│   ├── edit.ejs         # Form to update username
│   ├── home.ejs         # Landing page displaying total user count
│   ├── newuser.ejs      # Form to register a new user
│   └── showusers.ejs    # Table listing all users with actions
├── .gitignore           # Git ignore configurations
├── index.js             # Express server, database connection & route handlers
├── package.json         # Project metadata and dependencies
├── README.md            # Project documentation
└── schema.sql           # MySQL database schema definition
```

---

## 🗄️ Database Setup

1. Make sure **MySQL Server** is installed and running on your machine.
2. Log into MySQL:
   ```sql
   mysql -u root -p
   ```
3. Create the database:
   ```sql
   CREATE DATABASE sql_app;
   USE sql_app;
   ```
4. Execute the schema from `schema.sql`:
   ```sql
   CREATE TABLE user(
       id VARCHAR(50) PRIMARY KEY,
       username VARCHAR(50) UNIQUE,
       email VARCHAR(50) UNIQUE NOT NULL,
       password VARCHAR(50) NOT NULL
   );
   ```

---

## ⚙️ Configuration & Installation

1. **Clone or open the repository**:
   ```bash
   cd SQLClass
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Database Credentials**:
   In `index.js`, ensure your MySQL connection credentials match your local setup:
   ```javascript
   const connection = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     database: 'sql_app',
     password: 'YOUR_MYSQL_PASSWORD',
   });
   ```

---

## ▶️ Running the Application

1. Start the server:
   ```bash
   node index.js
   ```

2. Open your web browser and navigate to:
   ```
   http://localhost:8080/
   ```

---

## 🌐 Routes Overview

| Method | Route | Description | View |
|---|---|---|---|
| `GET` | `/` | Home dashboard showing total user count | `home.ejs` |
| `GET` | `/user` | Displays list of all registered users | `showusers.ejs` |
| `GET` | `/user/new` | Displays form to add a new user | `newuser.ejs` |
| `POST` | `/user` | Inserts new user into MySQL database | Redirects to `/user` |
| `GET` | `/user/:id/edit` | Displays form to edit username | `edit.ejs` |
| `PATCH` | `/user/:id` | Updates username (requires password) | Redirects to `/user` |
| `GET` | `/user/:id/delete` | Displays delete confirmation form | `delete.ejs` |
| `DELETE` | `/user/:id` | Deletes user from database (requires password) | Redirects to `/user` |

---

## 📄 License

This project is licensed under the ISC License.
