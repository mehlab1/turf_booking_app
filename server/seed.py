from app import create_app, db
from app.models import User, Turf, TimeSlot, Booking
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

app = create_app()

with app.app_context():
    # Clear all existing data (Optional: use carefully in dev only)
    Booking.query.delete()
    TimeSlot.query.delete()
    Turf.query.delete()
    User.query.delete()
    db.session.commit()

    # Create users
    admin = User(email="admin@example.com", password_hash=generate_password_hash("admin123"), is_admin=True)
    user = User(email="user@example.com", password_hash=generate_password_hash("user123"), is_admin=False)

    db.session.add_all([admin, user])
    db.session.commit()

    # Create turfs
    turf1 = Turf(name="Green Field", location="Downtown", price_per_slot=1500)
    turf2 = Turf(name="Blue Arena", location="Uptown", price_per_slot=1800)

    db.session.add_all([turf1, turf2])
    db.session.commit()

    # Create timeslots
    now = datetime.utcnow()
    slot1 = TimeSlot(start_time=now + timedelta(hours=1), end_time=now + timedelta(hours=2), turf_id=turf1.id)
    slot2 = TimeSlot(start_time=now + timedelta(hours=3), end_time=now + timedelta(hours=4), turf_id=turf2.id)

    db.session.add_all([slot1, slot2])
    db.session.commit()

    # Create booking for user
    booking = Booking(user_id=user.id, timeslot_id=slot1.id, deposit_paid=True, full_paid=False)
    slot1.is_booked = True

    db.session.add(booking)
    db.session.commit()

    print("✅ Dummy data seeded successfully!")
