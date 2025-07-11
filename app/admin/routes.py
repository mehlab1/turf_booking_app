from flask import Blueprint, render_template, redirect, url_for, abort
from ..models import Booking, TimeSlot, Turf, User, db
from flask_login import login_required, current_user
from datetime import datetime

admin_bp = Blueprint('admin', __name__, template_folder='templates')

@admin_bp.route('/dashboard')
@login_required
def dashboard():
    if not current_user.is_admin:
        abort(403)
    return render_template('admin/dashboard.html')

@admin_bp.route('/bookings')
@login_required
def all_bookings():
    if not current_user.is_admin:
        abort(403)

    bookings = Booking.query.all()
    enriched = []

    for b in bookings:
        slot = TimeSlot.query.get(b.timeslot_id)
        turf = Turf.query.get(slot.turf_id)
        user = User.query.get(b.user_id)

        enriched.append({
            "booking": b,
            "slot": slot,
            "turf": turf,
            "user": user
        })

    return render_template('admin/all_bookings.html', bookings=enriched)

@admin_bp.route('/mark-paid/<int:id>')
@login_required
def mark_paid(id):
    if not current_user.is_admin:
        abort(403)

    booking = Booking.query.get_or_404(id)
    booking.full_paid = True
    db.session.commit()
    return redirect(url_for('admin.all_bookings'))

@admin_bp.route('/upcoming')
@login_required
def upcoming_bookings():
    if not current_user.is_admin:
        abort(403)

    now = datetime.utcnow()
    slots = TimeSlot.query.filter(TimeSlot.start_time >= now, TimeSlot.is_booked == True).order_by(TimeSlot.start_time).all()
    enriched = []

    for slot in slots:
        booking = Booking.query.filter_by(timeslot_id=slot.id).first()
        turf = Turf.query.get(slot.turf_id)
        user = User.query.get(booking.user_id)

        enriched.append({
            "booking": booking,
            "slot": slot,
            "turf": turf,
            "user": user
        })

    return render_template('admin/upcoming.html', bookings=enriched)
