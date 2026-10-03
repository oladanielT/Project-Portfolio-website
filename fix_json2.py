import json

try:
    with open("content/site.json", "r") as f:
        data = json.load(f)
        print("Success")
except Exception as e:
    print("Error:", e)
