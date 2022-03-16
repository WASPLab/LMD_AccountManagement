from typing import Optional
import uuid
from pydantic import BaseModel, Field, validator
from bson.objectid import ObjectId

class Address(BaseModel):
    street: str = Field(...)
    addressline2: str= Field(...)
    city:str = Field(...)
    province: str = Field(...)
    postalcode: str = Field(...)

class Payment(BaseModel):
    card_number: str = Field(...)
    Expiration: str = Field(...)
    name_on_card: str = Field(...)
    cvc: str = Field(...)

class Vehicle(BaseModel):
    vehicle_insurance_number: str = Field(...)
    car_make: str = Field(...)
    car_model: str = Field(...)
    year:str = Field(...)

class License(BaseModel):
    license_number: str = Field(...)
    license_expiry_date: str = Field(...)

class Driver(BaseModel):

    first_name: str = Field(...)
    last_name: str = Field(...)
    username: str = Field(...)
    email: str = Field(...)
    password: str = Field(...)
    # address: Address
    # phone: str = Field(...)
    # payment: Payment
    # driving_license: License
    # vehicle_details: Vehicle
    # insurance_policy_number: str = Field(...)
    # reputation_score: str = Field(...)

class Shipper(BaseModel):

    username: str = Field(...)
    email: str = Field(...)
    address: Address
    password: str = Field(...)
    phone: str = Field(...)
    payment: Payment
    business_type: str = Field(...)
    reputation_score : str = Field(...)

class UpdateDriver(BaseModel):

    username: str = Field(...)
    email: str = Field(...) 
    phone: str = Field(...)
    address: Address
    payment: Payment


class UpdateShipper(BaseModel):

    username: str = Field(...)
    email: str = Field(...)
    address: str = Address
    # password: str = Field(...)
    phone: str = Field(...)
    payment: Payment
    business_type: str = Field(...)

class Customers(BaseModel):

    name: str = Field(...)
    address: str = Field(...)
    email: str = Field(...)
    password: str = Field(...)
    phone_number: str = Field(...)
    reputation_score: str = Field(...)

class LoginModel(BaseModel):

    username: str = Field(...)
    password: str = Field(...)


class Token(BaseModel):
    access_token:str
    token_type:str

class TokenData(BaseModel):
    username: Optional[str]=None