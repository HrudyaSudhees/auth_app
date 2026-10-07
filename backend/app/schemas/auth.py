from pydantic import BaseModel, EmailStr, Field
from typing import Literal

Role = Literal["admin", "user"]
Gender = Literal["male", "female", "other", "prefer_not_to_say"]

class DeleteAccountRequest(BaseModel):
    password: str
    
class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)

class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    age: int = Field(ge=1, le=120)
    password: str = Field(min_length=8, max_length=128)
    confirm_password: str = Field(min_length=8, max_length=128)
    avatar: str = "default"


class LoginRequest(BaseModel):
    username_or_email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: Role
    age: int | None
    avatar: str

class ProfileUpdate(BaseModel):
    name: str | None = None
    age: int | None = Field(default=None, ge=1, le=120)
    gender: Gender | None = None