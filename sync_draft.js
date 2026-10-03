const fs = require('fs');

const url = "https://ovpkhhcpifjsbvxlnhwb.supabase.co/rest/v1/portfolio_drafts?id=eq.1";
const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cGtoaGNwaWZqc2J2eGxuaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDI0MzUyOSwiZXhwIjoyMTA1ODE5NTI5fQ.V7BIYASVsu_iho9TDR9ot92NzjEA_ZTrRsbx3DcCECw";

const content = JSON.parse(fs.readFileSync('./content/site.json', 'utf8'));

fetch(url, {
  method: 'PATCH',
  headers: {
    'apikey': apikey,
    'Authorization': `Bearer ${apikey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
  },
  body: JSON.stringify({ content })
})
.then(res => {
  console.log(res.status);
  return res.text();
})
.then(text => console.log(text))
.catch(err => console.error(err));
