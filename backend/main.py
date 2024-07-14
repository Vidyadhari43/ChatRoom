from collections import defaultdict
from fastapi import FastAPI, WebSocket,WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

import api_functions

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
    
    if unique_code not in current_list:
        return {'status':'fail','msg':'Invalid Code'}
    
    else:
        return {'status':'success','msg':'Valid Code'}


@app.websocket('/enter_room/{unique_code}/{username}')
async def enter_room(websocket:WebSocket,unique_code:str,username:str)->None:
    try:
        await websocket.accept()
        users[unique_code].append(websocket)
        await api_functions.broadcast_msg(f'{username}: joined the chat',users,unique_code)
        while True:
            data:str = await websocket.receive_text()
            data=username+': '+data
            await api_functions.broadcast_msg(data,users,unique_code)
    except WebSocketDisconnect:
        #remove from the list
        await api_functions.user_exit(websocket,users,unique_code,current_list,username)
    # return {'status':'disconnected'}
    except Exception as e:
        return {'status':e}
    
#should add an end point for leave button.
        


    
    