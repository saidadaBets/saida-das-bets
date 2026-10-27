/* Saída das Bets — app do programa (v2). Sem dependências externas.
   Estado salvo em localStorage ('sdb_v2'), com backup exportável. Preparado para sincronizar
   com servidor no futuro (função salvar() é o único ponto de escrita). */
(function () {
  "use strict";
  var P = window.PROGRAMA;
  var CHAVE = "sdb_v2";
  var app = document.getElementById("app");

  // ---------- utilidades ----------
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function hojeISO(d) { d = d || new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function diasEntre(a, b) { // datas ISO (AAAA-MM-DD), sem fuso
    var pa = a.split("-").map(Number), pb = b.split("-").map(Number);
    return Math.round((Date.UTC(pb[0], pb[1] - 1, pb[2]) - Date.UTC(pa[0], pa[1] - 1, pa[2])) / 86400000);
  }
  function fmtData(iso) { var p = iso.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }
  function brl(n) { return "R$ " + (Number(n) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function num(v) { if (v === "" || v == null) return null; var n = Number(String(v).replace(/\./g, "").replace(",", ".")); return isFinite(n) ? n : null; }
  function toast(msg) { var t = document.getElementById("toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("on"); }, 1800); }

  // ---------- estado ----------
  function estadoVazio() {
    return { v: 1, criadoEm: hojeISO(), inicio: null, deslizes: [], diasConcluidos: {}, respostas: {}, checks: {},
      plano: { sinais: "", primeiro: "", pessoas: [{ nome: "", tel: "" }, { nome: "", tel: "" }], frase: "" },
      diario: [], dividas: [], orcamento: { renda: "", moradia: "", comida: "", transporte: "", contas: "", outros: "" },
      migrado: false };
  }
  var armazenamentoOk = true;
  function carregar() {
    var e = null;
    try { var raw = localStorage.getItem(CHAVE); if (raw) e = JSON.parse(raw); } catch (err) { armazenamentoOk = false; }
    var base = estadoVazio();
    if (e && typeof e === "object") { for (var k in base) if (!(k in e)) e[k] = base[k]; } else { e = base; }
    if (!e.migrado) migrarV1(e);
    return e;
  }
  function migrarV1(e) { // progresso do app antigo (app.html) no mesmo navegador
    try {
      var mods = JSON.parse(localStorage.getItem("sb_modules") || "[]");
      var mapa = { module1: 1, module2: 4, module3: 6, module4: 3 };
      mods.forEach(function (m) { if (mapa[m] && !e.diasConcluidos[mapa[m]]) e.diasConcluidos[mapa[m]] = hojeISO(); });
      if (mods.length) e.veioDoV1 = true;
    } catch (err) { /* sem dados antigos */ }
    e.migrado = true;
  }
  var E = carregar();
  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(E)); armazenamentoOk = true; }
    catch (err) { armazenamentoOk = false; }
    document.getElementById("aviso-armazenamento").hidden = armazenamentoOk;
  }
  salvar();

  // ---------- métricas ----------
  function ultimoMarco() { // data a partir da qual conta a sequência atual
    var datas = E.deslizes.map(function (d) { return d.data; }).sort();
    return datas.length ? datas[datas.length - 1] : E.inicio;
  }
  function sequenciaAtual() {
    if (!E.inicio) return null;
    var hoje = hojeISO(), marco = ultimoMarco();
    var n = diasEntre(marco, hoje); // o dia do deslize não conta; a sequência recomeça no dia seguinte
    return Math.max(0, n);
  }
  function totalSemApostar() {
    if (!E.inicio) return null;
    var hoje = hojeISO(), corridos = diasEntre(E.inicio, hoje);
    if (corridos < 0) return 0;
    var diasComDeslize = {};
    E.deslizes.forEach(function (d) { if (d.data >= E.inicio && d.data <= hoje) diasComDeslize[d.data] = 1; });
    return Math.max(0, corridos - Object.keys(diasComDeslize).length);
  }
  function concluidos() { return Object.keys(E.diasConcluidos).length; }
  function diaAtual() { for (var i = 1; i <= P.dias.length; i++) if (!E.diasConcluidos[i]) return i; return P.dias.length; }
  function faseDoDia(n) { return P.fases.filter(function (f) { return f.dias.indexOf(n) >= 0; })[0]; }

  // ---------- roteamento ----------
  function rota() {
    var h = (location.hash || "#inicio").slice(1).split("/");
    var nome = h[0] || "inicio", arg = h[1];
    if (!E.inicio && nome !== "comecar" && nome !== "progresso") nome = "comecar";
    var telas = { comecar: telaComecar, inicio: telaInicio, trilha: telaTrilha, dia: telaDia, ferramentas: telaFerramentas,
      ferramenta: telaFerramenta, progresso: telaProgresso, vontade: telaVontade, deslize: telaDeslize };
    (telas[nome] || telaInicio)(arg);
    document.querySelectorAll(".abas a").forEach(function (a) {
      var aba = a.getAttribute("data-aba");
      a.classList.toggle("ativa", aba === nome || (aba === "trilha" && nome === "dia") || (aba === "ferramentas" && nome === "ferramenta"));
    });
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", function () { pararCronometro(); rota(); });

  // ---------- telas ----------
  function telaComecar() {
    app.innerHTML =
      '<span class="etiqueta">Bem-vindo</span><h1>Vamos marcar o seu Dia 1</h1>' +
      '<p class="suave">Seu contador começa no primeiro dia sem apostar. Se você apostou hoje, escolha amanhã. Dá para mudar depois.</p>' +
      '<div class="card"><label for="data-inicio">Meu primeiro dia sem apostar</label>' +
      '<input type="date" id="data-inicio" value="' + hojeISO() + '" max="' + hojeISO(new Date(Date.now() + 7 * 86400000)) + '">' +
      '<button class="btn btn-vermelho" id="confirmar-inicio">Começar meu programa</button></div>' +
      '<div class="card peq suave">Seus dados ficam salvos apenas neste aparelho. Em <a href="#progresso">Progresso</a> você pode fazer backup.' +
      ' Este programa é educativo e não substitui atendimento de profissionais de saúde. Em sofrimento intenso, ligue <a href="tel:188">188 (CVV)</a>.</div>' +
      (E.veioDoV1 ? '<div class="card peq">Encontramos seu progresso da versão anterior e já marcamos os dias correspondentes.</div>' : "");
    document.getElementById("confirmar-inicio").onclick = function () {
      var v = document.getElementById("data-inicio").value;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) { toast("Escolha uma data"); return; }
      E.inicio = v; salvar(); location.hash = "#inicio"; toast("Contador iniciado");
    };
  }

  function blocoContador() {
    var seq = sequenciaAtual(), tot = totalSemApostar(), futuro = E.inicio > hojeISO();
    if (futuro) return '<div class="card destaque"><h2>Seu Dia 1 começa em ' + fmtData(E.inicio) + '</h2><p class="suave">Até lá, prepare as barreiras do Dia 2.</p></div>';
    return '<div class="card destaque"><span class="etiqueta">Seu contador</span><div class="contador">' +
      '<div><div class="num" id="n-sequencia">' + seq + '</div><div class="num-rot">' + (seq === 1 ? "dia" : "dias") + (E.deslizes.length ? " desde o último deslize" : " sem apostar") + '</div></div>' +
      '<div><div class="num" id="n-total">' + tot + '</div><div class="num-rot">dias sem apostar no total</div></div></div>' +
      '<p class="peq suave">Contando desde ' + fmtData(E.inicio) + '. Deslizes não apagam os dias que você já conquistou.</p></div>';
  }

  function telaInicio() {
    var d = diaAtual(), dado = P.dias[d - 1], fase = faseDoDia(d), pct = Math.round(concluidos() / P.dias.length * 100);
    var missaoFeitas = dado.missao.filter(function (_, i) { return E.checks["m" + d + "-" + i]; }).length;
    app.innerHTML = blocoContador() +
      '<a class="btn btn-vermelho" href="#vontade">⚡ Estou com vontade agora</a>' +
      '<div class="linha-btn"><a class="btn btn-borda" href="#deslize">Tive um deslize</a><a class="btn btn-borda" href="#ferramenta/diario">Registrar no diário</a></div>' +
      '<div class="card" style="margin-top:12px"><span class="etiqueta">Fase ' + fase.id + ' · ' + esc(fase.nome) + '</span>' +
      '<h2>Dia ' + d + ': ' + esc(dado.titulo) + '</h2><p class="suave">' + esc(dado.subtitulo) + '</p>' +
      '<div class="barra" aria-label="Progresso do programa"><i style="width:' + pct + '%"></i></div>' +
      '<p class="peq suave">' + concluidos() + ' de ' + P.dias.length + ' dias concluídos · missão de hoje: ' + missaoFeitas + '/' + dado.missao.length + '</p>' +
      '<a class="btn btn-vermelho" href="#dia/' + d + '">' + (E.diasConcluidos[d] ? "Rever o dia " : "Fazer o dia ") + d + '</a></div>' +
      '<div class="card"><h3>Missão de hoje</h3>' + listaChecks(dado.missao, "m" + d + "-") + '</div>';
    ligarChecks();
  }

  function listaChecks(itens, prefixo) {
    return itens.map(function (txt, i) {
      var id = prefixo + i, ok = !!E.checks[id];
      return '<label class="check' + (ok ? " ok" : "") + '"><input type="checkbox" data-check="' + id + '"' + (ok ? " checked" : "") + '><span>' + esc(txt) + '</span></label>';
    }).join("");
  }
  function ligarChecks() {
    app.querySelectorAll("[data-check]").forEach(function (cb) {
      cb.onchange = function () {
        var id = cb.getAttribute("data-check");
        if (cb.checked) E.checks[id] = hojeISO(); else delete E.checks[id];
        cb.closest(".check").classList.toggle("ok", cb.checked);
        salvar(); toast(cb.checked ? "Marcado" : "Desmarcado");
      };
    });
  }

  function telaTrilha() {
    var atual = diaAtual();
    app.innerHTML = '<h1>Sua trilha</h1><p class="suave">21 dias em 4 fases. Um dia por vez — mas você pode voltar a qualquer dia quando precisar.</p>' +
      P.fases.map(function (f) {
        return '<div class="card"><span class="etiqueta">Fase ' + f.id + '</span><h2>' + esc(f.nome) + '</h2><p class="peq suave">' + esc(f.resumo) + '</p><ul class="lista-dias">' +
          f.dias.map(function (n) {
            var d = P.dias[n - 1], feito = !!E.diasConcluidos[n];
            return '<li><a href="#dia/' + n + '"><span class="bolinha' + (feito ? " feito" : n === atual ? " atual" : "") + '">' + (feito ? "✓" : n) + '</span>' +
              '<span><strong>' + esc(d.titulo) + '</strong><br><span class="peq suave">' + esc(d.subtitulo) + '</span></span></a></li>';
          }).join("") + '</ul></div>';
      }).join("");
  }

  function blocoVideo(v) {
    if (v.url) {
      if (/youtube\.com|youtu\.be|vimeo\.com|player\./.test(v.url))
        return '<div class="video"><iframe src="' + esc(v.url) + '" title="Vídeo da aula" allow="fullscreen; picture-in-picture" loading="lazy"></iframe></div>';
      return '<div class="video"><video src="' + esc(v.url) + '" controls playsinline preload="metadata"></video></div>';
    }
    return '<div class="video"><div><strong>Vídeo de ' + esc(v.duracao) + ' em produção</strong><br><span class="peq">Enquanto isso, a versão em texto está logo abaixo.</span></div></div>';
  }

  function blocoAcao(d) {
    var a = d.acao;
    if (a.tipo === "campos") {
      return '<div class="card"><h3>' + esc(a.titulo) + '</h3>' + a.campos.map(function (c) {
        var v = E.respostas[c.id] == null ? "" : E.respostas[c.id];
        var campo = c.tipo === "area"
          ? '<textarea id="r-' + c.id + '" data-resp="' + c.id + '">' + esc(v) + '</textarea>'
          : '<input id="r-' + c.id + '" data-resp="' + c.id + '" type="' + (c.tipo === "numero" ? "number" : "text") + '" inputmode="' + (c.tipo === "numero" ? "decimal" : "text") + '" value="' + esc(v) + '">';
        return '<label for="r-' + c.id + '">' + esc(c.rotulo) + '</label>' + campo;
      }).join("") + '<p class="peq suave" style="margin-top:8px">Salvo automaticamente enquanto você digita.</p></div>';
    }
    if (a.tipo === "checklist") return '<div class="card"><h3>' + esc(a.titulo) + '</h3>' + listaChecks(a.itens, "a" + d.dia + "-") + '</div>';
    if (a.tipo === "ferramenta") {
      var nomes = { barreiras: "Checklist de barreiras", "plano-crise": "Plano de crise", diario: "Diário da vontade", dividas: "Organizador de dívidas", orcamento: "Orçamento de sobrevivência" };
      return '<div class="card"><h3>Ação de hoje: ' + nomes[a.ferramenta] + '</h3><p class="suave">Abra a ferramenta, preencha e volte para concluir o dia.</p>' +
        '<a class="btn btn-borda" href="#ferramenta/' + a.ferramenta + '">Abrir ' + nomes[a.ferramenta].toLowerCase() + '</a></div>';
    }
    return "";
  }
  function ligarRespostas() {
    app.querySelectorAll("[data-resp]").forEach(function (el) {
      el.oninput = function () { E.respostas[el.getAttribute("data-resp")] = el.value; salvar(); };
    });
  }

  function telaDia(arg) {
    var n = Math.min(Math.max(parseInt(arg, 10) || 1, 1), P.dias.length), d = P.dias[n - 1], f = faseDoDia(n), feito = !!E.diasConcluidos[n];
    app.innerHTML = '<a class="voltar" href="#trilha">← Trilha</a><span class="etiqueta" style="display:block">Fase ' + f.id + ' · Dia ' + n + ' de ' + P.dias.length + '</span>' +
      '<h1>' + esc(d.titulo) + '</h1><p class="suave">' + esc(d.subtitulo) + '</p>' + blocoVideo(d.video) +
      '<div class="card texto-aula" style="margin-top:12px">' + d.texto + '</div>' + blocoAcao(d) +
      '<div class="card"><h3>Missão do dia</h3>' + listaChecks(d.missao, "m" + n + "-") + '</div>' +
      '<button class="btn ' + (feito ? "btn-borda" : "btn-verde") + '" id="concluir">' + (feito ? "✓ Dia concluído em " + fmtData(E.diasConcluidos[n]) + " (desfazer)" : "Concluir o dia " + n) + '</button>' +
      '<div class="linha-btn">' + (n > 1 ? '<a class="btn btn-borda" href="#dia/' + (n - 1) + '">← Dia ' + (n - 1) + '</a>' : "<span></span>") +
      (n < P.dias.length ? '<a class="btn btn-borda" href="#dia/' + (n + 1) + '">Dia ' + (n + 1) + ' →</a>' : "<span></span>") + '</div>';
    ligarChecks(); ligarRespostas();
    document.getElementById("concluir").onclick = function () {
      if (E.diasConcluidos[n]) { delete E.diasConcluidos[n]; salvar(); toast("Dia reaberto"); telaDia(n); return; }
      E.diasConcluidos[n] = hojeISO(); salvar(); toast("Dia " + n + " concluído");
      location.hash = n < P.dias.length ? "#inicio" : "#progresso";
    };
  }

  function telaFerramentas() {
    var itens = [["⚡", "vontade-btn", "Estou com vontade", "Cronômetro de 5 min + seu plano"], ["🛡️", "plano-crise", "Plano de crise", "Seu passo a passo pessoal"],
      ["📓", "diario", "Diário da vontade", "Registre e veja seus padrões"], ["🚪", "barreiras", "Barreiras", "Feche o acesso às apostas"],
      ["💳", "dividas", "Dívidas", "Organize e escolha a ordem"], ["🧾", "orcamento", "Orçamento", "Quanto sobra no mês"]];
    app.innerHTML = '<h1>Ferramentas</h1><p class="suave">Use quando precisar, em qualquer dia do programa.</p><div class="grade-ferr">' +
      itens.map(function (i) { return '<a href="' + (i[1] === "vontade-btn" ? "#vontade" : "#ferramenta/" + i[1]) + '"><span aria-hidden="true" style="font-size:24px">' + i[0] + '</span><strong>' + i[2] + '</strong><span class="peq suave">' + i[3] + '</span></a>'; }).join("") +
      '</div><div class="card" style="margin-top:12px"><h3>Apoio imediato</h3><p class="peq suave">CVV 188 (gratuito), SUS 136, CAPS e grupos de apoio.</p><a class="btn btn-borda" href="/ajuda.html">Abrir página de apoio</a></div>';
  }

  function telaFerramenta(nome) {
    var f = { barreiras: ferrBarreiras, "plano-crise": ferrPlano, diario: ferrDiario, dividas: ferrDividas, orcamento: ferrOrcamento }[nome];
    if (!f) { location.hash = "#ferramentas"; return; }
    f();
  }
  function cab(t, s) { return '<a class="voltar" href="#ferramentas">← Ferramentas</a><h1>' + t + '</h1>' + (s ? '<p class="suave">' + s + '</p>' : ""); }

  function ferrBarreiras() {
    var feitos = P.barreiras.filter(function (_, i) { return E.checks["b-" + i]; }).length;
    app.innerHTML = cab("Barreiras", "Cada barreira deixa a aposta mais difícil nos dias ruins.") +
      '<div class="card"><p class="peq suave"><strong id="b-cont">' + feitos + '</strong> de ' + P.barreiras.length + ' feitas</p>' + listaChecks(P.barreiras, "b-") + '</div>';
    ligarChecks();
    app.querySelectorAll("[data-check]").forEach(function (cb) { cb.addEventListener("change", function () {
      document.getElementById("b-cont").textContent = P.barreiras.filter(function (_, i) { return E.checks["b-" + i]; }).length; }); });
  }

  function ferrPlano() {
    var p = E.plano;
    app.innerHTML = cab("Plano de crise", "Preencha com calma, hoje. Na hora da vontade, você só segue.") +
      '<div class="card"><label for="p-sinais">Meus sinais de alerta (como percebo que estou entrando no ciclo)</label><textarea id="p-sinais" data-plano="sinais">' + esc(p.sinais) + '</textarea>' +
      '<label for="p-primeiro">O que eu faço primeiro (3 ações rápidas)</label><textarea id="p-primeiro" data-plano="primeiro">' + esc(p.primeiro) + '</textarea>' +
      '<label for="p-frase">Minha frase para ler na hora</label><input type="text" id="p-frase" data-plano="frase" value="' + esc(p.frase) + '"></div>' +
      '<div class="card"><h3>Com quem eu falo</h3>' + p.pessoas.map(function (pe, i) {
        return '<label for="pn' + i + '">Pessoa ' + (i + 1) + '</label><input type="text" id="pn' + i + '" data-pessoa="' + i + '" data-campo="nome" placeholder="Nome" value="' + esc(pe.nome) + '">' +
          '<input type="tel" style="margin-top:6px" data-pessoa="' + i + '" data-campo="tel" placeholder="Telefone com DDD" aria-label="Telefone da pessoa ' + (i + 1) + '" value="' + esc(pe.tel) + '">';
      }).join("") + '<p class="peq suave" style="margin-top:10px">Se ninguém atender: CVV <a href="tel:188">188</a>, gratuito.</p></div>' +
      '<a class="btn btn-vermelho" href="#vontade">Ver meu plano em ação</a>';
    app.querySelectorAll("[data-plano]").forEach(function (el) { el.oninput = function () { E.plano[el.getAttribute("data-plano")] = el.value; salvar(); }; });
    app.querySelectorAll("[data-pessoa]").forEach(function (el) { el.oninput = function () { E.plano.pessoas[+el.getAttribute("data-pessoa")][el.getAttribute("data-campo")] = el.value; salvar(); }; });
  }

  function formDiario(apostouPadrao) {
    return '<label for="d-emocao">O que você estava sentindo?</label><select id="d-emocao">' + P.emocoes.map(function (e) { return "<option>" + esc(e) + "</option>"; }).join("") + '</select>' +
      '<label for="d-int">Intensidade da vontade: <strong id="d-int-v">5</strong>/10</label><input type="range" id="d-int" min="0" max="10" value="5">' +
      '<label for="d-fiz">O que você fez?</label><input type="text" id="d-fiz" placeholder="Ex.: saí para caminhar, liguei para meu irmão">' +
      '<label class="check" style="border:0"><input type="checkbox" id="d-apostou"' + (apostouPadrao ? " checked" : "") + '><span>Acabei apostando</span></label>';
  }
  function ligarFormDiario() { var r = document.getElementById("d-int"); r.oninput = function () { document.getElementById("d-int-v").textContent = r.value; }; }
  function lerFormDiario(origem) {
    return { ts: new Date().toISOString(), data: hojeISO(), hora: new Date().getHours(), emocao: document.getElementById("d-emocao").value,
      intensidade: +document.getElementById("d-int").value, fiz: document.getElementById("d-fiz").value.trim(), apostou: document.getElementById("d-apostou").checked, origem: origem };
  }
  function padroes() {
    var D = E.diario; if (!D.length) return null;
    var porEmocao = {}, faixas = { "Madrugada (0–6h)": 0, "Manhã (6–12h)": 0, "Tarde (12–18h)": 0, "Noite (18–24h)": 0 }, soma = 0, semApostar = 0;
    D.forEach(function (r) {
      porEmocao[r.emocao] = (porEmocao[r.emocao] || 0) + 1; soma += r.intensidade; if (!r.apostou) semApostar++;
      var k = r.hora < 6 ? "Madrugada (0–6h)" : r.hora < 12 ? "Manhã (6–12h)" : r.hora < 18 ? "Tarde (12–18h)" : "Noite (18–24h)"; faixas[k]++;
    });
    function top(o) { return Object.keys(o).sort(function (a, b) { return o[b] - o[a]; }).filter(function (k) { return o[k] > 0; }); }
    return { total: D.length, emocoes: top(porEmocao).map(function (k) { return [k, porEmocao[k]]; }), faixas: top(faixas).map(function (k) { return [k, faixas[k]]; }),
      media: (soma / D.length).toFixed(1), semApostar: semApostar };
  }
  function ferrDiario() {
    var pd = padroes();
    app.innerHTML = cab("Diário da vontade", "30 segundos por registro. Registrar é estar no controle.") +
      '<div class="card"><h3>Novo registro</h3>' + formDiario(false) + '<button class="btn btn-vermelho" id="d-salvar">Salvar registro</button></div>' +
      '<div class="card"><h3>Seus padrões</h3>' + (pd ?
        '<p><strong>' + pd.total + '</strong> registros · intensidade média <strong>' + pd.media + '</strong> · <strong>' + pd.semApostar + '</strong> vontades atravessadas sem apostar</p>' +
        '<p class="peq suave">Emoções mais frequentes</p>' + pd.emocoes.slice(0, 4).map(function (x) { return '<span class="chip">' + esc(x[0]) + " · " + x[1] + "</span>"; }).join("") +
        '<p class="peq suave" style="margin-top:8px">Horários mais frequentes</p>' + pd.faixas.map(function (x) { return '<span class="chip">' + esc(x[0]) + " · " + x[1] + "</span>"; }).join("")
        : '<p class="suave">Seus padrões aparecem aqui a partir do primeiro registro.</p>') + '</div>' +
      '<div class="card"><h3>Últimos registros</h3>' + (E.diario.length ? '<table class="tabela"><tr><th>Quando</th><th>Emoção</th><th class="direita">0–10</th></tr>' +
        E.diario.slice(-10).reverse().map(function (r) { return '<tr><td>' + fmtData(r.data) + " " + String(r.hora).padStart(2, "0") + 'h' + (r.apostou ? " ⚠️" : "") + '</td><td>' + esc(r.emocao) + '</td><td class="direita">' + r.intensidade + '</td></tr>'; }).join("") + '</table>'
        : '<p class="suave">Nenhum registro ainda.</p>') + '</div>';
    ligarFormDiario();
    document.getElementById("d-salvar").onclick = function () {
      var r = lerFormDiario("diario"); E.diario.push(r);
      if (r.apostou) registrarDeslize(hojeISO(), "Registrado no diário");
      salvar(); toast("Registro salvo"); ferrDiario();
    };
  }

  function totaisDividas() {
    var saldo = 0, minima = 0;
    E.dividas.forEach(function (d) { saldo += num(d.saldo) || 0; minima += num(d.minima) || 0; });
    return { saldo: saldo, minima: minima };
  }
  function ordens() {
    var ds = E.dividas.filter(function (d) { return (num(d.saldo) || 0) > 0; });
    var neve = ds.slice().sort(function (a, b) { return num(a.saldo) - num(b.saldo); });
    var aval = ds.slice().sort(function (a, b) {
      var ja = num(a.juros), jb = num(b.juros);
      if (ja == null && jb == null) return num(a.saldo) - num(b.saldo);
      if (ja == null) return 1; if (jb == null) return -1; return jb - ja;
    });
    return { neve: neve, aval: aval };
  }
  window.__SDB_ordens = ordens; // usado pelos testes
  function ferrDividas() {
    var t = totaisDividas(), o = ordens();
    app.innerHTML = cab("Organizador de dívidas", "Todas na mesa, inclusive com família e amigos. Juro ao mês: veja no app do banco ou no extrato.") +
      '<div class="card"><h3>Adicionar dívida</h3>' +
      '<label for="dv-credor">Com quem?</label><input type="text" id="dv-credor" placeholder="Ex.: Cartão Banco X, irmão">' +
      '<label for="dv-saldo">Quanto falta pagar (R$)</label><input type="number" inputmode="decimal" id="dv-saldo">' +
      '<label for="dv-juros">Juro ao mês (%) — se souber</label><input type="number" inputmode="decimal" id="dv-juros" step="0.01">' +
      '<label for="dv-min">Parcela mínima por mês (R$)</label><input type="number" inputmode="decimal" id="dv-min">' +
      '<button class="btn btn-vermelho" id="dv-add">Adicionar</button></div>' +
      '<div class="card"><h3>Suas dívidas</h3>' + (E.dividas.length ?
        '<table class="tabela"><tr><th>Credor</th><th class="direita">Saldo</th><th class="direita">Juro</th><th></th></tr>' +
        E.dividas.map(function (d, i) { return '<tr><td>' + esc(d.credor) + '</td><td class="direita">' + brl(num(d.saldo)) + '</td><td class="direita">' + (num(d.juros) == null ? "?" : num(d.juros) + "%") + '</td><td class="direita"><button class="btn btn-borda btn-pequeno" data-rem="' + i + '" aria-label="Remover ' + esc(d.credor) + '">✕</button></td></tr>'; }).join("") +
        '</table><p style="margin-top:10px">Total: <strong id="dv-total">' + brl(t.saldo) + '</strong> · Mínimo por mês: <strong>' + brl(t.minima) + '</strong></p>'
        : '<p class="suave">Nenhuma dívida cadastrada.</p>') + '</div>' +
      (o.neve.length > 1 ? '<div class="card"><h3>Ordem de ataque</h3><p class="peq suave"><strong>Bola de neve</strong> (menor saldo primeiro — vitórias rápidas):</p><ol id="ordem-neve">' +
        o.neve.map(function (d) { return "<li>" + esc(d.credor) + " — " + brl(num(d.saldo)) + "</li>"; }).join("") + '</ol>' +
        '<p class="peq suave"><strong>Avalanche</strong> (maior juro primeiro — paga menos juros):</p><ol id="ordem-aval">' +
        o.aval.map(function (d) { return "<li>" + esc(d.credor) + " — " + (num(d.juros) == null ? "juro desconhecido" : num(d.juros) + "% ao mês") + "</li>"; }).join("") + '</ol>' +
        '<p class="peq suave">Pague o mínimo de todas e coloque o que sobrar na primeira da ordem escolhida. Quando ela acabar, a parcela dela vai para a próxima.</p></div>' : "");
    document.getElementById("dv-add").onclick = function () {
      var credor = document.getElementById("dv-credor").value.trim(), saldo = num(document.getElementById("dv-saldo").value);
      if (!credor || saldo == null || saldo <= 0) { toast("Informe credor e saldo"); return; }
      E.dividas.push({ id: Date.now(), credor: credor, saldo: saldo, juros: num(document.getElementById("dv-juros").value), minima: num(document.getElementById("dv-min").value) });
      salvar(); toast("Dívida adicionada"); ferrDividas();
    };
    app.querySelectorAll("[data-rem]").forEach(function (b) { b.onclick = function () { E.dividas.splice(+b.getAttribute("data-rem"), 1); salvar(); ferrDividas(); }; });
  }

  function ferrOrcamento() {
    var o = E.orcamento, campos = [["renda", "Renda do mês (tudo que entra)"], ["moradia", "Moradia (aluguel, financiamento, condomínio)"], ["comida", "Comida"], ["transporte", "Transporte"], ["contas", "Contas básicas (luz, água, internet, celular)"], ["outros", "Outros essenciais (remédios, escola…)"]];
    function calc() {
      var ess = ["moradia", "comida", "transporte", "contas", "outros"].reduce(function (s, k) { return s + (num(o[k]) || 0); }, 0);
      var parcelas = totaisDividas().minima, renda = num(o.renda) || 0, sobra = renda - ess - parcelas;
      return { ess: ess, parcelas: parcelas, sobra: sobra, renda: renda };
    }
    function resumo() {
      var c = calc();
      return '<table class="tabela"><tr><td>Entra</td><td class="direita">' + brl(c.renda) + '</td></tr><tr><td>Essenciais</td><td class="direita">− ' + brl(c.ess) + '</td></tr>' +
        '<tr><td>Parcelas mínimas (das suas dívidas)</td><td class="direita">− ' + brl(c.parcelas) + '</td></tr><tr><th>Sobra no mês</th><th class="direita" id="orc-sobra" style="color:' + (c.sobra < 0 ? "#ff8a8a" : "var(--verde)") + '">' + brl(c.sobra) + '</th></tr></table>' +
        (c.renda ? (c.sobra < 0 ? '<p class="peq" style="margin-top:10px">A conta está negativa. Isso não pede aposta — pede negociação (Dia 12). Leve esse número para a conversa com os credores.</p>'
          : '<p class="peq" style="margin-top:10px">Esse é o valor máximo que pode ir para a reserva e para a dívida nº 1 da sua ordem de ataque.</p>') : "");
    }
    app.innerHTML = cab("Orçamento de sobrevivência", "Valores mensais aproximados. As parcelas mínimas vêm do organizador de dívidas.") +
      '<div class="card">' + campos.map(function (c) { return '<label for="o-' + c[0] + '">' + c[1] + '</label><input type="number" inputmode="decimal" id="o-' + c[0] + '" data-orc="' + c[0] + '" value="' + esc(o[c[0]]) + '">'; }).join("") + '</div>' +
      '<div class="card" id="orc-resumo">' + resumo() + '</div>';
    app.querySelectorAll("[data-orc]").forEach(function (el) { el.oninput = function () { o[el.getAttribute("data-orc")] = el.value; salvar(); document.getElementById("orc-resumo").innerHTML = resumo(); }; });
  }

  // ---------- vontade agora ----------
  var cron = null;
  function pararCronometro() { if (cron) { clearInterval(cron); cron = null; } }
  function telaVontade() {
    var p = E.plano, pessoas = p.pessoas.filter(function (x) { return x.nome || x.tel; });
    app.innerHTML = '<a class="voltar" href="#inicio">← Início</a><h1>Você não precisa decidir nada agora</h1><p class="suave">Só atravesse os próximos 5 minutos. A vontade sobe, chega no pico e desce.</p>' +
      '<div class="card destaque"><div class="relogio" id="v-relogio" aria-live="polite">5:00</div><div class="respira" id="v-respira"></div>' +
      '<button class="btn btn-vermelho" id="v-iniciar">Começar os 5 minutos</button></div>' +
      (p.frase ? '<div class="card"><span class="etiqueta">Sua frase</span><h2>“' + esc(p.frase) + '”</h2></div>' : "") +
      '<div class="card"><h3>Faça agora</h3>' + (p.primeiro ? '<p style="white-space:pre-line">' + esc(p.primeiro) + '</p>' : '<p>1. Levante e saia do cômodo onde está. 2. Beba um copo d’água devagar. 3. Mande mensagem para alguém — sobre qualquer assunto.</p><p class="peq suave">Personalize em <a href="#ferramenta/plano-crise">Plano de crise</a>.</p>') + '</div>' +
      '<div class="card"><h3>Fale com alguém</h3>' + pessoas.map(function (x) { return x.tel ? '<a class="btn btn-borda" href="tel:' + esc(x.tel.replace(/[^\d+]/g, "")) + '">📞 ' + esc(x.nome || x.tel) + '</a>' : '<p>' + esc(x.nome) + '</p>'; }).join("") +
      '<a class="btn btn-borda" href="tel:188">📞 CVV — 188 (gratuito)</a></div>' +
      '<div class="card"><h3>Como foi?</h3>' + formDiario(false) + '<button class="btn btn-verde" id="v-registrar">Registrar e voltar</button></div>';
    ligarFormDiario();
    document.getElementById("v-iniciar").onclick = function () {
      pararCronometro(); var ini = Date.now(), total = 300, btn = this; btn.textContent = "Recomeçar";
      var fases = [[4, "Inspire…"], [4, "Segure…"], [6, "Solte devagar…"]];
      cron = setInterval(function () {
        var s = Math.floor((Date.now() - ini) / 1000), rest = Math.max(0, total - s), t = s % 14, msg = "";
        for (var i = 0; i < fases.length; i++) { if (t < fases[i][0]) { msg = fases[i][1]; break; } t -= fases[i][0]; }
        document.getElementById("v-relogio").textContent = Math.floor(rest / 60) + ":" + String(rest % 60).padStart(2, "0");
        document.getElementById("v-respira").textContent = rest ? msg : "Você atravessou 5 minutos. Como está a vontade agora?";
        if (!rest) pararCronometro();
      }, 250);
    };
    document.getElementById("v-registrar").onclick = function () {
      var r = lerFormDiario("vontade"); E.diario.push(r);
      if (r.apostou) { registrarDeslize(hojeISO(), "Registrado após vontade"); salvar(); location.hash = "#deslize/registrado"; return; }
      salvar(); pararCronometro(); toast("Registrado. Mais uma vontade atravessada."); location.hash = "#inicio";
    };
  }

  // ---------- deslize ----------
  function registrarDeslize(data, nota) {
    if (!E.deslizes.some(function (d) { return d.data === data; })) E.deslizes.push({ data: data, nota: nota || "" });
  }
  function telaDeslize(arg) {
    var r = E.respostas, jaRegistrado = arg === "registrado";
    var plano = (r.d_parar || r.d_quem || r.d_amanha) ? '<div class="card"><span class="etiqueta">Seu plano pós-deslize</span>' +
      (r.d_parar ? '<p><strong>Para parar agora:</strong> ' + esc(r.d_parar) + '</p>' : "") + (r.d_quem ? '<p><strong>Contar para:</strong> ' + esc(r.d_quem) + '</p>' : "") +
      (r.d_amanha ? '<p><strong>Amanhã de manhã:</strong> ' + esc(r.d_amanha) + '</p>' : "") + '</div>' : "";
    app.innerHTML = '<a class="voltar" href="#inicio">← Início</a><h1>Um deslize não apaga o caminho</h1>' +
      '<p>O perigo agora não é a aposta que aconteceu — é o pensamento “já estraguei tudo, então tanto faz”. Pare aqui. Os dias que você conquistou continuam contando no seu total.</p>' +
      (jaRegistrado ? '<div class="card"><p>✓ Deslize registrado em ' + fmtData(hojeISO()) + '.</p></div>' :
        '<div class="card"><label for="dz-data">Quando foi?</label><input type="date" id="dz-data" value="' + hojeISO() + '" max="' + hojeISO() + '">' +
        '<label for="dz-nota">O que aconteceu antes? (opcional, só para você)</label><textarea id="dz-nota"></textarea>' +
        '<button class="btn btn-vermelho" id="dz-salvar">Registrar e seguir</button></div>') + plano +
      '<div class="card"><h3>Agora</h3><ol><li>Feche o site ou app e apague de novo.</li><li>Conte hoje para sua pessoa de confiança.</li><li>Amanhã, volte para o dia em que você parou no programa.</li></ol>' +
      '<p class="peq suave">Se os deslizes estão se repetindo, isso não diz que você é fraco — diz que você precisa de mais apoio. Veja o <a href="#dia/19">Dia 19</a> ou a <a href="/ajuda.html">página de apoio</a>.</p></div>';
    var b = document.getElementById("dz-salvar");
    if (b) b.onclick = function () {
      var d = document.getElementById("dz-data").value || hojeISO();
      if (E.inicio && d < E.inicio) { toast("Data anterior ao seu Dia 1"); return; }
      registrarDeslize(d, document.getElementById("dz-nota").value.trim()); salvar(); toast("Registrado. Recomeço a partir de amanhã."); location.hash = "#inicio";
    };
  }

  // ---------- progresso e backup ----------
  function codigoBackup() { return btoa(unescape(encodeURIComponent(JSON.stringify(E)))); }
  function lerBackup(txt) {
    var obj = JSON.parse(decodeURIComponent(escape(atob(txt.trim()))));
    if (!obj || obj.v !== 1 || typeof obj.diasConcluidos !== "object") throw new Error("formato");
    return obj;
  }
  window.__SDB_backup = { gerar: codigoBackup, ler: lerBackup };
  function telaProgresso() {
    var pd = padroes();
    app.innerHTML = '<h1>Seu progresso</h1>' + (E.inicio ? blocoContador() : '<div class="card"><a href="#comecar">Marcar meu Dia 1</a></div>') +
      '<div class="card"><h3>Programa</h3><p><strong>' + concluidos() + '</strong> de ' + P.dias.length + ' dias concluídos</p><div class="barra"><i style="width:' + Math.round(concluidos() / P.dias.length * 100) + '%"></i></div>' +
      '<p class="peq suave">' + (pd ? pd.total + " registros no diário · " + pd.semApostar + " vontades atravessadas sem apostar" : "Nenhum registro no diário ainda") +
      ' · ' + E.deslizes.length + (E.deslizes.length === 1 ? " deslize registrado" : " deslizes registrados") + '</p></div>' +
      (E.inicio ? '<div class="card"><h3>Data do Dia 1</h3><label for="pg-inicio">Corrigir a data</label><input type="date" id="pg-inicio" value="' + E.inicio + '"><button class="btn btn-borda" id="pg-salvar-inicio">Salvar data</button></div>' : "") +
      '<div class="card"><h3>Backup do progresso</h3><p class="peq suave">Seu progresso fica salvo neste aparelho. Para trocar de celular ou se precaver, copie o código abaixo e guarde (ex.: envie para seu próprio e-mail). Ele contém suas anotações — não compartilhe com outras pessoas.</p>' +
      '<textarea class="codigo" id="bk-codigo" readonly aria-label="Código de backup">' + codigoBackup() + '</textarea>' +
      '<div class="linha-btn"><button class="btn btn-borda" id="bk-copiar">Copiar código</button><button class="btn btn-borda" id="bk-baixar">Baixar arquivo</button></div>' +
      '<label for="bk-importar">Restaurar a partir de um código</label><textarea class="codigo" id="bk-importar" placeholder="Cole aqui o código de backup"></textarea>' +
      '<button class="btn btn-borda" id="bk-restaurar">Restaurar</button></div>';
    var si = document.getElementById("pg-salvar-inicio");
    if (si) si.onclick = function () { var v = document.getElementById("pg-inicio").value; if (v) { E.inicio = v; salvar(); toast("Data atualizada"); telaProgresso(); } };
    document.getElementById("bk-copiar").onclick = function () {
      var t = document.getElementById("bk-codigo"); t.select();
      (navigator.clipboard ? navigator.clipboard.writeText(t.value) : Promise.reject()).then(function () { toast("Código copiado"); }, function () { document.execCommand && document.execCommand("copy"); toast("Código selecionado"); });
    };
    document.getElementById("bk-baixar").onclick = function () {
      var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(E, null, 1)], { type: "application/json" }));
      a.download = "saida-das-bets-backup-" + hojeISO() + ".json"; document.body.appendChild(a); a.click(); a.remove();
    };
    document.getElementById("bk-restaurar").onclick = function () {
      try { var obj = lerBackup(document.getElementById("bk-importar").value); if (!confirmarRestauracao()) return; E = obj; salvar(); toast("Progresso restaurado"); location.hash = "#inicio"; rota(); }
      catch (e) { toast("Código inválido"); }
    };
  }
  function confirmarRestauracao() { return concluidos() === 0 && !E.diario.length ? true : window.__SDB_semConfirmacao || window.confirm("Substituir o progresso deste aparelho pelo do backup?"); }

  rota();
})();
