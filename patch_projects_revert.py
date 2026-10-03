import json

with open("content/site.json", "r") as f:
    data = json.load(f)

# Revert Exampreps360
p1 = data["projects"][0]
p1["role"] = "Product & operations leadership"
p1["stats"] = [
    "Launched from concept and PRD through development to a live platform",
    "6 major exam categories supported: JAMB, WAEC, NECO, Post-UTME, BECE, NCEE",
    "Coordinated cross-functional teams and sprint execution at scale"
]
p1["description"] = "Led ExamPreps360 from concept to launch — assembling and coordinating cross-functional teams, developing the PRD, managing sprints and product requirements, and overseeing large-scale exam content operations to deliver a live EdTech platform."

# Revert Food Delivery Application
p2 = data["projects"][1]
p2["role"] = "Product & operations"
p2["stats"] = [
    "3,000+ users acquired",
    "5,000+ deliveries completed",
    "6 service categories launched in under a year"
]
p2["description"] = "Helped evolve FoodMartex from a food-delivery product into a broader platform covering restaurants, local market shopping, supermarkets, pharmacies, laundry, and parcel delivery."

# Revert Novafoundry
p3 = data["projects"][2]
p3["role"] = "Product Manager"
p3["stats"] = [
    "6+ projects delivered",
    "Multi-disciplinary team design across web, mobile, QA, security",
    "6 months active delivery"
]
p3["description"] = "After working on several digital projects, I noticed a recurring challenge: delivering a complete product often required sourcing developers, designers, and other specialists separately for each project."

with open("content/site.json", "w") as f:
    json.dump(data, f, indent=2)

