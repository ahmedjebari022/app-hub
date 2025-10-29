from sqlalchemy import Integer,String,DateTime,Boolean,Float,Text,Enum
from sqlalchemy.orm import Mapped,mapped_column
from datetime import datetime
from database import db

import enum 
class User(db.Model):
    __tablename__ = 'users'
    
    id:Mapped[int] = mapped_column(primary_key=True)
    username:Mapped[str] = mapped_column(String(80),unique=True)
    email:Mapped[str] = mapped_column(String(80),unique=True)
    _password:Mapped[str] = mapped_column('password',String(80))
    created_ad:Mapped[datetime] = mapped_column(DateTime,default=datetime.now)
    applications:Mapped[list["Application"]] = db.relationship(
        back_populates='user',
        cascade='all,delete-orphan'
    )


    @property
    def password(self):
        raise AttributeError('Password is not readble')
    
    @password.setter
    def password(self,password):
        from app import bcrypt
        self._password = bcrypt.generate_password_hash(password).decode('utf-8')
    


    def verify_password(self,password):
        from app import bcrypt
        return bcrypt.check_password_hash(self._password,password)

    def __repr__(self):
        return f'User {self.username} '


class StatusEnum(enum.Enum):
    APPLIED = "applied"
    PHONE_SCREEN_SCHEDULED = "phone_screen"
    PHONE_SCREEN_COMPLETED = "phone_screen_completed"
    TECHNICAL_INTERVIEW_SCHEDULED = "technical_interview_scheduled"
    TECHNICAL_INTERVIEW_COMPLETED = "technical_interview_completed"
    FINAL_ROUND = "final_round"
    OFFER_RECEIVED = "offer_received"
    REJECTED = "rejected"
    ACCEPTED = "accepted"
    WITHDRAWN = "withdrawn"



class Application(db.Model):
    __tablename__ = 'applications'

    id:Mapped[int] = mapped_column(primary_key=True)
    user:Mapped["User"] = db.relationship(back_populates='applications')
    user_id:Mapped[int] = mapped_column(db.ForeignKey('users.id'),nullable=False)
    company_name:Mapped[str] = mapped_column(String(80),nullable=False)
    job_title:Mapped[str] = mapped_column(String(80),nullable=False)
    location:Mapped[str] = mapped_column(String(80),nullable=False)

    date_applied:Mapped[datetime] = mapped_column(DateTime,default=datetime.now)
    current_status:Mapped[str] = mapped_column(Enum(StatusEnum),default=StatusEnum.APPLIED)
    job_description:Mapped[str] = mapped_column(Text,nullable=False)
    required_skills:Mapped[str] = mapped_column(Text,nullable=True)
    years_of_experience:Mapped[float] = mapped_column(Float,nullable=False)

    posted_salary:Mapped[str] = mapped_column(String(80),nullable=True)
    predicted_salary:Mapped[str] = mapped_column(String(80),nullable=True)
    actual_offer:Mapped[str] = mapped_column(String(80),nullable=True)

    priority_level:Mapped[int] = mapped_column(Integer,nullable=True)
    recruiter_name:Mapped[str] = mapped_column(String(80),nullable=True)
    recruiter_email:Mapped[str] = mapped_column(String(80),nullable=True)
    notes:Mapped[str] = mapped_column(Text,nullable=True)