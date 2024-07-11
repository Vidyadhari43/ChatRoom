import string
import secrets
from fastapi import WebSocket

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

async def broadcast_msg(data:str,users:dict[str,list[WebSocket]],unique_code:str)->None:
    for socket in users[unique_code]:
        await socket.send_text(data)

async def user_exit(websocket,users,unique_code,current_list)->None:
    users[unique_code].remove(websocket)
    if len(users[unique_code])>0:
        await broadcast_msg('user left',users,unique_code)
    if len(users[unique_code])==0:
        del users[unique_code]
        current_list.remove(unique_code)