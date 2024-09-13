from collections import defaultdict
from fastapi import FastAPI, WebSocket,WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
from fastapi.staticfiles import StaticFiles
    
import backend.api_functions as api_functions

current_list:list[str]=[]
users:dict[str,list[WebSocket]]=defaultdict(list)

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
app.mount("/images", StaticFiles(directory="images"), name="images")

# @app.post('/signup/unique_username/{username}')
# def unique_username(username:str)->dict:
#     """
#     Checks whether the username is unique or not. That is the username previously used by any other user.

#     Args:
#         username (str): Requested username of the user

#     Returns:
#         dict: Returns fail in the status if the username already exist. Else returns success.
#     """
#     if api_functions.UsernameExists(username):
#         return {'status':'fail','msg':'username already exist'}
#     else:
#         return {'status':'success','msg':'unique username'}
 
    
# @app.post('/signup/insert_unique_username/{username}')
# def insert_unique_username(username:str)->dict:
#     """
#     Insert username into database

#     Args:
#         username (str): username of the user

#     Returns:
#         dict: Returns fail as status key value if the insertion into database fails. Else returns success.
#     """
#     if api_functions.InsertUsername(username):
#         return {'status':'success','msg':'username inserted'}
#     else:
#         return {'status':'fail','msg':'username insertion failed'}



# Set up the templates folder
templates = Jinja2Templates(directory="frontend")

# Define the route for the homepage (or the first HTML file)
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

# @app.get("/logo.png", response_class=HTMLResponse)
# async def read_root(request: Request):
#     return templates.TemplateResponse("logo.png", {"request": request})


@app.get('/create_room/unique_code_generate') #should change it to post request. request should send username
def unique_code_gen()->dict:
    """
    Creates the unique code which is not in use at present

    Returns:
        dict: json response for get request
    """
    unique_code:str=api_functions.GenerateRandomCode(current_list)
    print(current_list)
    return {'unique_code':unique_code}

@app.post('/join_room/enter_code/{unique_code}')
def join_room(unique_code:str)->dict:
    """
    Checks whether the roomcode is valid.

     Args:
        unique_code (str): Roomcode of the chatroom that user intended to join.

    Returns:
        dict: Returns fail as status key value if the roomcode is invaild or all the users in the room left. Else returns success.
    """
    if unique_code not in current_list:
        return {'status':'fail','msg':'Invalid Code'}
    
    else:
        return {'status':'success','msg':'Valid Code'}


@app.websocket('/enter_room/{unique_code}/{username}')
async def enter_room(websocket:WebSocket,unique_code:str,username:str)->None:
    """
    Send and display the messages sent by the users joined with same roomcode.

    Args:
        websocket (WebSocket): websocket value from which the request sent to the server.
        unique_code (str): Roomcode of the chatroom.
        username (str): username of the user who joined the room.

    Returns:
        _type_: _description_
    """
    try:
        await websocket.accept()
        users[unique_code].append(websocket)
        await api_functions.broadcast_msg(username,'joined the chat',users,unique_code,'join')
        while True:
            data:str = await websocket.receive_text()
            await api_functions.broadcast_msg(username,data,users,unique_code,'text')
    except WebSocketDisconnect:
        #remove from the list
        await api_functions.user_exit(websocket,users,unique_code,current_list,username)
    # return {'status':'disconnected'}
    except Exception as e:
        return {'status':e}
    
#should add an end point for leave button.
        


    
    