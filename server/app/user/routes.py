from flask import Blueprint, render_template
from flask_login import login_required, current_user
from ..models import Booking, TimeSlot, Turf

# ✅ Define the blueprint
user_bp = Blueprint('user', __name__, template_folder='templates')

@user_bp.route('/dashboard')
@login_required
def dashboard():
    bookings = Booking.query.filter_by(user_id=current_user.id).all()
    enriched = []

    for b in bookings:
        slot = TimeSlot.query.get(b.timeslot_id)
        turf = Turf.query.get(slot.turf_id)
        enriched.append({
            "booking": b,
            "slot": slot,
            "turf": turf
        })

    return render_template('user/dashboard.html', bookings=enriched)
