"""Manual sanity-check script for loading a serialized crop model.

Note: This file is named `test.py`, so Django's test discovery will try to import
it during `python manage.py test`. Keep all executable code behind `main()` to
avoid failing test runs when model artifacts are not present.
"""


def main() -> int:
    try:
        import joblib
    except ImportError:
        print("Error: joblib is not installed. Install it with: python -m pip install joblib")
        return 1

    import os

    base_dir = os.path.dirname(__file__)
    model_path = os.path.join(base_dir, "models", "crop_pipeline.pkl")

    if not os.path.exists(model_path):
        print(f"Model file not found: {model_path}")
        return 1

    pipeline = joblib.load(model_path)
    print(type(pipeline))
    print(pipeline)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
