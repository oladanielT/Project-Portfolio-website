import json

with open("content/site.json", "r") as f:
    data = json.load(f)

# Put ALL 16 inside Block 1 again!
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

# Reset Block 2 and 3 to their default from the template
data["expertise"][1]["skills"] = [
    "Agile & sprint planning",
    "Product requirements (PRD)",
    "User stories & acceptance criteria"
]
data["expertise"][2]["skills"] = [
    "Cross-functional coordination",
    "Content operations",
    "Team collaboration"
]

with open("content/site.json", "w") as f:
    json.dump(data, f, indent=2)

