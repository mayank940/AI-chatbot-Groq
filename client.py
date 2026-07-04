from groq import Groq
from dotenv import load_dotenv
import base64
import os

load_dotenv()

client = Groq()

#remove thinking block from the response
def clean_qwen_response(response: str)-> str:
    if "</think>" in response:
        return response.split("</think>", 1)[1].strip()
    return response.strip()

#for regular query response
def generate_output(query):
    chat_completion = client.chat.completions.create(
        messages = [
            {
                # assigning role to the AI model
                "role" : "system",
                "content" : "you are a helpful assistant that helps user solve their queries"
            },
            {
                # asking the user's query to the LLM
                "role" : "user",
                "content" : query
            }
        ],
        model = "llama-3.3-70b-versatile", 
        temperature = 0.7,
        max_completion_tokens = 1024
    )

    response = chat_completion.choices[0].message.content

    return response

#To get a response by analyzing an image
def analyze_image(image_content , query):

    chat_completion = client.chat.completions.create(
        messages = [
            {
                "role" : "system",
                "content" : "Your task is to analyze the given image and complete user query"
            },
            {
                "role" : "user",
                "content" : [
                    {
                        "type" : "text",
                        "text": query
                    },
                    {
                        "type" : "image_url",
                        "image_url" : {
                            "url" : image_content
                        }
                    }
                ]
            }
        ],
        temperature = 0.7,
        max_completion_tokens = 1024,
        model = "Qwen/Qwen3.6-27B"
    )


    response = chat_completion.choices[0].message.content
    response = clean_qwen_response(response)
    return response
