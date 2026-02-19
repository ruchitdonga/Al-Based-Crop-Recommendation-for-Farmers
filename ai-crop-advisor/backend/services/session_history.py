"""
Session-based in-memory history storage for recommendations.
Stores last 5 recommendations per session.
"""

from collections import defaultdict
from datetime import datetime


class SessionHistoryStore:
    """In-memory store for session-based recommendation history."""

    def __init__(self, max_per_session=5):
        self.max_per_session = max_per_session
        self.store = defaultdict(list)

    def add(self, session_id: str, crop: str, confidence: float):
        """Add recommendation to session history."""

        if not session_id:
            return

        history = self.store[session_id]

        # Add new recommendation
        history.append({
            "crop": crop,
            "confidence": confidence,
            "timestamp": datetime.now().isoformat()
        })

        # Keep only last N
        if len(history) > self.max_per_session:
            history.pop(0)

    def get(self, session_id: str):
        """Get session history."""

        if not session_id:
            return []

        return self.store.get(session_id, [])

    def clear(self, session_id: str):
        """Clear session history."""

        if session_id in self.store:
            del self.store[session_id]


# Global store instance
history_store = SessionHistoryStore(max_per_session=5)
