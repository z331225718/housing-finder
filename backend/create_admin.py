#!/usr/bin/env python3
import sys
import os

# 设置路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, init_db
from app.models import User
from app.auth import get_password_hash

def main():
    init_db()
    db = SessionLocal()

    try:
        user = db.query(User).first()
        if user:
            print(f'User already exists: {user.username}')
        else:
            user = User(
                username='admin',
                password_hash=get_password_hash('admin123'),
                role='admin'
            )
            db.add(user)
            db.commit()
            print('Admin user created! username: admin, password: admin123')
    finally:
        db.close()

if __name__ == '__main__':
    main()
