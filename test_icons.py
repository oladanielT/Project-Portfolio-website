import urllib.request
urls = [
  "https://cdn.simpleicons.org/jira",
  "https://cdn.simpleicons.org/trello",
  "https://cdn.simpleicons.org/figma",
  "https://cdn.simpleicons.org/googleworkspace",
  "https://cdn.simpleicons.org/google",
  "https://cdn.simpleicons.org/slack",
  "https://cdn.simpleicons.org/notion",
  "https://cdn.simpleicons.org/googleanalytics",
  "https://cdn.simpleicons.org/github",
  "https://cdn.simpleicons.org/openai",
  "https://cdn.simpleicons.org/chatgpt"
]
for u in urls:
    try:
        urllib.request.urlopen(u)
        print("OK: " + u)
    except Exception as e:
        print("FAIL: " + u)
