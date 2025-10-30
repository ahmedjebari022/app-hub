import redis

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://ahmedjebari022:labanane022@localhost:3306/app_hub_db'
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'dev-secret-key-change-in-production'
    SESSION_TYPE = 'redis'
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_REDIS = redis.from_url('redis://localhost:6379')
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax' 
    SESSION_COOKIE_SECURE = False