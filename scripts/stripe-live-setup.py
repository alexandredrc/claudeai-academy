# -*- coding: utf-8 -*-
"""Bascule Stripe LIVE : crée produits, prices et webhook de prod.

Usage : python scripts/stripe-live-setup.py
Lit STRIPE_SECRET_KEY_LIVE dans .env.local ; n'affiche JAMAIS de secret
(le whsec du webhook est append dans .env.local).
Idempotent best-effort : réutilise les produits/prices/webhook existants
s'ils correspondent (même nom / même URL).
"""
import json
import urllib.request
import urllib.parse
import base64
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ENV_PATH = ".env.local"
WEBHOOK_URL = "https://www.claudeai-academy.com/api/stripe/webhook"


def env_value(name):
    with open(ENV_PATH, encoding="utf-8") as f:
        for line in f:
            if line.startswith(name + "="):
                return line.split("=", 1)[1].strip().strip('"')
    return None


KEY = env_value("STRIPE_SECRET_KEY_LIVE")
if not KEY or not KEY.startswith("sk_live_"):
    sys.exit("STRIPE_SECRET_KEY_LIVE absente ou pas une clé live")

AUTH = base64.b64encode((KEY + ":").encode()).decode()


def stripe(method, path, params=None):
    url = "https://api.stripe.com/v1/" + path
    data = urllib.parse.urlencode(params).encode("utf-8") if params else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", "Basic " + AUTH)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        body = json.load(e)
        raise SystemExit(f"Stripe {path} -> {e.code}: {body['error']['message']}")


def ensure_product(name, description):
    existing = stripe("GET", "products?limit=100&active=true")
    for p in existing["data"]:
        if p["name"] == name:
            print(f"produit existant réutilisé : {name} = {p['id']}")
            return p["id"]
    p = stripe("POST", "products", {"name": name, "description": description})
    print(f"produit créé : {name} = {p['id']}")
    return p["id"]


def ensure_price(product_id, amount, nickname):
    existing = stripe("GET", f"prices?product={product_id}&active=true&limit=100")
    for pr in existing["data"]:
        if pr["unit_amount"] == amount and pr["currency"] == "eur" and pr["type"] == "one_time":
            print(f"price existant réutilisé : {nickname} = {pr['id']}")
            return pr["id"]
    pr = stripe("POST", "prices", {
        "product": product_id,
        "unit_amount": str(amount),
        "currency": "eur",
        "nickname": nickname,
    })
    print(f"price créé : {nickname} = {pr['id']}")
    return pr["id"]


starter_product = ensure_product(
    "Pass Starter",
    "Les 2 parcours fondamentaux ClaudeAI Academy : Prompt Engineering pro et Claude Code. Accès à vie.",
)
mastery_product = ensure_product(
    "Pass Mastery",
    "Intégrale ClaudeAI Academy : 7 parcours, 40 leçons, 170 prompts, Mentor IA, mises à jour à vie.",
)
starter_price = ensure_price(starter_product, 4700, "Pass Starter 47 EUR")
mastery_price = ensure_price(mastery_product, 49700, "Pass Mastery 497 EUR")

# Webhook : réutilise si l'URL existe déjà (mais alors le whsec n'est pas
# récupérable -> on le signale), sinon créé (le whsec n'est retourné qu'à la création).
hooks = stripe("GET", "webhook_endpoints?limit=100")
hook = next((h for h in hooks["data"] if h["url"] == WEBHOOK_URL), None)
whsec = None
if hook:
    print(f"webhook live déjà existant : {hook['id']} (whsec non récupérable via API)")
else:
    hook = stripe("POST", "webhook_endpoints", {
        "url": WEBHOOK_URL,
        "enabled_events[0]": "checkout.session.completed",
        "enabled_events[1]": "charge.refunded",
        "description": "Prod claudeai-academy.com (live)",
    })
    whsec = hook["secret"]
    print(f"webhook live créé : {hook['id']} -> {WEBHOOK_URL}")

with open(ENV_PATH, "a", encoding="utf-8") as f:
    f.write("\n# Stripe LIVE (bascule 2026-06-13)\n")
    f.write(f"STRIPE_PRICE_STARTER_LIVE={starter_price}\n")
    f.write(f"STRIPE_PRICE_MASTERY_LIVE={mastery_price}\n")
    if whsec:
        f.write(f"STRIPE_WEBHOOK_SECRET_LIVE={whsec}\n")

print("---")
print(f"STRIPE_PRICE_STARTER_LIVE={starter_price}")
print(f"STRIPE_PRICE_MASTERY_LIVE={mastery_price}")
print("whsec :", "écrit dans .env.local" if whsec else "NON (webhook préexistant)")
