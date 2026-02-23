"""
Data Service

Responsible for loading and validating ML datasets.
Backend never directly reads CSV elsewhere.
"""

from pathlib import Path
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "synthetic_agro_scenarios_100k.csv"


class DatasetService:

    def __init__(self):
        self.df = None

    def load_dataset(self):
        """Load dataset safely."""
        if not DATA_PATH.exists():
            raise FileNotFoundError("Dataset not found")

        self.df = pd.read_csv(DATA_PATH)
        return self.df

    def get_columns(self):
        """Return dataset columns."""
        if self.df is None:
            self.load_dataset()

        return list(self.df.columns)

    def get_sample(self, n=5):
        """Return sample rows."""
        if self.df is None:
            self.load_dataset()

        return self.df.head(n).to_dict(orient="records")
