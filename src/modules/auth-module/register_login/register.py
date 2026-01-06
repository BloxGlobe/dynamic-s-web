# auth-module/register_login/register.py

from flask import request, jsonify
from uuid import uuid4
from .store import save_user, user_exists
from session_manager.session import save_session
from werkzeug.security import generate_password_hash

def register():
    data = request.json or {}

    username = data.get("username") or data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    if user_exists(email):
        return jsonify({"error": "User already exists"}), 400

    password_hash = generate_password_hash(password)
    user = {
        "id": str(uuid4()),
        "username": username,
        "email": email,
        "password_hash": password_hash
    }

    save_user(user)
    save_session({"id": user["id"], "username": user["username"], "email": user["email"]})
    return jsonify({"id": user["id"], "username": user["username"], "email": user["email"]}), 201
