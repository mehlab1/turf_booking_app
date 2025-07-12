from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, current_user
from werkzeug.security import check_password_hash
from ..models import Turf, TimeSlot, Booking, db, User
from datetime import datetime
import json

public_bp = Blueprint('public', __name__)

@public_bp.route('/')
def home():
    turfs = Turf.query.all()
    if request.headers.get('Content-Type') == 'application/json' or request.path.startswith('/api'):
        return {'turfs': [{'id': t.id, 'name': t.name, 'location': t.location, 'price_per_slot': t.price_per_slot} for t in turfs]}
    return render_template('public/home.html', turfs=turfs)

@public_bp.route('/turf/<int:id>')
def turf_detail(id):
    turf = Turf.query.get_or_404(id)
    if request.headers.get('Content-Type') == 'application/json' or request.path.startswith('/api'):
        return {'turf': {'id': turf.id, 'name': turf.name, 'location': turf.location, 'price_per_slot': turf.price_per_slot}}
    return render_template('public/turf.html', turf=turf)

@public_bp.route('/book/<int:slot_id>', methods=['GET', 'POST'])
def book_slot(slot_id):
    slot = TimeSlot.query.get_or_404(slot_id)
    if request.method == "POST":
        if not current_user.is_authenticated:
            if request.headers.get('Content-Type') == 'application/json':
                return {'success': False, 'message': 'Authentication required'}, 401
            return redirect(url_for('public.login'))
        booking = Booking(user_id=current_user.id, timeslot_id=slot.id, deposit_paid=True)
        slot.is_booked = True
        db.session.add(booking)
        db.session.commit()
        if request.headers.get('Content-Type') == 'application/json':
            return {'success': True, 'message': 'Booking confirmed'}
        return redirect(url_for("user.dashboard"))
    if request.headers.get('Content-Type') == 'application/json':
        return {'slot': {'id': slot.id, 'start_time': slot.start_time.isoformat(), 'end_time': slot.end_time.isoformat()}}
    return render_template("public/book.html", slot=slot)

@public_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        if request.headers.get('Content-Type') == 'application/json':
            data = request.get_json()
            email = data.get("email")
            password = data.get("password")
        else:
            email = request.form["email"]
            password = request.form["password"]
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            if request.headers.get('Content-Type') == 'application/json':
                return {
                    'success': True,
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'is_admin': user.is_admin
                    }
                }
            return redirect(url_for("admin.dashboard" if user.is_admin else "user.dashboard"))
        else:
            if request.headers.get('Content-Type') == 'application/json':
                return {'success': False, 'message': 'Invalid credentials'}, 401
            flash("Invalid credentials")
    return render_template("public/login.html")

@public_bp.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        if request.headers.get('Content-Type') == 'application/json':
            data = request.get_json()
            email = data.get("email")
            password = data.get("password")
        else:
            email = request.form["email"]
            password = request.form["password"]
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            if request.headers.get('Content-Type') == 'application/json':
                return {'success': False, 'message': 'User already exists'}, 400
            flash("User already exists")
            return render_template("public/register.html")
        from werkzeug.security import generate_password_hash
        user = User(email=email, password_hash=generate_password_hash(password))
        db.session.add(user)
        db.session.commit()
        if request.headers.get('Content-Type') == 'application/json':
            return {'success': True, 'message': 'Registration successful'}
        flash("Registration successful! Please login.")
        return redirect(url_for("public.login"))
    return render_template("public/register.html")

@public_bp.route("/auth/me")
def auth_me():
    if current_user.is_authenticated:
        return {
            'user': {
                'id': current_user.id,
                'email': current_user.email,
                'is_admin': current_user.is_admin
            }
        }
    return {'user': None}, 401