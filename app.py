from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt, create_refresh_token
from flask_bcrypt import Bcrypt
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///transactions.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'default-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)  # Token expires in 1 hour

db = SQLAlchemy(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Blocklist for JWTs (logout functionality)
blocklist = set()

@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    return jwt_payload["jti"] in blocklist

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)  # Store as timestamp
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# Initialize database
with app.app_context():
    db.create_all()
    print("Database initialized!")

# Routes
@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    
    if not data.get('username') or not data.get('password'):
        return jsonify({"message": "Username and password are required"}), 400
    if len(data['password']) < 8:
        return jsonify({"message": "Password must be at least 8 characters"}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already taken"}), 400

    new_user = User(username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201

@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    if not data.get('username') or not data.get('password'):
        return jsonify({"message": "Username and password are required"}), 400

    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        # Ensure the identity is a string (user ID)
        identity = str(user.id)
        access_token = create_access_token(identity=identity)  # Convert to string
        return jsonify(access_token=access_token), 200

    return jsonify({"message": "Invalid credentials!"}), 401


@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_access_token():
    identity = get_jwt_identity()
    print(f"Refreshing token for user ID: {identity}")  # Debugging print statement
    new_access_token = create_access_token(identity=identity)
    return jsonify({"access_token": new_access_token}), 200


@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    blocklist.add(jti)
    return jsonify({"message": "Logged out successfully!"}), 200

@app.route('/reset-password', methods=['POST'])
@jwt_required()
def reset_password():
    user_id = get_jwt_identity()
    data = request.get_json()
    new_password = data.get('new_password')

    if not new_password or len(new_password) < 8:
        return jsonify({"message": "Password must be at least 8 characters"}), 400

    user = User.query.get(user_id)
    user.password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    db.session.commit()

    return jsonify({"message": "Password updated successfully!"}), 200

@app.route('/transactions', methods=['POST'])
@jwt_required()
def add_transaction():
    user_id = get_jwt_identity()  # Get user identity from the token
    data = request.json

    if not all(key in data for key in ('description', 'amount', 'category', 'date')):
        return jsonify({"message": "All fields are required"}), 400

    new_transaction = Transaction(
        description=data['description'],
        amount=data['amount'],
        category=data['category'],
        date=data['date'],
        user_id=user_id
    )
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify({"message": "Transaction added successfully!"}), 201


@app.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).all()

    result = [
        {
            "id": t.id,
            "description": t.description,
            "amount": t.amount,
            "category": t.category,
            "date": t.date.strftime('%Y-%m-%d'),  # Convert datetime to string
        }
        for t in transactions
    ]
    return jsonify(result), 200

@app.route('/transactions/<int:transaction_id>', methods=['PUT'])
@jwt_required()
def update_transaction(transaction_id):
    user_id = get_jwt_identity()
    transaction = Transaction.query.filter_by(id=transaction_id, user_id=user_id).first()

    if not transaction:
        return jsonify({"message": "Transaction not found"}), 404

    data = request.json
    transaction.description = data.get('description', transaction.description)
    transaction.amount = data.get('amount', transaction.amount)
    transaction.category = data.get('category', transaction.category)
    transaction.date = datetime.strptime(data.get('date', transaction.date.strftime('%Y-%m-%d')), '%Y-%m-%d')

    db.session.commit()
    return jsonify({"message": "Transaction updated successfully!"}), 200

@app.route('/transactions/<int:transaction_id>', methods=['DELETE'])
@jwt_required()
def delete_transaction(transaction_id):
    user_id = get_jwt_identity()
    transaction = Transaction.query.filter_by(id=transaction_id, user_id=user_id).first()

    if not transaction:
        return jsonify({"message": "Transaction not found"}), 404

    db.session.delete(transaction)
    db.session.commit()
    return jsonify({"message": "Transaction deleted successfully!"}), 200

# Global Error Handlers
@jwt.unauthorized_loader
def unauthorized_token_callback(error):
    return jsonify({"message": "Missing or invalid authorization header"}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({"message": "Invalid token"}), 401

@jwt.expired_token_loader
def expired_token_callback():
    return jsonify({"message": "Token has expired"}), 401

if __name__ == '__main__':
    app.run(debug=True, port=5001)
