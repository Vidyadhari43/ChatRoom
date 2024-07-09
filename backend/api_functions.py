import string
import secrets

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