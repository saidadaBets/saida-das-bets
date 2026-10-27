"""Página pós-compra da nova versão (acesso.html)."""
import pathlib, threading, http.server, functools, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parents[1]; R = []
def check(n, c, d=""): R.append((n, bool(c), d))
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT)); h.log_message = lambda *a, **k: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
B = f"http://127.0.0.1:{srv.server_address[1]}"
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True)
    ctx.route("**/_vercel/**", lambda r: r.fulfill(status=200, body="")); pg = ctx.new_page(); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(B + "/acesso.html")
    check("Botão principal abre /programa/", pg.get_attribute("#abrir", "href") == "/programa/")
    check("Link de acesso exibido aponta para /programa/", pg.inner_text("#link").endswith("/programa/"))
    pg.click("#copiar"); check("Copiar dá retorno visível", "copiado" in pg.inner_text("#copiar") or "selecionado" in pg.inner_text("#copiar"))
    check("Não depende de parâmetro na URL para informar a Comunidade", "Comunidade" in pg.inner_text("body"))
    check("Aviso educativo + CVV", "não substitui" in pg.inner_text("body") and pg.locator('a[href="tel:188"]').count() == 1)
    check("Sem rolagem horizontal", pg.evaluate("document.documentElement.scrollWidth") <= 390)
    pg.click("#abrir"); pg.wait_for_load_state()
    check("Programa abre a partir do acesso", "/programa/" in pg.url and pg.locator("#data-inicio").count() == 1)
    check("Sem erros de JavaScript", not errs, str(errs)); b.close()
srv.shutdown()
for n, ok, d in R: print(("PASS " if ok else "FAIL ") + n + (f"  [{d}]" if d and not ok else ""))
print(f"\n{sum(r[1] for r in R)}/{len(R)} testes passaram"); sys.exit(0 if all(r[1] for r in R) else 1)
