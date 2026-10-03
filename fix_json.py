import json

with open("content/site.json", "r") as f:
    data = json.load(f)

# Update Testimonial
data["testimonial"] = {
    "quote": "Tiwaloluwa brings a rare combination of strategic thinking and hands-on execution. She takes ownership, coordinates people effectively, and consistently finds practical ways to move the business forward.",
    "name": "Dr Tolulope Okedere",
    "role": "Chief Executive Officer, FoodMartex"
}

# Update Expertise (Strategy skills)
data["expertise"][0]["skills"] = [
    "Product Strategy",
    "Product Roadmapping",
    "Agile",
    "Sprint Planning",
    "Product Requirements (PRD)",
    "User Stories & Acceptance Criteria",
    "Product Lifecycle Management"
]
data["expertise"][0]["title"] = "Product Strategy"

with open("content/site.json", "w") as f:
    json.dump(data, f, indent=2)
