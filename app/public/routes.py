from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user
from werkzeug.security import check_password_hash
from ..models import Turf, TimeSlot, Booking, db, User
from datetime import datetime

public_bp = Blueprint('public', __name__, template_folder='templates')


@public_bp.route('/')
def home():
    turfs = Turf.query.all()
    return render_template('public/home.html', turfs=turfs)


@public_bp.route('/turf/<int:id>')
def turf_detail(id):
    turf = Turf.query.get_or_404(id)
    return render_template('public/turf.html', turf=turf)


@public_bp.route('/book/<int:slot_id>', methods=['GET', 'POST'])
def book_slot(slot_id):
    slot = TimeSlot.query.get_or_404(slot_id)
    if request.method == "POST":
        # NOTE: Dummy user_id=1 is used; you should use current_user.id later
        booking = Booking(user_id=1, timeslot_id=slot.id, deposit_paid=True)
        slot.is_booked = True
        db.session.add(booking)
        db.session.commit()
        return redirect(url_for("user.dashboard"))
    return render_template("public/book.html", slot=slot)


@public_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            if user.is_admin:
                return redirect(url_for("admin.dashboard"))
            else:
                return redirect(url_for("user.dashboard"))
        else:
            flash("Invalid credentials")
    return render_template("public/login.html")



@public_bp.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("public.home"))
