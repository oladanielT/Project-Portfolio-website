import json

with open('./content/site.json', 'r') as f:
    data = json.load(f)

# ExamPreps360
data['projects'][0]['title'] = "Exampreps360"
data['projects'][0]['org'] = "Mediprep"
data['projects'][0]['role'] = "Product Manager · 10 months"
data['projects'][0]['description'] = "ExamPreps360 is an EdTech platform that helps students prepare for major Nigerian examinations through structured practice questions, detailed explanations, and learning resources. It matters because it makes quality, accessible, and organized exam preparation available digitally, helping students practise smarter and improve their readiness for important exams."
data['projects'][0]['stats'] = [
    "Successfully launched ExamPreps360, taking the product from concept and PRD through development to a live platform.",
    "6 major exam categories supported, including JAMB, WAEC, NECO, Post-UTME, BECE, and NCEE.",
    "Coordinated cross-functional teams and sprint execution, aligning product development with large-scale exam content production."
]
data['projects'][0]['blocks'] = [
    {
        "heading": "01 The challenge",
        "body": "Building the product required coordinating two major workstreams simultaneously: technology development and large-scale academic content production, while ensuring both remained aligned with the product vision and launch objectives."
    },
    {
        "heading": "02 My approach",
        "body": "I approached the challenge by first defining the product vision and translating it into a clear PRD and actionable roadmap. I then assembled and coordinated the development and exam-content teams, prioritized deliverables, organized sprints and regular reviews, and kept both workstreams aligned through testing and iteration until ExamPreps360 was successfully launched."
    },
    {
        "heading": "03 The result",
        "body": "Successfully moved the product from idea to launch, creating a live and growing EdTech platform serving students preparing for WAEC, NECO, JAMB, Post-UTME and other examinations."
    }
]
data['projects'][0]['caseStudyUrl'] = "https://www.exampreps360.online/"

# Food Delivery Application
data['projects'][1]['title'] = "Food Delivery Application"
data['projects'][1]['org'] = "Foodmart Express Nigeria Limited"
data['projects'][1]['role'] = "Product & Operations Lead · 18 months"
data['projects'][1]['description'] = "Food delivery and on-demand logistics were not new concepts. Similar products had already been built and validated in larger Nigerian cities. However, the opportunity we identified was different: Ile-Ife remained largely underserved by this type of technology-enabled delivery service. Residents still faced everyday challenges around convenience and access—getting meals, groceries, market items, medicines, parcels, and other essentials delivered without having to make the trip themselves. While solutions to these problems existed elsewhere, they were not readily accessible within the local market. That presented a clear product opportunity for us: not necessarily to invent a new concept, but to make an existing solution accessible, relevant, and operationally viable for a market that had been overlooked."
data['projects'][1]['stats'] = [
    "3,000+ Users Acquired",
    "5,000+ Deliveries Completed",
    "6 Service Categories Launched"
]
data['projects'][1]['blocks'] = [
    {
        "heading": "01 The challenge",
        "body": "On-demand delivery was already established in larger cities, but Ile-Ife had limited access to reliable technology-enabled delivery services. The opportunity wasn’t to reinvent delivery—it was to make it accessible and practical for an underserved local market."
    },
    {
        "heading": "02 My approach",
        "body": "As COO & Product Manager, I worked across strategy and execution—identifying user pain points, defining product requirements, prioritizing features, managing the roadmap, coordinating cross-functional teams and sprints, gathering feedback, and supporting product launches and iterations. We launched FoodMartex initially as a restaurant delivery platform, learning directly from customers, vendors, and day-to-day operations. These insights shaped our product roadmap and led us to expand into local market shopping, supermarkets, pharmacies, laundry, and parcel delivery."
    },
    {
        "heading": "03 The result",
        "body": "FoodMartex evolved from a food-delivery product into a multi-service local commerce and logistics platform, achieving: 3,000+ Registered Users • 5,000+ Deliveries • 6 Service Categories"
    }
]
data['projects'][1]['caseStudyUrl'] = "https://foodmartex.online/"

# Product Manager
data['projects'][2]['title'] = "Product Manager"
data['projects'][2]['org'] = "Novafoundry Technologies"
data['projects'][2]['role'] = "Team Lead / Project coordinator · 6 months"
data['projects'][2]['description'] = "NovaFoundry was created from a simple observation: great digital products require more than great developers—they require the right people working together. After working across several technology projects, I helped bring together a cross-functional team of engineers, designers, QA, cybersecurity, and product professionals under one structure. This enabled us to manage projects in-house from discovery and planning to design, development, testing, and delivery. My role spans product strategy, client discovery, project scoping, team coordination, sprint execution, stakeholder management, and delivery, ensuring that client ideas are transformed into structured and executable digital products."
data['projects'][2]['stats'] = [
    "6+ Projects Delivered",
    "Multi-Disciplinary Team Design • Web • Mobile • QA • Security",
    "6 Months Active Delivery"
]
data['projects'][2]['blocks'] = [
    {
        "heading": "01 The challenge",
        "body": "After working on several digital projects, I noticed a recurring challenge: delivering a complete product often required sourcing developers, designers, and other specialists separately for each project. This created gaps in communication, coordination, and delivery."
    },
    {
        "heading": "02 My approach",
        "body": "That insight led to NovaFoundry Technologies — bringing complementary technology professionals under one structure to deliver projects collaboratively. We built a cross-functional team comprising frontend and backend engineers, mobile developers, UI/UX and graphic designers, QA professionals, cybersecurity specialists, and other technical talents. Instead of repeatedly outsourcing critical roles, we created an in-house structure capable of taking projects from idea and product planning through design, development, testing, and delivery."
    },
    {
        "heading": "03 The result",
        "body": "Within its first 6 months of active operations, NovaFoundry successfully delivered 6+ website projects for businesses, taking client requirements from initial discussions through planning, design, development, and deployment. The company has also built a growing pipeline of prospective web and mobile application projects, demonstrating its ability to progress from assembling a cross-functional technology team to attracting and delivering real client work."
    }
]
data['projects'][2]['caseStudyUrl'] = "https://www.novafoundry.org/"

with open('./content/site.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Content successfully updated.")
