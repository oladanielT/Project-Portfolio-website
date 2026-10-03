import json

with open("content/site.json", "r") as f:
    data = json.load(f)

data["expertise"][0]["skills"] = [
    "Product Strategy",
    "Product Roadmapping",
    "Agile",
    "Sprint Planning",
    "Product Requirements (PRD)",
    "User Stories & Acceptance Criteria",
    "Product Lifecycle Management",
    "Jira",
    "Trello",
    "Figma",
    "Google Workspace",
    "Slack",
    "Notion",
    "Google Analytics",
    "GitHub",
    "ChatGPT"
]

with open("content/site.json", "w") as f:
    json.dump(data, f, indent=2)

