from flask import session, jsonify

def load_session():
    return jsonify(session.get("user")), 200

def save_session(user):
    session["user"] = user

def clear_session():
    session.pop("user", None)
    return jsonify({"ok": True}), 200
