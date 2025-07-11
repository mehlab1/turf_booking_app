from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_login import LoginManager

# Initialize Flask extensions
db = SQLAlchemy()
migrate = Migrate()
socketio = SocketIO(async_mode='eventlet')
login_manager = LoginManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app)
    login_manager.init_app(app)

    # Set default login route for login_required
    login_manager.login_view = 'public.login'

    # Register blueprints
    from .public.routes import public_bp
    from .user.routes import user_bp
    from .admin.routes import admin_bp

    app.register_blueprint(public_bp)
    app.register_blueprint(user_bp, url_prefix="/user")
    app.register_blueprint(admin_bp, url_prefix="/admin")

    # Register real-time Socket.IO events
    from .socket_events import register_socket_events
    register_socket_events(socketio)

    # Flask-Login user loader
    from .models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    return app
