from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from .models import Driver, LoginModel, UpdateDriver, Shipper, UpdateShipper, Token, TokenData
from bson import ObjectId
import json
from bson import json_util
from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from typing import Optional
from datetime import datetime, timedelta

SECRET_KEY="dbe1983a11057f959c4b6a04db3fdb28b1a9582ea84ca57a14e905ccd4f1f279"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30


router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/task/token")

pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password,hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user(request, username: str):
    response = await request.app.mongodb["drivers"].find_one({'username': username},{'_id':0})
    return response

async def authenticate_user(request, username: str, password: str):
    user=await get_user(request, username)
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user

# def create_access_token(data: dict, expires_delta: Optional[timedelta]=None):
#     to_encode=data.copy()
#     if expires_delta:
#         expire=datetime.utcnow()+expires_delta
#     else:
#         expire=datetime.utcnow()+timedelta(minutes=15)
#     to_encode.update({"exp":expire})
#     encoded_jwt=jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
#     return encoded_jwt

def parse_json(data):   
    return json.loads(json_util.dumps(data))
    
def fake_hash_password(password: str):
    return "fakehashed" + password


def fake_decode_token(token):
    # This doesn't provide any security at all
    # Check the next version
    user = get_user(token)
    return user
    
    
async def get_current_user(token: str = Depends(oauth2_scheme)):
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
        token_data=TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user=get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: Driver = Depends(get_current_user)):
    if current_user.completed:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def create_access_token(data:dict, expires_delta: Optional[timedelta]=None):
    to_encode=data.copy()
    if expires_delta:
        expire=datetime.utcnow()+expires_delta
    else:
        expire=datetime.utcnow()+timedelta(minutes=15)
    to_encode.update({"exp":expire})
    encoded_jwt=jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login")
async def login_for_access_token(request: Request, user: LoginModel=Body(...)):
    user = jsonable_encoder(user)
    user=await authenticate_user(request,user['username'],user['password'])
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

# # for adding authorization: token: str = Depends(oauth2_scheme)
# @router.get("/{username}", response_description="Get a single task")
# async def get_task(username: str, request: Request):
#     response = await request.app.mongodb["tasks"].find_one({'username': username},{'_id':0})
#     user_name=response['username']
#     user_completed=response['completed']
#     user_id=response['password']
#     if response:
#         return response

#     raise HTTPException(status_code=404, detail=f"Task {user_name} not found")
    
#  Works fine
@router.get("/checkUsername/")
async def check_username(username: str, request: Request):
    response = await request.app.mongodb["drivers"].find_one({'username': username},{'_id':0})
    if response:
        return {"result":"true"}

    return {"result": "false"}

# Works fine
@router.put("/update/driver{username}", description="Update user details")
async def update_user(username: str, request: Request, user: UpdateDriver=Body(...)):
    filter = { 'username': username}
    user = jsonable_encoder(user)
    newvalues={"$set": user}
    result=await request.app.mongodb["drivers"].update_one(filter,newvalues)
    tasks=[]
    cursor=request.app.mongodb["drivers"].find()
    async for document in cursor:
        tasks.append(Driver(**document))

    return tasks[0]

# Works fine
@router.put("/update/shipper{username}", description="Update user details")
async def update_user(username: str, request: Request, user: UpdateShipper=Body(...)):
    filter = { 'username': username}
    user = jsonable_encoder(user)
    newvalues={"$set": user}
    result=await request.app.mongodb["shippers"].update_one(filter,newvalues)
    tasks=[]
    cursor=request.app.mongodb["shippers"].find()
    async for document in cursor:
        tasks.append(Shipper(**document))

    return tasks

# Works fine
@router.post("/add_new_driver")
async def addDriver(request: Request, user: Driver=Body(...)):
    user = jsonable_encoder(user)
    # print(user)
    drivers = []
    cursor = request.app.mongodb["drivers"].find()
    async for document in cursor:
        drivers.append(Driver(**document))

    # for driver in drivers:
    #     if driver['username'] == user['username']:
    #         return {"Error": "Username already exists, try another username"}
    user['password']=get_password_hash(user['password'])
    new_user = await request.app.mongodb["drivers"].insert_one(user)

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