const { readFileSync } = require('fs');
const json = JSON.parse(readFileSync('./content/site.json', 'utf-8'));
if (json.expertise[0].skills.length > 30) {
    console.error("Too many skills");
    process.exit(1);
}
console.log("Parsed JSON:", json.expertise[0].skills);
