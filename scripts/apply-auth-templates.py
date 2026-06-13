"""Applique les templates email auth chartés via Supabase Management API,
champ par champ (PATCH atomiques) avec capture du corps d'erreur, puis verifie."""
import json, os, urllib.request, urllib.error

REF = "rjthvbhdcktiioxpipqy"
TOKEN = os.environ["SB_MGMT_TOKEN"]
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EMAILS = os.path.join(BASE, "marketing", "emails")
URL = f"https://api.supabase.com/v1/projects/{REF}/config/auth"
UA = "curl/8.4.0"  # eviter le blocage Cloudflare 1010 sur l'UA Python-urllib

def html(name):
    with open(os.path.join(EMAILS, name), encoding="utf-8") as f:
        txt = f.read()
    body = txt[txt.find("<!DOCTYPE"):].rstrip()
    assert body.endswith("</html>"), f"{name}: ne finit pas par </html>"
    return body

def patch(field, value):
    data = json.dumps({field: value}).encode("utf-8")  # ensure_ascii=True -> safe
    req = urllib.request.Request(URL, data=data, method="PATCH",
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json", "User-Agent": UA})
    try:
        with urllib.request.urlopen(req) as r:
            print(f"[{r.status}] PATCH {field}")
            return True
    except urllib.error.HTTPError as e:
        print(f"[{e.code}] PATCH {field} -> {e.read().decode('utf-8', 'replace')[:300]}")
        return False

fields = [
    ("mailer_subjects_recovery", "Réinitialise ton mot de passe — ClaudeAI Academy"),
    ("mailer_subjects_email_change", "Confirme ta nouvelle adresse — ClaudeAI Academy"),
    ("mailer_templates_recovery_content", html("reset-password.html")),
    ("mailer_templates_email_change_content", html("change-email.html")),
    ("mailer_templates_confirmation_content", html("confirm-signup.html")),
    ("mailer_templates_magic_link_content", html("magic-link.html")),
]
print("=== PATCH (un champ a la fois) ===")
results = {f: patch(f, v) for f, v in fields}

# Verification finale
req = urllib.request.Request(URL, headers={"Authorization": f"Bearer {TOKEN}", "User-Agent": UA})
with urllib.request.urlopen(req) as r:
    cfg = json.load(r)
print("\n=== VERIFICATION (relecture serveur) ===")
all_ok = True
for f, v in fields:
    ok = cfg.get(f) == v
    all_ok = all_ok and ok
    print(f"[{'OK' if ok else 'FAIL'}] {f}")
print("\nRESULT:", "ALL GOOD" if all_ok else "MISMATCH — voir ci-dessus")
