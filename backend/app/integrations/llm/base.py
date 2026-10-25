"""LLM Provider abstraction definition for OpenRouter gateway."""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from pydantic import BaseModel


class LLMRequest(BaseModel):
    system_prompt: str
    user_prompt: str
    temperature: float = 0.7
    max_tokens: Optional[int] = None
    response_schema: Optional[Dict[str, Any]] = None


class LLMResponse(BaseModel):
    content: str
    parsed_json: Optional[Dict[str, Any]] = None
    model_used: str
    prompt_tokens: int = 0
    completion_tokens: int = 0


class LLMProvider(ABC):
    """Abstract Base Class for LLM inference gateways."""

    @abstractmethod
    async def generate_structured(self, request: LLMRequest) -> LLMResponse:
        """Execute single inference request and enforce structured output."""
        pass
