"""
Run this script once locally to generate model.pkl and scaler.pkl
before deploying to Render. On startup, the app auto-trains if
artifacts are missing.

Usage:
    cd backend
    python -m app.ml.train
"""

from app.ml.model import _train_and_save

if __name__ == "__main__":
    print("Training VotingClassifier on Peddapalli accident data...")
    _train_and_save()
    print("Done. Artifacts saved to app/ml/artifacts/")
