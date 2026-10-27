"""Testes do programa v2 (/programa/). Uso: python3 testes/test_programa.py
Serve a raiz do repositório localmente e testa no Chromium em viewport de celular."""
import pathlib, threading, http.server, functools, sys, datetime, re
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT))
handler.log_message = lambda *a, **k: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = f"http://127.0.0.1:{srv.server_address[1]}"
R = []
def check(n, c, d=""): R.append((n, bool(c), d))
hoje = datetime.date.today()
iso = lambda d: d.isoformat()

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    ctx.route("**/_vercel/**", lambda r: r.fulfill(status=200, body=""))
    pg = ctx.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
    pg.on("dialog", lambda d: d.accept())
    def ir(h): pg.evaluate(f"location.hash='{h}'"); pg.wait_for_timeout(120)

    # --- Primeira abertura: pede o Dia 1 ---
    pg.goto(BASE + "/programa/")
    pg.evaluate("localStorage.clear()"); pg.reload()
    check("1ª abertura pede a data do Dia 1", pg.locator("#data-inicio").count() == 1)
    pg.fill("#data-inicio", iso(hoje - datetime.timedelta(days=3)))
    pg.click("#confirmar-inicio"); pg.wait_for_timeout(150)
    check("Contador mostra 3 dias reais (Dia 1 há 3 dias)", pg.inner_text("#n-sequencia") == "3" and pg.inner_text("#n-total") == "3",
          f"seq={pg.inner_text('#n-sequencia')} tot={pg.inner_text('#n-total')}")

    # --- Regressão do bug do app antigo: concluir dias não infla o contador ---
    for n in (1, 2, 3, 4):
        ir(f"#dia/{n}"); pg.click("#concluir"); pg.wait_for_timeout(120)
    ir("#inicio")
    check("Concluir 4 dias seguidos NÃO altera o contador de dias", pg.inner_text("#n-sequencia") == "3", pg.inner_text("#n-sequencia"))
    check("Início sugere o próximo dia (Dia 5)", "Dia 5" in pg.inner_text("main"))

    # --- Regressão: marcação persiste ao navegar e recarregar ---
    ir("#dia/5"); cb = pg.locator('[data-check="m5-0"]'); cb.check()
    ir("#ferramentas"); ir("#dia/5")
    check("Missão marcada continua marcada após navegar", pg.locator('[data-check="m5-0"]').is_checked())
    pg.reload(); ir("#dia/5")
    check("Missão marcada continua marcada após recarregar", pg.locator('[data-check="m5-0"]').is_checked())
    pg.locator('[data-check="m5-1"]').check(); ir("#trilha"); ir("#dia/5")
    check("Nova marcação não apaga a anterior", pg.locator('[data-check="m5-0"]').is_checked() and pg.locator('[data-check="m5-1"]').is_checked())

    # --- Respostas de exercícios salvam ---
    ir("#dia/1"); pg.fill("#r-perda_total", "8000"); pg.reload(); ir("#dia/1")
    check("Resposta de exercício persiste após recarregar", pg.input_value("#r-perda_total") == "8000")

    # --- Deslize: zera a sequência, preserva o total ---
    ir("#deslize"); pg.fill("#dz-data", iso(hoje - datetime.timedelta(days=1))); pg.click("#dz-salvar"); pg.wait_for_timeout(150)
    seq, tot = pg.inner_text("#n-sequencia"), pg.inner_text("#n-total")
    check("Deslize ontem → sequência 1 dia", seq == "1", seq)
    check("Deslize ontem → total 2 dias (3 corridos − 1 dia de deslize)", tot == "2", tot)
    check("Texto muda para 'desde o último deslize'", "desde o último deslize" in pg.inner_text("main"))

    # --- Vontade agora: cronômetro + registro no diário ---
    ir("#vontade"); pg.click("#v-iniciar"); pg.wait_for_timeout(1600)
    rel = pg.inner_text("#v-relogio")
    check("Cronômetro de 5 min corre", rel in ("4:59", "4:58"), rel)
    check("Link para CVV 188 na tela de vontade", pg.locator('a[href="tel:188"]').count() >= 1)
    pg.select_option("#d-emocao", "Ansiedade"); pg.fill("#d-int", "7"); pg.click("#v-registrar"); pg.wait_for_timeout(150)
    check("Registro de vontade volta ao Início sem criar deslize", pg.evaluate("JSON.parse(localStorage.sdb_v2).deslizes.length") == 1)
    ir("#ferramenta/diario")
    check("Diário mostra padrão com a emoção registrada", "Ansiedade · 1" in pg.inner_text("main"))

    # --- Dívidas: ordens bola de neve e avalanche ---
    ir("#ferramenta/dividas")
    for credor, saldo, juros in [("Cartão", "3000", "14"), ("Irmão", "500", ""), ("Empréstimo", "1500", "4")]:
        pg.fill("#dv-credor", credor); pg.fill("#dv-saldo", saldo); pg.fill("#dv-juros", juros); pg.click("#dv-add"); pg.wait_for_timeout(80)
    neve = [li.split(" — ")[0] for li in pg.locator("#ordem-neve li").all_inner_texts()]
    aval = [li.split(" — ")[0] for li in pg.locator("#ordem-aval li").all_inner_texts()]
    check("Bola de neve: menor saldo primeiro", neve == ["Irmão", "Empréstimo", "Cartão"], str(neve))
    check("Avalanche: maior juro primeiro, juro desconhecido por último", aval == ["Cartão", "Empréstimo", "Irmão"], str(aval))
    check("Total de dívidas somado", "5.000,00" in pg.inner_text("#dv-total"), pg.inner_text("#dv-total"))

    # --- Orçamento usa parcelas das dívidas e acusa saldo negativo ---
    ir("#ferramenta/orcamento"); pg.fill("#o-renda", "2000"); pg.fill("#o-moradia", "1500"); pg.fill("#o-comida", "800")
    sobra = pg.inner_text("#orc-sobra")
    check("Orçamento calcula sobra negativa", "-" in sobra or "−" in sobra, sobra)
    check("Orçamento negativo orienta negociar, não apostar", "negociação" in pg.inner_text("main"))

    # --- Plano de crise aparece na tela de vontade ---
    ir("#ferramenta/plano-crise"); pg.fill("#p-frase", "Eu não vou recuperar nada apostando"); pg.fill("#pn0", "Ana")
    pg.locator('[data-pessoa="0"][data-campo="tel"]').fill("(19) 99999-0000")
    ir("#vontade")
    check("Frase do plano aparece na hora da vontade", "Eu não vou recuperar nada apostando" in pg.inner_text("main"))
    check("Contato da pessoa vira botão de ligar", pg.locator('a[href="tel:19999990000"]').count() == 1)

    # --- Segurança: texto do usuário não vira HTML ---
    ir("#ferramenta/dividas"); pg.fill("#dv-credor", "<img src=x onerror=window.__xss=1>"); pg.fill("#dv-saldo", "10"); pg.click("#dv-add"); pg.wait_for_timeout(150)
    check("Texto do usuário é escapado (sem injeção de HTML)", pg.evaluate("window.__xss") is None)

    # --- Backup: gerar, limpar, restaurar ---
    codigo = pg.evaluate("window.__SDB_backup.gerar()")
    pg.evaluate("localStorage.clear()"); pg.reload()
    check("Sem dados, volta a pedir o Dia 1", pg.locator("#data-inicio").count() == 1)
    ir("#progresso"); pg.evaluate("window.__SDB_semConfirmacao = true"); pg.fill("#bk-importar", codigo); pg.click("#bk-restaurar"); pg.wait_for_timeout(200)
    st = pg.evaluate("JSON.parse(localStorage.sdb_v2)")
    check("Backup restaura dias, deslizes, diário e dívidas", len(st["diasConcluidos"]) == 4 and len(st["deslizes"]) == 1 and len(st["diario"]) == 1 and len(st["dividas"]) == 4)
    ir("#progresso"); pg.fill("#bk-importar", "lixo"); pg.click("#bk-restaurar"); pg.wait_for_timeout(100)
    check("Código inválido é recusado sem apagar dados", len(pg.evaluate("JSON.parse(localStorage.sdb_v2)")["diasConcluidos"]) == 4)

    # --- Migração do app antigo ---
    pg.evaluate("localStorage.clear(); localStorage.setItem('sb_modules', JSON.stringify(['module1','module2']))"); pg.reload()
    st = pg.evaluate("JSON.parse(localStorage.sdb_v2)")
    check("Migra progresso do app antigo (módulos 1 e 2 → dias 1 e 4)", sorted(st["diasConcluidos"].keys()) == ["1", "4"], str(st["diasConcluidos"].keys()))

    # --- Conteúdo: 21 dias, 4 fases, todos renderizam ---
    pg.evaluate("localStorage.setItem('sdb_v2', JSON.stringify(Object.assign(JSON.parse(localStorage.sdb_v2), {inicio:'%s'})))" % iso(hoje)); pg.reload()
    ok = True
    for n in range(1, 22):
        ir(f"#dia/{n}")
        if not pg.locator("h1").inner_text() or pg.locator(".texto-aula").count() != 1: ok = False
    check("Os 21 dias renderizam título, texto e ação", ok)
    check("21 dias em 4 fases", pg.evaluate("PROGRAMA.dias.length") == 21 and pg.evaluate("PROGRAMA.fases.reduce((s,f)=>s+f.dias.length,0)") == 21)

    # --- Mobile / acessibilidade básica ---
    largura_ok = True
    for h in ["#inicio", "#trilha", "#ferramentas", "#progresso", "#vontade", "#ferramenta/dividas", "#ferramenta/diario", "#dia/12"]:
        ir(h)
        if pg.evaluate("document.documentElement.scrollWidth") > 390: largura_ok = False
    check("Nenhuma tela com rolagem horizontal em 390px", largura_ok)
    vp = pg.get_attribute('meta[name="viewport"]', "content")
    check("Zoom permitido", "user-scalable" not in vp)
    ir("#inicio")
    pequenos = pg.eval_on_selector_all("main .btn", "els => els.filter(e => e.getBoundingClientRect().height < 44).length")
    check("Botões com alvo de toque ≥ 44px", pequenos == 0, str(pequenos))
    sem_rotulo = pg.eval_on_selector_all("main input:not([type=checkbox]), main textarea, main select",
        "els => els.filter(e => !e.labels?.length && !e.getAttribute('aria-label')).length")
    ir("#ferramenta/plano-crise")
    sem_rotulo += pg.eval_on_selector_all("main input:not([type=checkbox]), main textarea, main select",
        "els => els.filter(e => !e.labels?.length && !e.getAttribute('aria-label')).length")
    check("Todo campo tem rótulo acessível", sem_rotulo == 0, str(sem_rotulo))
    ir("#inicio"); pg.screenshot(path=str(ROOT / "testes" / "programa-inicio.png"), full_page=True)
    ir("#vontade"); pg.screenshot(path=str(ROOT / "testes" / "programa-vontade.png"), full_page=False)
    check("Sem erros de JavaScript", not errs, "; ".join(errs[:3]))
    b.close()
srv.shutdown()
for n, ok, d in R:
    print(("PASS " if ok else "FAIL ") + n + (f"  [{d}]" if d and not ok else ""))
print(f"\n{sum(r[1] for r in R)}/{len(R)} testes passaram")
sys.exit(0 if all(r[1] for r in R) else 1)
