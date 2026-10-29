"""Testes do funil consolidado: links da conta Cakto nova, caminho upsell → downsell → acesso,
redirecionamentos dos endereços antigos e ausência de referências pessoais ou da conta antiga."""
import json, pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parents[1]
R = []
def check(n, c, d=""): R.append((n, bool(c), d))
ler = lambda f: (ROOT / f).read_text(encoding="utf-8")
NOVOS = {"principal": "https://payment.ticto.app/O7BD40B46",
         "upsell": "https://pay.cakto.com.br/n9z58zp_1254653",
         "downsell": "https://pay.cakto.com.br/bnqbdwe_1254677"}
ANTIGOS = ["bwrhg86_890124", "g6bjfwk_890333", "b5q6xq2_891945"]
paginas = [p for p in ROOT.rglob("*") if p.suffix in (".html", ".js") and "testes" not in p.parts]
tudo = "\n".join(p.read_text(encoding="utf-8") for p in paginas)
up, down = ler("upsell.html"), ler("downsell.html")
check("Upsell aponta para o checkout novo do upsell", set(re.findall(r'https://pay\.cakto\.com\.br/\w+', up)) == {NOVOS["upsell"]})
check("Downsell aponta para o checkout novo do downsell", set(re.findall(r'https://pay\.cakto\.com\.br/\w+', down)) == {NOVOS["downsell"]})
check("Recusar o upsell leva ao downsell", 'href="/downsell.html"' in up)
check("Recusar o downsell leva à página de acesso", 'href="/acesso.html"' in down)
check("Nenhum link da conta Cakto antiga", not any(a in tudo for a in ANTIGOS))
check("Nenhuma referência pessoal (nome ou e-mail)", not re.search(r"leonardo|maniero|contatoleo", tudo, re.I))
check("Páginas antigas removidas", not any((ROOT / f).exists() for f in ["app.html", "obrigado.html", "oferta-v2.html"]))
v = json.loads(ler("vercel.json"))
red = {r["source"]: r["destination"] for r in v.get("redirects", [])}
check("Redireciona /app.html para o programa", red.get("/app.html") == "/programa/")
check("Redireciona /obrigado.html para a página de acesso", red.get("/obrigado.html") == "/acesso.html")
check("Redireciona /oferta-v2.html para a página principal", red.get("/oferta-v2.html") == "/")
check("Redirecionamentos não são permanentes (reversíveis)", all(r.get("permanent") is False for r in v["redirects"]))
check("Destinos dos redirecionamentos existem", (ROOT / "programa/index.html").exists() and (ROOT / "acesso.html").exists() and (ROOT / "index.html").exists())
noidx = v["headers"][0]["source"]
check("Pós-compra fora dos buscadores; página de vendas indexável", all(x in noidx for x in ["financeiro", "upsell", "downsell", "acesso"]) and "index" not in noidx)
check("Programa fora dos buscadores", any(h["source"].startswith("/programa") for h in v["headers"]))
for n, ok, d in R: print(("PASS " if ok else "FAIL ") + n + (f"  [{d}]" if d and not ok else ""))
print(f"\n{sum(r[1] for r in R)}/{len(R)} testes passaram"); sys.exit(0 if all(r[1] for r in R) else 1)
