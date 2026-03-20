#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Creating models directory if it doesn't exist..."
mkdir -p models

echo "Downloading Machine Learning Models securely..."
# These Environment Variables must be set in your Render dashboard!
curl -L -o models/crop_pipeline.pkl "$CROP_MODEL_URL"
curl -L -o models/yield_models.pkl "$YIELD_MODEL_URL"

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Collecting static files and migrating database..."
python manage.py collectstatic --no-input
python manage.py migrate

echo "Build finished successfully!"
