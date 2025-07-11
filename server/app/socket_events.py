from flask_socketio import emit
from .models import TimeSlot, db
from flask import request

def register_socket_events(socketio):
    @socketio.on('request_slots')
    def handle_request_slots(data):
        turf_id = data.get('turf_id')
        if not turf_id:
            emit('update_slots', [])
            return

        slots = TimeSlot.query.filter_by(turf_id=turf_id).order_by(TimeSlot.start_time).all()

        serialized = [
            {
                "id": s.id,
                "start": s.start_time.isoformat(),
                "booked": s.is_booked
            }
            for s in slots
        ]

        emit('update_slots', serialized)

    @socketio.on('book_slot')
    def handle_book_slot(data):
        slot = TimeSlot.query.get(data.get('slot_id'))
        if not slot:
            emit('booking_error', {"msg": "Slot not found"})
            return

        if slot.is_booked:
            emit('booking_error', {"msg": "Already booked"})
            return

        slot.is_booked = True
        db.session.commit()
        emit('booking_success', {"slot_id": slot.id}, broadcast=False)
