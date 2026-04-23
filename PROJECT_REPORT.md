# AI308B MSE-2 Project Report

## Student Details

- Name:
- Roll Number:
- Section:
- Subject: AI Driven Full Stack Development (AI308B)

## Project Title

Lost & Found Item Management System

## Objective

This project solves the campus lost-and-found use case using the MERN stack. It allows students to register, log in securely, report lost or found items, search entries, update/delete their own entries, and log out securely.

## Tech Stack

- Frontend: React, Vite, Axios, React Router
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: bcrypt, JWT

## MongoDB Schema

### User Schema

- `name`
- `email` (unique)
- `password` (hashed)

### Item Schema

- `itemName`
- `description`
- `type` (`Lost` or `Found`)
- `location`
- `date`
- `contactInfo`
- `owner`

## Backend API Endpoints

### Auth APIs

- `POST /api/register`
- `POST /api/login`

### Item APIs

- `POST /api/items`
- `GET /api/items`
- `GET /api/items/:id`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`
- `GET /api/items/search?name=xyz`

## Frontend Screens

- Registration page
- Login page
- Dashboard page
- Add item form
- Search box
- Item list with update/delete actions

## Code

Add source code screenshots or paste selected code blocks here.

## Output Screenshots

Add screenshots for:

- Registration page
- Login page
- Dashboard
- Search results
- Update/Delete flow

## Postman / Thunder Client Screenshots

Add screenshots for:

- Register API
- Login API
- Add item API
- Get all items API
- Get single item API
- Update item API
- Delete item API
- Search item API

## MongoDB Storage Screenshots

Add screenshots showing:

- Users collection
- Items collection

## Render Deployment

- Backend Render URL:
- Frontend Render URL:

Add screenshot of successful Render deployment here.

## Live Endpoint Testing

- `POST /api/register`:
- `POST /api/login`:
- `POST /api/items`:
- `GET /api/items`:
- `GET /api/items/:id`:
- `PUT /api/items/:id`:
- `DELETE /api/items/:id`:
- `GET /api/items/search?name=xyz`:

## GitHub Repository

- Repository URL:

## Conclusion

The Lost & Found Item Management System was implemented using the MERN stack with secure authentication, CRUD operations, search functionality, protected routes, and a responsive interface suitable for campus use.
