# Use official Python runtime as a parent image
FROM python:3.10

# Create a non-root user (Required by Hugging Face Spaces)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# Copy the requirements file from the backend directory
COPY --chown=user ai-crop-advisor/backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the entire GitHub repository (the .dockerignore will skip frontend node_modules)
COPY --chown=user . .

# Change working directory to the backend to run Django commands
WORKDIR $HOME/app/ai-crop-advisor/backend

# Collect static files for WhiteNoise to serve
RUN python manage.py collectstatic --noinput

# Hugging Face exposes port 7860
EXPOSE 7860

# Command to run the application using Gunicorn
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:7860", "--workers", "2", "--threads", "4", "--timeout", "120"]
