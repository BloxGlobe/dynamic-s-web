# Simple in-memory user store for development/testing only
_users_by_email = {}

def save_user(user):
    _users_by_email[user["email"].lower()] = user

def user_exists(email):
    return email and email.lower() in _users_by_email

def find_user_by_email(email):
    if not email: return None
    return _users_by_email.get(email.lower())
