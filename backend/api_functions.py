import string
import secrets
from fastapi import WebSocket
# from pymongo import MongoClient

# mongodb connection
# mongo_client:MongoClient=MongoClient("localhost",27017)
# db=mongo_client.chatroom # type: ignore
# collection=db.username

# def UsernameExists(username:str)->bool:
#     """
#     Checks whether the username exists or not

#     Args:
#         username (str): username of user

#     Returns:
#         bool: returns True if username already exist, else False
#     """
#     if collection.find_one({'username':username}):
#         return True
#     else:
#         # collection.insert_one({'username':username})
#         return False

# def InsertUsername(username:str)->bool:
#     """
#     Inserts the username into database

#     Args:
#         username (str): username of user

#     Returns:
#         bool: returns True if insertion of username into database is successful, else False
#     """
#     try:
#         collection.insert_one({'username':username})
#         return True
#     except Exception as e:
#         print(e)
#         return False

def GenerateRandomCode(current_list:list[str])->str:
    """
    This function generates the unique code of 10 characters 

    Args:
        current_list (list[str]): current unique codes that are in use

    Returns:
        str: newly generated code
    """
    alphabet:str=string.ascii_letters+string.digits
    unique_code:str=''
    while True:
        unique_code = ''.join(secrets.choice(alphabet) for i in range(10)) 
        if unique_code not in current_list:
            current_list.append(unique_code)
            break
    return unique_code

#should try by changing it to synchronous and see how they differ

async def broadcast_msg(username:str,data:str,users:dict[str,list[WebSocket]],unique_code:str,action:str)->None:
    """
    Broadcast the message to all the users in the chatroom with same roomcode

    Args:
        username(str): username of the user from whom the message sent
        data (str): message that should be sent
        users (dict[str,list[WebSocket]]): list of all the users in the chatroom with same roomcode
        unique_code (str): roomcode
    """
    data={'sent_username':username,'msg':data,'action':action}
    for socket in users[unique_code]:
        await socket.send_json(data)

async def user_exit(websocket:WebSocket,users:dict[str,list[WebSocket]],unique_code:str,current_list:list[str],username:str)->None:
    """
    User should be removed from the room and left the chat message will be broadcasted

    Args:
        websocket (WebSocket): websocket of the user who left the chat
        users (dict[str,list[WebSocket]]): list of all the users in the chatroom with same roomcode
        unique_code (str): roomcode
        current_list (list[str]): list of current active room codes
        username (str): username of the user who left the chat
    """
    users[unique_code].remove(websocket)
    if len(users[unique_code])>0:
        await broadcast_msg(username,'left the chat',users,unique_code,'left')
    if len(users[unique_code])==0:
        del users[unique_code]
        current_list.remove(unique_code)