from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import api_functions

current_list:list[str]=[]

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get('/unique_code_generate')
def unique_code_gen()->dict:
    """
    Creates the unique code which is not in use at present

    Returns:
        dict: json response for get request
    """
    unique_code:str=api_functions.GenerateRandomCode(current_list)
    return {'unique_code':unique_code}
