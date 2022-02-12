from typing import Optional
import uuid
from pydantic import BaseModel, Field, validator
from bson.objectid import ObjectId

# class PyObjectId(ObjectId):
#     """ Custom Type for reading MongoDB IDs """
#     @classmethod
#     def __get_validators__(cls):
#         yield cls.validate

#     @classmethod
#     def validate(cls, v):
#         if not ObjectId.is_valid(v):
#             raise ValueError("Invalid object_id")
#         return ObjectId(v)

#     @classmethod
#     def __modify_schema__(cls, field_schema):
#         field_schema.update(type="string")

# class ObjId(ObjectId):
#     @classmethod
#     def __get_validators__(cls):
#         yield cls.validate

class TaskModel(BaseModel):

    # id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    id: str = Field(...)
    name: str = Field(...)
    completed: bool = Field(...)
    taskid: str = Field(...)

class UpdateTaskModel(BaseModel):

    name: str = Field(...)
    completed: bool = Field(...)

class Customers(BaseModel):

    name: str = Field(...)
    address: str = Field(...)
    email: str = Field(...)
    password: str = Field(...)
    phone_number: str = Field(...)
    reputation_score: str = Field(...)

class Shipper(BaseModel):

    shipper: str = Field(...)
    address: str = Field(...)
    name: str = Field(...)
    email: str = Field(...)
    password: str = Field(...)
    phone_number: str = Field(...)
    business_type: str = Field(...)
    reputation_score : str = Field(...)