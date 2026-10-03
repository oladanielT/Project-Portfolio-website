import urllib.request
import json

url = "https://ovpkhhcpifjsbvxlnhwb.supabase.co/rest/v1/portfolio_drafts?id=eq.1"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cGtoaGNwaWZqc2J2eGxuaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDI0MzUyOSwiZXhwIjoyMTA1ODE5NTI5fQ.V7BIYASVsu_iho9TDR9ot92NzjEA_ZTrRsbx3DcCECw",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cGtoaGNwaWZqc2J2eGxuaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDI0MzUyOSwiZXhwIjoyMTA1ODE5NTI5fQ.V7BIYASVsu_iho9TDR9ot92NzjEA_ZTrRsbx3DcCECw",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

with open("./content/site.json", "r") as f:
    content = json.load(f)

payload = json.dumps({ "content": content }).encode("utf-8")

req = urllib.request.Request(url, data=payload, headers=headers, method="PATCH")
try:
    with urllib.request.urlopen(req) as response:
        print("Status Code:", response.getcode())
except Exception as e:
    print("Error:", e)
