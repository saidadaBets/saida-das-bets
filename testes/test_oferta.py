"""Testes da página de vendas (index.html, versão consolidada do MVP): elementos comerciais protegidos
presentes sem alteração, CTAs para o checkout correto da conta Cakto nova, mobile e acessibilidade básica."""
import pathlib, re, threading, http.server, functools, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parents[1]
R = []
def check(n, c, d=""): R.append((n, bool(c), d))
nova = (ROOT / "index.html").read_text(encoding="utf-8")
idx = nova  # a página antiga foi substituída; os textos protegidos abaixo são a referência fixa
PROTEGIDOS = [
  "⚡ Últimas Vagas",
  '"Estava devendo 8 mil. Segui o passo a passo e hoje faz 3 meses que não aposto. Minha esposa voltou a confiar em mim."',
  "— Marcos, 34 anos",
  '"O checklist diário salvou minha vida. Cada dia sem apostar virou uma vitória. Recomendo demais."',
  "— Ricardo, 27 anos",
  "De R$197 por", '<span class="currency">R$</span>47', "à vista ou em até 12x",
  "⚠️ Preço promocional pode acabar a qualquer momento",
  "<strong>Garantia de 7 dias.</strong> Se o programa não te ajudar, devolvemos 100% do seu dinheiro. Sem perguntas.",
  "Acesso imediato • Garantia de 7 dias", "QUERO SAIR DAS BETS — R$47",
]
for p in PROTEGIDOS:
    check(f"Protegido presente sem alteração: {p[:45]}", p in idx and p in nova)
links = set(re.findall(r'href="(https://pay\.cakto[^"]+)"', nova))
check("Todos os CTAs apontam para o checkout principal da conta nova", links == {"https://pay.cakto.com.br/yutpp9t_1254646"}, str(links))
check("Nenhum outro preço novo inventado", set(re.findall(r"R\$\s?(\d+)", nova)) <= {"197", "47"}, str(set(re.findall(r"R\$\s?(\d+)", nova))))
check("Aviso de que não substitui profissional", "não substitui" in nova)
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT)); handler.log_message = lambda *a, **k: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler); threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True)
    ctx.route("**/_vercel/**", lambda r: r.fulfill(status=200, body="")); ctx.route("https://pay.cakto.com.br/**", lambda r: r.fulfill(status=200, body="ok"))
    pg = ctx.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(f"http://127.0.0.1:{srv.server_address[1]}/index.html")
    check("Sem rolagem horizontal em 390px", pg.evaluate("document.documentElement.scrollWidth") <= 390)
    check("Um único h1", pg.locator("h1").count() == 1)
    check("CTA visível na primeira tela", pg.locator("section .cta").first.bounding_box()["y"] < 844)
    check("Perguntas frequentes abrem", (pg.locator("details").first.click() or True) and pg.locator("details[open]").count() == 1)
    pg.screenshot(path=str(ROOT / "testes" / "pagina-vendas.png"), full_page=True)
    check("Sem erros de JavaScript", not errs, str(errs))
    b.close()
srv.shutdown()
check("Página de vendas indexável (sem noindex)", "noindex" not in nova)
for n, ok, d in R: print(("PASS " if ok else "FAIL ") + n + (f"  [{d}]" if d and not ok else ""))
print(f"\n{sum(r[1] for r in R)}/{len(R)} testes passaram"); sys.exit(0 if all(r[1] for r in R) else 1)

