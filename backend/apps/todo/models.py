from datetime import datetime
from typing import Optional
import uuid
from pydantic import BaseModel, Field, validator
from bson.objectid import ObjectId

class Address(BaseModel):
    street: Optional[str] = Field(...)
    addressline2: Optional[str]= Field(...)
    city:Optional[str] = Field(...)
    province: Optional[str] = Field(...)
    postalcode: Optional[str] = Field(...)

class Payment(BaseModel):
    card_number: Optional[str] = Field(...)
    expiration: Optional[str] = Field(...)
    name_on_card: Optional[str] = Field(...)
    cvc: Optional[str] = Field(...)

class Vehicle(BaseModel):
    vehicle_insurance_number: Optional[str] = Field(...)
    car_make: Optional[str] = Field(...)
    car_model: Optional[str] = Field(...)
    year:Optional[str] = Field(...)

class License(BaseModel):
    license_number: Optional[str] = Field(...)
    license_expiry_date: Optional[str] = Field(...)

# class Driver(BaseModel):

#     insurance_policy_number: Optional[str] = Field(...)
#     photo_id: Optional[str] = Field(...)
#     work_eligibility: Optional[str] = Field(...)
#     reputation_score: Optional[str] = Field(...)

class Signup(BaseModel):
    first_name: Optional[str] = Field(...)
    last_name: Optional[str] = Field(...)
    username: Optional[str] = Field(...)
    # phone: Optional[str] = Field(...)
    email: Optional[str] = Field(...)
    password: Optional[str] = Field(...)

class Shipper(BaseModel):
    business_name: Optional[str] = Field(...)
    business_type: Optional[str] = Field(...)
    # reputation_score : Optional[str] = Field(...)

class UpdateShipper(BaseModel):

    username: Optional[str] = Field(...)
    email: Optional[str] = Field(...)
    address: Optional[str] = Address
    password: Optional[str] = Field(...)
    phone: Optional[str] = Field(...)
    payment: Payment
    business_type: Optional[str] = Field(...)

class UpdateDriver(BaseModel):

    username: Optional[str] = Field(...)
    email: Optional[str] = Field(...) 
    phone: Optional[str] = Field(...)
    address: Address
    payment: Payment

class Consignee(BaseModel):

    name: Optional[str] = Field(...)
    address: Optional[str] = Field(...)
    email: Optional[str] = Field(...)
    password: Optional[str] = Field(...)
    phone_number: Optional[str] = Field(...)
    reputation_score: Optional[str] = Field(...)

class Parcel(BaseModel):
    shipper_username: Optional[str] = Field("")
    driver_username: Optional[str] = Field("")
    status: Optional[str] = Field("")
    parcelid: Optional[str] = Field("")
    consignee: Optional[str] = Field(...)
    size: Optional[str] = Field(...)
    numItems: Optional[str] = Field(...)
    cost: Optional[str] = Field(...)
    pickupStreet: Optional[str] = Field(...)
    pickupAddressline2: Optional[str]= Field(...)
    pickupCity:Optional[str] = Field(...)
    pickupProvince: Optional[str] = Field(...)
    pickupPostalcode: Optional[str] = Field(...)
    dropStreet: Optional[str] = Field(...)
    dropAddressline2: Optional[str]= Field(...)
    dropCity:Optional[str] = Field(...)
    dropProvince: Optional[str] = Field(...)
    dropPostalcode: Optional[str] = Field(...)
    deliveryDay: Optional[str] = Field(...)
    pickupDay: Optional[str] = Field(...)
    pickupTime: Optional[str] = Field(...)
    deliveryTime: Optional[str] = Field(...)
    distance: Optional[str] = Field(...)
    createdAt: Optional[datetime] = Field(None)
    updatedAt: Optional[datetime] = Field(None)


class LoginModel(BaseModel):

    username: Optional[str] = Field(...)
    password: Optional[str] = Field(...)


class Token(BaseModel):
    access_token:Optional[str]
    token_type:Optional[str]

class TokenData(BaseModel):
    username: Optional[str]=None