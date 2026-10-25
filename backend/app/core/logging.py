"""Structured logging setup for Autonomous YouTube Agent."""

import logging
import sys
from typing import Any, Dict


class SafeFormatter(logging.Formatter):
    """Logging formatter that scrubs known credential patterns if present."""

    SENSITIVE_KEYS = ["api_key", "client_secret", "password", "token", "key"]

    def format(self, record: logging.LogRecord) -> str:
        # Prepend request_id if available
        request_id = getattr(record, "request_id", None)
        req_prefix = f"[{request_id}] " if request_id else ""
        record.msg = f"{req_prefix}{record.msg}"
        return super().format(record)


def setup_logging(log_level: str = "INFO") -> None:
    """Configure console logger with safe format."""
    level = getattr(logging, log_level.upper(), logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(level)

    formatter = SafeFormatter(
        fmt="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.setLevel(level)

    # Avoid duplicate handlers
    if not root_logger.handlers:
        root_logger.addHandler(handler)
    else:
        root_logger.handlers = [handler]

    # Silence verbose 3rd-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
