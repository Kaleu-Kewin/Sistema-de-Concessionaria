from functools import wraps
from src.database import db

def exception(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            raise e  
    return wrapper

def exception_rollback(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            db.session.rollback()
            raise e
    return wrapper