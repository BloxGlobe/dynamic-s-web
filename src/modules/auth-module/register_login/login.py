# auth-module/register_login/login.py

from flask import request, jsonify
from .store import find_user_by_email
from session_manager.session import save_session
from werkzeug.security import check_password_hash

def login():
    data = request.json or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing credentials"}), 400

    user = find_user_by_email(email)
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not check_password_hash(user.get("password_hash", ""), password):
        return jsonify({"error": "Invalid credentials"}), 401

    save_session({"id": user["id"], "username": user["username"], "email": user["email"]})
    return jsonify({"id": user["id"], "username": user["username"], "email": user["email"]}), 200
