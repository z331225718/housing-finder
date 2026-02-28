#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, '/var/www/housing-finder/backend')

import bcrypt
from app.database import SessionLocal, init_db
from app.models import User

def main():
    init_db()
    db = SessionLocal()
    try:
        user = db.query(User).first()
        if user:
            print(f'User exists: {user.username}')
        else:
            # 直接使用 bcrypt
            password_hash = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            user = User(username='admin', password_hash=password_hash, role='admin')
            db.add(user)
            db.commit()
            print('Admin created! admin/admin123')
    finally:
        db.close()

if __name__ == '__main__':
    main()
