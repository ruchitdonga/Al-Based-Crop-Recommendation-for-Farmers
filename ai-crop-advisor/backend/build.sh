#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Installing gdown to bypass Google Drive limits..."
pip install gdown

echo "Creating models directory if it doesn't exist..."
mkdir -p models

echo "Downloading Machine Learning Models securely..."
# These Environment Variables must be set in your Render dashboard, but JUST the IDs!
gdown "$CROP_MODEL_ID" -O models/crop_pipeline.pkl
gdown "$YIELD_MODEL_ID" -O models/yield_models.pkl

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Collecting static files and migrating database..."
python manage.py collectstatic --no-input
python manage.py migrate

echo "Build finished successfully!"
