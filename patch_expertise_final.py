import json

with open("content/site.json", "r") as f:
    data = json.load(f)

# Put ONLY the 7 items the user requested in Block 1
data["expertise"][0]["skills"] = [
    "Product Strategy",
    "Product Roadmapping",
    "Product Lifecycle Management",
    "Agile",
    "Sprint planning",
    "Product Requirements Document (PRD)",
    "User Stories & Acceptance Criteria"
]

with open("content/site.json", "w") as f:
    json.dump(data, f, indent=2)

