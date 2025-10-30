import joblib
import pandas as pd
import numpy as np

# Load model and artifacts once (cached)
_model = None
_artifacts = None

def load_model():
    """Load the trained model and artifacts (cached)"""
    global _model, _artifacts
    if _model is None:
        _model = joblib.load('ml/salary_model.pkl')
        _artifacts = joblib.load('ml/model_artifacts.pkl')
    return _model, _artifacts

def predict_salary(application_data):
   
    model, artifacts = load_model()
    
    top_languages = artifacts['top_languages']
    le_devtype = artifacts['le_devtype']
    le_country = artifacts['le_country']
    years_median = artifacts['years_median']
    edlevel_mapping = artifacts['edlevel_mapping']
    feature_columns = artifacts['feature_columns']
    
    years = application_data.get('years_of_experience', 0)
    try:
        years = float(years)
    except:
        years = years_median
    
    education = application_data.get('education_level', 5)
    
    
    job_title = application_data.get('job_title', '').lower()
    devtype_str = _map_job_title_to_devtype(job_title)
    
    try:
        devtype = le_devtype.transform([devtype_str])[0]
    except:
        devtype = le_devtype.transform(['Unknown'])[0]
    
    location = application_data.get('location', '')
    country_str = _extract_country(location)
    
    try:
        country = le_country.transform([country_str])[0]
    except:
        country = le_country.transform(['Unknown'])[0]
    
   
    skills = application_data.get('required_skills', '')
    skills_list = [s.strip().lower() for s in skills.split(',')]
    
    features = {
        'YearsCodePro': years,
        'EdLevel': education,
        'DevType': devtype,
        'Country': country,
        'NumLanguages': len(skills_list)
    }
    
    for lang in top_languages:
        col_name = f'Knows_{lang.replace(" ", "_").replace("/", "_").replace("#", "Sharp").replace("+", "Plus")}'
        features[col_name] = 1 if any(lang.lower() in skill for skill in skills_list) else 0
    
    df = pd.DataFrame([features])
    
    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0
    
    df = df[feature_columns] 
    
    
    prediction = model.predict(df)[0]
    
    return round(prediction, 2)

def _map_job_title_to_devtype(job_title):
    """Simple keyword-based mapping"""
    job_title = job_title.lower()
    
    if 'senior' in job_title or 'lead' in job_title or 'principal' in job_title:
        return 'Senior Executive (C-Suite, VP, etc.)'
    elif 'back' in job_title or 'backend' in job_title:
        return 'Developer, back-end'
    elif 'front' in job_title or 'frontend' in job_title:
        return 'Developer, front-end'
    elif 'full' in job_title or 'fullstack' in job_title:
        return 'Developer, full-stack'
    elif 'data scientist' in job_title or 'ml' in job_title or 'machine learning' in job_title:
        return 'Data scientist or machine learning specialist'
    elif 'data' in job_title:
        return 'Data or business analyst'
    elif 'devops' in job_title:
        return 'DevOps specialist'
    elif 'mobile' in job_title:
        return 'Developer, mobile'
    elif 'qa' in job_title or 'test' in job_title:
        return 'Developer, QA or test'
    else:
        return 'Developer, full-stack'  # Default

def _extract_country(location):
    
    location = location.lower()
    
    
    if 'usa' in location or 'united states' in location or 'u.s' in location:
        return 'United States of America'
    elif 'uk' in location or 'united kingdom' in location or 'britain' in location:
        return 'United Kingdom of Great Britain and Northern Ireland'
    elif 'canada' in location:
        return 'Canada'
    elif 'india' in location:
        return 'India'
    elif 'germany' in location:
        return 'Germany'
    elif 'france' in location:
        return 'France'
    elif 'australia' in location:
        return 'Australia'
    elif 'remote' in location or not location:
        return 'United States of America'  
    else:
        return 'Unknown'