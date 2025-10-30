import pandas as pd 
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import LabelEncoder
import joblib
import logging
from collections import Counter

logging.basicConfig(level=logging.INFO)

def main():
    # Load and prepare data
    evidence, labels, artifacts = load_data("datasets/survey_results_public.csv")
    logging.info(f"Data shape: {evidence.shape}, Labels shape: {labels.shape}")
    
    # Train model
    model = train_model(evidence, labels)
    
    # Save model and artifacts needed for prediction
    joblib.dump(model, 'ml/salary_model.pkl')
    joblib.dump(artifacts, 'ml/model_artifacts.pkl')
    logging.info("Model and artifacts saved!")

def load_data(filename):
    # Load CSV
    df = pd.read_csv(filename)
    logging.info("Loaded data")
    
    # Filter: keep only full-time employed people
    df = df[df['Employment'].str.contains('full-time', case=False, na=False)]
    
    # Select only columns we need
    df = df[['YearsCodePro', 'EdLevel', 'DevType', 'Country', 'LanguageHaveWorkedWith', 'ConvertedCompYearly']].copy()
    
    # Remove rows with missing salary
    df = df.dropna(subset=['ConvertedCompYearly'])
    
    # Remove extreme outliers (keep middle 98%)
    lower = df['ConvertedCompYearly'].quantile(0.01)
    upper = df['ConvertedCompYearly'].quantile(0.99)
    df = df[(df['ConvertedCompYearly'] >= lower) & (df['ConvertedCompYearly'] <= upper)]
    logging.info(f"Final rows: {len(df)}")
    
    # Handle YearsCodePro
    df['YearsCodePro'] = df['YearsCodePro'].replace({
        'Less than 1 year': 0.5,
        'More than 50 years': 50
    })
    df['YearsCodePro'] = pd.to_numeric(df['YearsCodePro'], errors='coerce')
    years_median = df['YearsCodePro'].median()
    df['YearsCodePro'].fillna(years_median, inplace=True)
    
    # Handle EdLevel - simple numeric scale
    edlevel_mapping = {
        'Primary/elementary school': 1,
        'Secondary school': 2,
        'Some college/university study without earning a degree': 3,
        'Associate degree (A.A., A.S., etc.)': 4,
        'Bachelor’s degree (B.A., B.S., B.Eng., etc.)': 5,
        'Master’s degree (M.A., M.S., M.Eng., MBA, etc.)': 6,
        'Professional degree (JD, MD, Ph.D, Ed.D, etc.)': 7
    }
    df['EdLevel'] = df['EdLevel'].map(edlevel_mapping)
    df['EdLevel'].fillna(3, inplace=True)
    
    # Handle DevType - save encoder
    le_devtype = LabelEncoder()
    df['DevType'] = le_devtype.fit_transform(df['DevType'].fillna('Unknown'))
    
    # Handle Country - save encoder
    le_country = LabelEncoder()
    df['Country'] = le_country.fit_transform(df['Country'].fillna('Unknown'))
    
    # Find top 15 most common languages
    all_languages = df['LanguageHaveWorkedWith'].fillna('').str.split(';')
    lang_counter = Counter()
    for langs in all_languages:
        lang_counter.update([lang.strip() for lang in langs if lang.strip()])
    
    top_languages = [lang for lang, count in lang_counter.most_common(15)]
    logging.info(f"Top languages: {top_languages}")
    
    # Create binary columns for top languages
    for lang in top_languages:
        col_name = f'Knows_{lang.replace(" ", "_").replace("/", "_").replace("#", "Sharp").replace("+", "Plus")}'
        df[col_name] = df['LanguageHaveWorkedWith'].fillna('').str.contains(lang, case=False, regex=False).astype(int)
    
    # Count total languages
    df['NumLanguages'] = df['LanguageHaveWorkedWith'].fillna('').str.split(';').apply(lambda x: len([l for l in x if l.strip()]))
    
    # Drop original column
    df.drop('LanguageHaveWorkedWith', axis=1, inplace=True)
    
    # Separate features and target
    labels = df['ConvertedCompYearly']
    evidence = df.drop('ConvertedCompYearly', axis=1)
    
    # Save artifacts for prediction
    artifacts = {
        'top_languages': top_languages,
        'le_devtype': le_devtype,
        'le_country': le_country,
        'years_median': years_median,
        'edlevel_mapping': edlevel_mapping,
        'feature_columns': list(evidence.columns)
    }
    
    return evidence, labels, artifacts

def train_model(evidence, labels):
    # Split data: 80% train, 20% test
    X_train, X_test, y_train, y_test = train_test_split(
        evidence, labels, test_size=0.2, random_state=42
    )
    
    # Create and train model
    model = RandomForestRegressor(n_estimators=150, random_state=42, n_jobs=-1, max_depth=15)
    model.fit(X_train, y_train)
    
    # Make predictions
    predictions = model.predict(X_test)
    
    # Evaluate
    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    
    logging.info(f"Average prediction error: ${mae:,.0f}")
    logging.info(f"R² score: {r2:.3f} (higher is better, max 1.0)")
    logging.info(f"Median salary in test: ${y_test.median():,.0f}")
    
    return model

def _map_job_title_to_devtype(job_title):
    job_title = job_title.lower()
    
    if 'senior' in job_title and ('engineer' in job_title or 'developer' in job_title):
        return 'Developer, back-end'  # More accurate for senior devs
    elif 'senior' in job_title or 'lead' in job_title or 'principal' in job_title:
        return 'Senior Executive (C-Suite, VP, etc.)'
    # ... rest of the function stays the same ...

if __name__ == "__main__":
    main()