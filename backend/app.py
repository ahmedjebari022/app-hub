from flask import Flask,request,jsonify,session
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from config import Config
import os
from dotenv import load_dotenv
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from database import db
load_dotenv()





app = Flask(__name__)

app.config.from_object(Config)

Session(app)


db.init_app(app)
from models import *
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)

@app.route('/')
def index():
    return 'Flask + mySQL servers running!'

@app.route('/users',methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({
            'success':False,
            'error':'Missin json body data',
        }),400
    required_fields = ['username','email','password']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'success':False,
                'error':f'missing {field} in the json request'
            }),404
    try :
        user = User(username=data['username'],email=data['email'],password=data['password'])
        db.session.add(user)
        db.session.commit()
        user_repr = f'{user.__repr__()}'
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success':False,
            'error':f'{e}'
        }),500
    
    
    return jsonify({
            'success':True,
            'content':f'{user_repr}'
        }),200

    
    
@app.route('/login',methods=['POST'])
def login():
    data = request.get_json()
    required_fields = ['email','password']

    if not data :
        return jsonify({
            'success':False,
            'error':f'no json body '
        }),400
    
    for field in required_fields:
        if field not in data:
            return jsonify({
                'succes':False,
                'error':f'missing {field} from body'
            })
    try :
        user = User.query.filter_by(email=data['email']).first()
        if not user :
            return jsonify({
                'succes':False,
                'error':'No user found with the email'
            }),401
        
        if not user.verify_password(data['password']) :
            return jsonify({
                'success':False,
                'error':'wrong password'
            }),401
        session['user_id'] = user.id
        session['email'] = user.email
        session['username'] = user.username
        return jsonify({
            'success':True,
            'message':f'Logged in succesfully',
            'user':f'user_id :{user.id}'\
                   f' email : {user.email}'\
                   f' username : {user.username}'
        }),200
    except Exception as e:
        return jsonify({
            'succes':False,
            'error':f'{e}'
        }),500

@app.route('/me',methods=['GET'])
def getSession():
    
    current_user = session
    print(current_user)
    if not current_user.get('user_id'): 
        return jsonify({
            'success':False,
            'error':f'No user is logged in for now'
        }),400
    return jsonify({
        'success':True,
        'message':f'Session is active',
        'current_user':f'user_id:  {current_user['user_id']} ' \
                       f'email: {current_user['email']}' \
                       f'username: {current_user['username']}' \
    }),200

@app.route('/logout',methods=['POST'])
def logout():
    
    if not session.get('user_id') :
        return jsonify({
            'success':False,
            'error':'Unauthorized'
        }),401
    session.clear()
    return jsonify({
        'success':True,
        'message':'User logged out succesfully'
    })


@app.route('/applications',methods=['POST'])
def create_application():
    application = request.get_json()
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({
           'success':False,
           'error':f'Unauthorized' 
        }),401
    
    if not application :
        return jsonify({
            'success':False,
            'error':f'Missing json Body'
        }),400
    required_fields = ['company_name','job_title','location',
                       'job_description','required_skills','years_of_experience'
                       ,'date_applied','posted_salary']
    for field in required_fields:
        if field not in application:
            return jsonify({
                'succes':False,
                'error':f'Missing required field : {field}'
            }),400
    try:
        application = Application(user_id=user_id,company_name=application['company_name'],job_title=application['job_title'],location=application['location'],
                                  job_description=application['job_description'],required_skills=application['required_skills'],
                                  years_of_experience=application['years_of_experience'],date_applied=application['date_applied'],
                                  posted_salary=application['posted_salary'])
        db.session.add(application)
        db.session.commit()
        return jsonify({
            'success':True,
            'message':f'Application created succesfully'
        }),201    
    except Exception as e:
        return jsonify({
            'success':False,
            'error':f'{e}'
        }),500
        
@app.route('/applications/<int:id>',methods=['PATCH'])
def update_application(id):
    data=request.get_json()
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({
           'success':False,
           'error':f'Unauthorized' 
        }),401
    if not data :
        return jsonify({
            'success':False,
            'error':f'Missing json Body'
        }),400
    try :
        application = Application.query.filter_by(id=id,user_id=user_id).first()
        if not application : 
            return jsonify({
                'success':False,
                'error':f'No application found with the id {id} for the current user'
            }),404
        if not application.user_id == user_id:
            return jsonify({
                'success':False,
                'error':f'Unauthorized'
            }),401
        
        application.current_status = data.get('current_status',application.current_status)
        application.notes = data.get('notes',application.notes)
        application.priority_level = data.get('priority_level',application.priority_level)
        application.recruiter_name = data.get('recruiter_name',application.recruiter_name)
        application.recruiter_email = data.get('recruiter_email',application.recruiter_email)
        application.actual_offer = data.get('actual_offer',application.actual_offer)
        db.session.commit()
        return jsonify({
            'success':True,
            'message':f'Application updated succesfully'
        }),200

    except Exception as e:
        return jsonify({
            'success':False,
            'error':f'{e}'
        }),500
    
@app.route('/applications',methods=['GET'])
def get_applications():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({
              'success':False,
              'error':f'Unauthorized' 
        })
    try :
        applications = Application.query.filter_by(user_id=user_id).all()
        applications_list = []
        for app in applications:
            
            app_data = {
                'id': app.id,
                'company_name': app.company_name,
                'job_title': app.job_title,
                'location': app.location,
                'date_applied': app.date_applied,
                'current_status': app.current_status.value,
                'job_description': app.job_description,
                'required_skills': app.required_skills,
                'years_of_experience': app.years_of_experience,
                'posted_salary': app.posted_salary,
                'predicted_salary': app.predicted_salary,
                'actual_offer': app.actual_offer,
                'priority_level': app.priority_level,
                'recruiter_name': app.recruiter_name,
                'recruiter_email': app.recruiter_email,
                'notes': app.notes
            }
            applications_list.append(app_data)
        return jsonify({
            'success':True,
            'applications':applications_list
        }),200
    except Exception as e:
        return jsonify({
            'success':False,
            'error':f'{e}'
        }),500
@app.route('/applications/<int:id>',methods=['GET'])
def get_application(id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({
              'success':False,
              'error':f'Unauthorized' 
        })
    try:
        application = Application.query.filter_by(id=id,user_id=user_id).first()
        if not application :
            return jsonify({
                'success':False,
                'error':f'No application found with the id {id} for the current user'
            }),404
        app_data = {
                'id': application.id,
                'company_name': application.company_name,
                'job_title': application.job_title,
                'location': application.location,
                'date_applied': application.date_applied,
                'current_status': application.current_status.value,
                'job_description': application.job_description,
                'required_skills': application.required_skills,
                'years_of_experience': application.years_of_experience,
                'posted_salary': application.posted_salary,
                'predicted_salary': application.predicted_salary,
                'actual_offer': application.actual_offer,
                'priority_level': application.priority_level,
                'recruiter_name': application.recruiter_name,
                'recruiter_email': application.recruiter_email,
                'notes': application.notes
            }
        return jsonify({
            'success':True,
            'application':app_data
        }),200
    except Exception as e:
        return jsonify({
            'success':False,
            'error':f'{e}'
        }),500

if __name__ == '__main__':
    app.run(debug=True)
