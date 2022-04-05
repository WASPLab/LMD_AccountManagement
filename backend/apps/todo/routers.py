from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from .models import LoginModel, License, Vehicle, Payment, Address, Signup, UpdateDriver, Shipper, UpdateShipper, Parcel, Token, TokenData
from bson import ObjectId
import json
from bson import json_util
from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import jwt, JWTError
from typing import Optional
from datetime import datetime, timedelta
import uuid

SECRET_KEY="dbe1983a11057f959c4b6a04db3fdb28b1a9582ea84ca57a14e905ccd4f1f279"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30


router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/task/getUser")

pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password,hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user(request, type: str, username: str):
    response = await request.app.mongodb[type].find_one({'username': username},{'_id':0})
    return response

async def authenticate_user(request, type: str, username: str, password: str):
    user=await get_user(request, type, username)
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user

def parse_json(data):   
    return json.loads(json_util.dumps(data))
    
def fake_hash_password(password: str):
    return "fakehashed" + password

def fake_decode_token(token):
    # This doesn't provide any security at all
    # Check the next version
    user = get_user(token)
    return user
    
@router.get("/getUser")
async def get_current_user(request: Request, type: str, token: str=Depends(oauth2_scheme)):
    credentials_exception=HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate":"Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = await get_user(request, type, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

def create_access_token(data:dict, expires_delta: Optional[timedelta]=None):
    to_encode=data.copy()
    if expires_delta:
        expire=datetime.utcnow()+expires_delta
    else:
        expire=datetime.utcnow()+timedelta(minutes=15)
    to_encode.update({"exp":expire})
    encoded_jwt=jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return encoded_jwt

def assign_uniqueid_parcel():
    unique_id=str(uuid.uuid4())
    return unique_id

@router.post("/login")
async def login_for_access_token(request: Request, type: str, user: LoginModel=Body(...)):
    user = jsonable_encoder(user)
    user=await authenticate_user(request, type, user['username'],user['password'])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate":"Bearer"},
        )
    access_token_expires=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token=create_access_token(
        data={"sub":user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token":access_token,"token_type":"bearer"}

# for adding authorization: token: str = Depends(oauth2_scheme)
@router.get("/", response_description="List all tasks")
async def list_tasks(request: Request, token: str = Depends(oauth2_scheme)):
    drivers = []
    cursor = request.app.mongodb["drivers"].find()

    async for document in cursor:
        drivers.append(Driver(**document))
        
    return drivers
    
#  Works fine
@router.get("/checkUsername/")
async def check_username(username: str, type: str, request: Request):
    response = await request.app.mongodb[type].find_one({'username': username},{'_id':0})
    if response:
        return {"result":"true"}

    return {"result": "false"}


@router.post("/editdetails")
async def modifyDetails(request: Request, type: str, token: str=Depends(oauth2_scheme), data: Signup=Body(...)):
    user= await get_current_user(request, type, token)
    data = jsonable_encoder(data)
    filter = { 'username': user["username"]}
    newvalues={"$set": data}
    result=await request.app.mongodb[type].update_one(filter,newvalues)
    return "true"

@router.post("/editlicense")
async def modifyLicense(request: Request, type: str, token: str=Depends(oauth2_scheme), data: License=Body(...)):
    user= await get_current_user(request, type, token)
    data = jsonable_encoder(data)
    filter = { 'username': user["username"]}
    newvalues={"$set": data}
    result=await request.app.mongodb[type].update_one(filter,newvalues)
    return "true"

@router.post("/editaddress")
async def modifyAddress(request: Request, type: str, token: str=Depends(oauth2_scheme), data: Address=Body(...)):
    user= await get_current_user(request, type, token)
    data = jsonable_encoder(data)
    filter = { 'username': user["username"]}
    newvalues={"$set": data}
    result=await request.app.mongodb[type].update_one(filter,newvalues)
    return "true"

@router.post("/editpayment")
async def modifyPayment(request: Request, type: str, token: str=Depends(oauth2_scheme), data: Payment=Body(...)):
    user= await get_current_user(request, type, token)
    data = jsonable_encoder(data)
    filter = { 'username': user["username"]}
    newvalues={"$set": data}
    result=await request.app.mongodb[type].update_one(filter,newvalues)
    return "true"

@router.post("/editvehicle")
async def modifyVehicle(request: Request, type: str, token: str=Depends(oauth2_scheme), data: Vehicle=Body(...)):
    user= await get_current_user(request, type, token)
    data = jsonable_encoder(data)
    filter = { 'username': user["username"]}
    newvalues={"$set": data}
    result=await request.app.mongodb[type].update_one(filter,newvalues)
    return "true"

# Works fine
@router.post("/signup")
async def singup(request: Request, type: str, user: Signup=Body(...)):
    user = jsonable_encoder(user)
    user['password']=get_password_hash(user['password'])
    new_user = await request.app.mongodb[type].insert_one(user)

    access_token_expires=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token=create_access_token(
        data={"sub":user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token":access_token,"token_type":"bearer"}

# Works fine
@router.post("/add_new_shipper")
async def addShipper(request: Request, shipper_form: Shipper=Body(...)):
    user = jsonable_encoder(shipper_form)
    shippers = []
    cursor = request.app.mongodb["shippers"].find()

    async for document in cursor:
        shippers.append(Shipper(**document))

    for shipper in shippers:
        if shipper.username != shipper_form.username:
            return {"Error": "Username already exists, try another username"}

    user['password']=get_password_hash(user['password'])
    new_user = await request.app.mongodb["shippers"].insert_one(user)
    access_token_expires=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token=create_access_token(
        data={"sub":user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token":access_token,"token_type":"bearer"}

@router.post("/create_shipping_request")
async def shippingRequest(request: Request, token: str=Depends(oauth2_scheme), parcel_form: Parcel=Body(...)):
    user= await get_current_user(request, "shippers", token)
    parcel = jsonable_encoder(parcel_form)
    parcel['shipper_username'] = user['username']
    parcel['parcelid']=assign_uniqueid_parcel()
    parcel['createdAt'] = datetime.now()
    parcel['updatedAt'] = datetime.now()
    parcel['status'] = 'pending'
    new_parcel = await request.app.mongodb["parcels"].insert_one(parcel)
    return {"message":"creating a shipping request"}

@router.get("/available_parcels")
async def availableParcels(request: Request, type: str, status: str, token: str=Depends(oauth2_scheme)):
    user = await get_current_user(request, type, token)

    parcels=[]
    if type == 'shippers':
        filter = {"shipper_username": user['username'], 'status': status}

    if type == 'consignees':
        filter = {'consignee': user['username'], 'status': status}

    if type == 'drivers':
        if status == 'pending':
            filter = {'status': status}
        else :
            filter = {'driver_username': user['username'], 'status': status}
    cursor = request.app.mongodb["parcels"].find(filter).sort("updatedAt", -1)
    async for document in cursor:
            parcels.append(Parcel(**document))
    if cursor:
        return parcels

    return {"result": "false"}

@router.post("/accept_order")
async def confirmShipment(request: Request, id: str, token: str=Depends(oauth2_scheme)):
    driver = await get_current_user(request, "drivers", token)
    filter = { 'parcelid': id}
    status_value={"$set": {"status":"assigned"}}
    driver_value={"$set": {"driver_username":driver['username']}}
    update_date={"$set": {"updatedAt":datetime.now()}}

    status_assign=await request.app.mongodb["parcels"].update_one(filter,status_value)
    driver_assign=await request.app.mongodb["parcels"].update_one(filter,driver_value)
    update_data_assign = await request.app.mongodb["parcels"].update_one(filter,update_date)

    return {"message": "assigned"}

@router.post("/update_order_status")
async def confirmShipment(request: Request, id: str, status: str, token: str=Depends(oauth2_scheme)):
    driver = await get_current_user(request, "drivers", token)
    filter = { 'parcelid': id}
    status_value={"$set": {"status": status}}

    status_assign=await request.app.mongodb["parcels"].update_one(filter,status_value)

    return {"message": status}

@router.get("/find_consignee")
async def findConsignee(request: Request, username: str):
    response = await request.app.mongodb["consignees"].find_one({'username': username},{'_id':0}).pretty()
    if response:
        return "true"
    else:
        return "false"