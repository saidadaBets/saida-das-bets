# Saída das Bets — Entrega 1: produto, oferta e plano técnico
27/10/2026 · Branch `v2-preview` (nada publicado em produção)

## 0. Fatos verificados nesta sessão (base das decisões)
| Fato | Fonte |
|---|---|
| Produto principal vendido **4 vezes** (28/05, 31/05, 01/06, 07/06/2026); order bump **2 vezes**; upsell e downsell **0** | Cakto › Minhas Vendas |
| **1 reembolso** (compra de 31/05, principal + bump, reembolsada em 07/06) — R$ 69,02; **33,3%** de reembolso; chargeback R$ 0 | Cakto |
| Receita líquida acumulada: **R$ 158,04**. Líquido por venda principal: R$ 44,51; bump: R$ 24,51 | Cakto |
| Nenhuma venda desde 07/06; 1 Pix gerado e não pago em 25/06 | Cakto |
| Pós-compra: Cakto redireciona para `upsell.html`; "Erros de envio": nenhum | Cakto › Produto › Upsell |
| Site: **5 visitantes** na última semana | Vercel Analytics |
| Deploy: GitHub `saidadaBets/saida-das-bets` (**público**) → Vercel, plano **Hobby** | GitHub, Vercel |

**Leitura honesta:** com 4 vendas e 1 reembolso não existe base estatística para conversão nem para o motivo dos reembolsos. O que os dados mostram com segurança: houve demanda real quando havia conteúdo sendo publicado (todas as vendas entre 28/05 e 07/06, período de produção diária de conteúdo) e ela parou quando o conteúdo parou. **Hipótese** a validar: a aquisição depende de conteúdo orgânico constante.

## 1. Nova concepção do produto
**De:** 4 textos curtos + checklist de 7 dias + contador que contava módulos.
**Para:** um **programa guiado de 21 dias** que funciona como um app no celular, com ferramentas que a pessoa usa no momento real do problema.

**Jornada do usuário**
1. Compra → abre o link → marca o **Dia 1** (primeiro dia sem apostar).
2. Todo dia: vídeo curto (3–5 min) + ação prática salva no app + missão de 3 tarefas. 10–15 min.
3. A qualquer hora: **"Estou com vontade agora"** (cronômetro de 5 min, respiração, frase pessoal, ligar para alguém, registro) e **"Tive um deslize"** (plano pós-deslize, sem zerar a trajetória).
4. Contador real: dias desde o Dia 1 e desde o último deslize; deslizes não apagam o total.
5. Fim dos 21 dias: compromisso de 30 dias; ferramentas continuam disponíveis.

**Por que é mais útil:** a versão atual dá informação; a nova dá **ferramentas para o momento crítico** (vontade, dinheiro na conta, deslize), **organiza as dívidas com números da própria pessoa** e **mede o progresso de forma honesta**. Os defeitos auditados foram eliminados por construção e cobertos por teste (34/34).

## 2. Estrutura completa do conteúdo
| Fase | Dia | Aula (vídeo) | Ação prática | Ferramenta |
|---|---|---|---|---|
| 1 Fechar as portas | 1 | Encare o número | Raio-X inicial (4 perguntas) | — |
| | 2 | Feche as portas | 8 barreiras | Barreiras |
| | 3 | Seu plano de crise | Sinais, ações, pessoas, frase | Plano de crise |
| 2 Dominar a vontade | 4 | A onda da vontade | Treino do botão | Vontade agora |
| | 5 | Diário da vontade | 1º registro | Diário |
| | 6 | Seus gatilhos | Mapa de gatilhos | — |
| | 7 | Pensamentos-armadilha | Resposta à sua frase-armadilha | — |
| | 8 | O que a aposta te dava | Plano de substituição | — |
| 3 Reconstruir o dinheiro | 9 | Raio-X das dívidas | Cadastro de dívidas | Dívidas |
| | 10 | Orçamento de sobrevivência | Orçamento | Orçamento |
| | 11 | Ordem de ataque | Bola de neve × avalanche | Dívidas |
| | 12 | Negociar sem medo | Roteiro + preparação | — |
| | 13 | Proteja o dinheiro | 4 barreiras financeiras | — |
| | 14 | Meio do caminho | Revisão | — |
| | 15 | Primeira meta | Reserva pequena | — |
| 4 Sustentar | 16 | A conversa com a família | Preparação da conversa | — |
| | 17 | Deslize não é recomeço do zero | Plano pós-deslize | Deslize |
| | 18 | Rotina nova | Rotina de proteção | — |
| | 19 | Quando buscar ajuda profissional | Rede de apoio | Página de apoio |
| | 20 | Seus padrões | Revisão do diário | Diário |
| | 21 | Os próximos 30 dias | Compromisso | Backup |

Os 5 itens prometidos na página atual estão contidos: Choque de Realidade (D1), Controle de Impulso (D4), Gatilhos Emocionais (D6), Kit Antirrecaída (D3 + D17), Checklist diário (missões dos 21 dias).
**Vídeos:** 21 aulas + VSL + demonstração + anúncios. Roteiros do lote 1 (VSL, demo, 3 anúncios, A01–A05) em `ROTEIROS.md`. Enquanto um vídeo não existe, o app mostra a versão em texto — o produto já é utilizável sem os vídeos.

## 3. Nova proposta de oferta
- **Posicionamento:** o programa prático para a vida **depois da proibição** — quando os sites saíram do ar, mas a vontade, as dívidas e os sites irregulares ficaram.
- **Promessa central (sem garantia de resultado):** um plano de 21 dias, no celular, para parar de apostar e colocar o dinheiro em ordem — com ferramentas para a hora em que a vontade aperta.
- **Mecanismo:** 3 movimentos — fechar as portas (barreiras) · atravessar a vontade (regra dos 5 min + plano de crise) · reconstruir o chão financeiro (dívidas, orçamento, negociação) — sustentados por contador honesto e plano pós-deslize.
- **Diferenciais demonstráveis:** botão de vontade; deslize que não zera; organizador de dívidas com ordem de pagamento; tudo no celular, com backup.
- **Objeções tratadas na página:** "as bets foram proibidas", "e se eu recair", "já tentei", "tempo", "privacidade", "é tratamento?", "como recebo".

**Estrutura comercial recomendada** (proposta — **nada alterado**; cada item depende da sua aprovação):
| Etapa | Hoje | Recomendação | Por quê |
|---|---|---|---|
| Principal R$ 47 | 4 textos + checklist | Mesmo preço, entrega v2 | Fecha a distância entre promessa e entrega |
| Order bump R$ 27 | "Comunidade + Desafio 7 Dias" (o desafio já está no principal; grupo com 3 membros) | Opção A: **Kit Família** (guia para o familiar + roteiros de conversa). Opção B: manter a comunidade, **sem** "Desafio 7 Dias" no nome | Evita vender duas vezes o mesmo conteúdo |
| Upsell R$ 67 | Calculadora ×12 + planner de 16 itens | **Reconstrução Financeira 60 dias**: modelos de mensagem por tipo de credor, passo a passo do superendividamento (Lei 14.181/2021), planejamento mês a mês | O principal v2 já cobre o básico; o upsell precisa ir além |
| Downsell R$ 27,90 | "Mesmo conteúdo do plano completo" | Versão reduzida (só o kit de negociação) | "Mesmo conteúdo por 42% do preço" desvaloriza o upsell |

Recomendações sobre escassez, "até 12x" (checkout: 11x com juros) e taxa de R$ 0,99 seguem pendentes da sua decisão (detalhes em `ESTADO-DO-PROJETO.md`).

## 4. Copy
Página completa em `oferta-v2.html` (preview). Preserva literalmente: "⚡ Últimas Vagas", "De R$197 por R$47", "à vista ou em até 12x", "Preço promocional pode acabar a qualquer momento", os dois depoimentos e a garantia — verificado por teste (20/20).
**Variações de headline para teste A/B** (quando houver tráfego suficiente):
- A (padrão): "A proibição fechou os sites. Não fechou a vontade — nem as dívidas."
- B: "Parar de apostar não é questão de força de vontade. É questão de plano."
- C: "21 dias para sair das apostas e colocar as dívidas em ordem — direto no seu celular."
**Critério de teste:** só faz sentido com volume — referência mínima de ~100 cliques no botão de compra por variante antes de decidir. Com o tráfego atual (5 visitantes/semana), a prioridade é tráfego, não teste A/B.

## 5. Plano técnico
| # | Entrega | Arquivos / componentes | Depende de | Validação |
|---|---|---|---|---|
| ✅ A | Programa v2 + oferta v2 + página de apoio | `programa/` (index, conteudo.js, app.js, estilo.css), `oferta-v2.html`, `ajuda.html`, `vercel.json`, `.vercelignore` | — | 34 + 20 + 37 testes |
| B | Preview na Vercel | branch `v2-preview` no GitHub | Push no GitHub (ver seção 7) | URL de preview revisada por você |
| C | Virada para os compradores | `app.html` → redireciona para `/programa/`; `obrigado.html` aponta para `/programa/`; migração automática do progresso antigo (já implementada) | Sua aprovação | Teste de migração (já passa) |
| D | Entrega correta do bump | E-mail de entrega do produto bump na Cakto com o link do Telegram (não depender de `?bump=sim`) | Aprovação + configuração na Cakto | Compra de teste/sandbox |
| E | Controle de acesso | `api/cakto.js` (webhook: valida segredo, idempotente por ID do pedido, grava compra/reembolso) + `api/acesso.js` (valida token) + banco gratuito (Upstash Redis ou Supabase) | Webhook configurado na Cakto; decisão do plano Vercel | Testes com eventos simulados: aprovado libera, reembolso revoga, duplicado ignora |
| F | Métricas | Eventos de funil (visita → clique no checkout → compra → 1º acesso → dia 1 concluído) | E | Painel diário |
| G | Relatório diário | Tarefa agendada lendo o banco de compras + Vercel Analytics | E, F | 7 dias seguidos sem intervenção |

**Privacidade:** o que a pessoa escreve (dívidas, diário, deslizes) é sensível e **fica no aparelho**. Para o servidor iriam apenas eventos anônimos de uso (ex.: "dia 3 concluído"), com aviso claro. Sincronização entre aparelhos, se desejada, deve ser criptografada.

## 6. O que é fato, hipótese e a validar
- **Fato:** defeitos do app atual (teste 2/12); números de venda/reembolso acima; deploy via GitHub → Vercel.
- **Hipótese:** reembolsos ligados à distância entre promessa e entrega (1 caso — não dá para afirmar); vendas dependentes de conteúdo orgânico diário.
- **A validar:** tempo diário de 10–15 min; adesão ao botão de vontade; impacto da v2 no reembolso (comparar com 33,3% após ≥ 10 vendas).

## 7. Limitações desta sessão
- **Push para o GitHub:** a conta GitHub não está vinculada ao Claude, e a extensão do Chrome desconectou durante a sessão. O código está pronto num branch local (`v2-preview`), num pacote enviado no chat e salvo no Projeto.
- **Configurações da Cakto** (canal de entrega, e-mails, webhooks): lidas parcialmente; nada foi alterado.
