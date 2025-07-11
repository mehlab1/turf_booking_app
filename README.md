# 🏟️ Turf Booking System - Full Stack Application

A full-stack **Turf Booking Web Application** built with **Flask (Python)** backend, **Neon PostgreSQL** database, and ready to be connected to a **React** frontend. This system allows sports facilities to manage turf slots, real-time bookings, user accounts, and admin operations.

---

## 🚀 Features

### 🧑‍💻 User Functionality

* Register & log in (via Flask-Login)
* View available turfs and slot timings
* Real-time slot availability via **Socket.IO**
* Book available time slots
* View personal bookings

### 🛠️ Admin Functionality

* Admin login
* View all bookings
* Mark bookings as fully paid
* View upcoming bookings

### 🔁 Real-Time

* Real-time slot updates using Flask-SocketIO

---

## 🗂️ Project Structure

```
turf_booking_app/
├── app/
│   ├── __init__.py
│   ├── models.py
│   ├── public/              # Public views (login, register, homepage)
│   ├── user/                # User dashboard and routes
│   ├── admin/               # Admin dashboard and routes
│   ├── templates/           # Jinja2 HTML templates (public, admin, user)
│   └── socket_events.py     # Socket.IO real-time handlers
│
├── config.py                # App configuration (DB URI etc.)
├── run.py                   # Entry point to start the app
├── requirements.txt         # Python dependencies
└── README.md                # You're reading this
```

---

## 🛠️ Setup Guide (Backend)

### 1. 🐍 Create Virtual Environment

```bash
python -m venv venv
```

Activate it:

* On **Windows**:

```bash
venv\Scripts\activate
```

* On **macOS/Linux**:

```bash
source venv/bin/activate
```

### 2. 📦 Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. 🛢️ Configure Database

Edit `config.py` and set your Neon PostgreSQL URI:

```python
SQLALCHEMY_DATABASE_URI = "postgresql://<username>:<password>@<host>/<dbname>"
```

### 4. 📂 Run the App

```bash
python run.py
```

App will be available at: [http://localhost:5000](http://localhost:5000)

---

## 🧪 Sample URLs to Test

| Role       | URL                                     |
| ---------- | --------------------------------------- |
| Home       | `http://localhost:5000/`                |
| Turf Page  | `http://localhost:5000/turf/1`          |
| User Dash  | `http://localhost:5000/user/dashboard`  |
| Admin Dash | `http://localhost:5000/admin/dashboard` |

---

## 📝 How to Add This `README.md` File

1. **Open your project folder** (where `run.py`, `requirements.txt` etc. are).
2. **Create a new file** named `README.md`.
3. Paste this entire content into it.
4. Save the file.

If you're uploading this project to GitHub or Bolt, it will **automatically detect this file** to better understand your app.

---

## 🔗 Frontend Integration Plan

This project will be paired with a **React frontend** generated using **Bolt**, which will:

* Consume the backend APIs
* Display turf listings
* Show available slots with animations
* Provide login and booking UIs

Frontend will use **React + Tailwind + Axios**, styled for a professional experience.

---

## 📬 Contribution / Support

If you plan to extend this app or collaborate:

* Use this README for onboarding
* Reach out if you need setup help

---

## ✅ Final Notes

* Make sure to exclude `__pycache__/` and `migrations/` folders when zipping.
* Include `templates/` folder (important for rendering views).
* This app is ready for frontend integration and deployment.

Happy Booking! ⚽🏏🏐
