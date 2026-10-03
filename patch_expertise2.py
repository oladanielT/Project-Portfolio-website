import json

with open("content/site.json", "r") as f:
    data = json.load(f)

# Block 1
data["expertise"][0]["skills"] = [
    "Product Strategy",
    "Product Roadmapping",
    "Agile",
    "Sprint Planning",
    "Product Requirements (PRD)",
    "User Stories & Acceptance Criteria",
    "Product Lifecycle Management"
]

# Block 2
data["expertise"][1]["skills"] = [
    "Jira",
    "Trello",
    "Figma",
    "GitHub"
]

# Block 3
data["expertise"][2]["skills"] = [
    "Google Workspace",
    "Slack",
    "Notion",
    "Google Analytics",
    "ChatGPT"
]

with open("content/site.json", "w") as f:
    json.dump(data, f, indent=2)

