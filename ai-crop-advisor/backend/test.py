try:
    import joblib
except ImportError:
    print("Error: joblib is not installed. Please install it using: pip install joblib")
    exit(1)

pipeline = joblib.load("crop_pipeline.pkl")

print(type(pipeline))
print(pipeline)
