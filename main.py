from client import generate_output, analyze_image
from flask import Flask, render_template, request, jsonify, url_for
import base64
import requests
import os

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask_query", methods = ["POST"])
def answer_query():
    query = request.form["query"]
    result =  generate_output(query)
    return jsonify({"response" : result}), 200

@app.route("/analyze_image", methods = ["POST"])
def image_processor():
    image_file = request.files["image_file"]
    image_url = request.form["image_url"]
    query = request.form["query"]

    image_extensions = (".jpeg", ".jpg", ".png", ".webp")

    # if image is uploaded from local device 
    if image_file:
        binary_image = image_file.read()
        b64_image = base64.b64encode(binary_image).decode("utf-8")
        image_content = f"data:{image_file.content_type};base64,{b64_image}"
        response = analyze_image(image_content, query)
    elif image_url and image_url.startswith("http"):
        url_response = requests.head(image_url)
        if url_response.headers.get("Content-Type", "").startswith("image/"):
            response = analyze_image(image_url, query)
        else:
            response = "TypeError: Recieved content is not an image content"
    else:
        response = "TypeError: Recieved content is not an image content"

    return jsonify({"response" : response}), 200

if __name__ == "__main__":
    app.run(
        host = "0.0.0.0",
        port = int(os.environ.get("PORT", 5000)),
        debug = True)
