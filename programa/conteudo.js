/* Saída das Bets — Programa de 21 dias (conteúdo)
   Cada dia = 1 vídeo curto (roteiro em ROTEIROS.md) + versão em texto + 1 ação prática + missão do dia.
   Enquanto o vídeo não existir (url: null), o app mostra a versão em texto.
   Regras editoriais: sem estatísticas sem fonte, sem promessa de cura ou de resultado financeiro,
   sem humilhação. O programa é educativo e não substitui atendimento profissional. */
window.PROGRAMA = {
  versao: 1,
  fases: [
    { id: 1, nome: "Fechar as portas", dias: [1, 2, 3], resumo: "Parar o sangramento: encarar o tamanho real, bloquear o acesso e montar seu plano de crise." },
    { id: 2, nome: "Dominar a vontade", dias: [4, 5, 6, 7, 8], resumo: "Entender como a vontade funciona e ter o que fazer quando ela aparece." },
    { id: 3, nome: "Reconstruir o dinheiro", dias: [9, 10, 11, 12, 13, 14, 15], resumo: "Organizar dívidas, montar um orçamento de sobrevivência e negociar com método." },
    { id: 4, nome: "Sustentar a mudança", dias: [16, 17, 18, 19, 20, 21], resumo: "Família, deslizes, rotina nova e quando buscar ajuda profissional." }
  ],
  dias: [
    {
      dia: 1, titulo: "Encare o número", subtitulo: "Choque de realidade, sem se destruir",
      video: { roteiro: "A01", duracao: "4 min", url: null },
      texto: `<p>Quase todo mundo que aposta sabe, por alto, quanto perdeu. Mas evita fazer a conta. O cérebro foge do número porque dói — e enquanto o número fica vago, a próxima aposta parece pequena.</p>
<p>Hoje você vai fazer a conta. Não para se punir: para ter um ponto de partida real. Ninguém vai ver esses números além de você. Eles ficam salvos só neste aparelho.</p>
<p><strong>Estimativa vale.</strong> Se não lembrar exatamente, chute para cima. O objetivo é tirar o problema da névoa.</p>`,
      acao: { tipo: "campos", titulo: "Seu raio-X inicial", campos: [
        { id: "perda_total", rotulo: "Quanto você estima ter perdido no total (R$)?", tipo: "numero" },
        { id: "periodo", rotulo: "Em quanto tempo? (ex.: 8 meses)", tipo: "texto" },
        { id: "perda_mes", rotulo: "Em média, quanto ia para apostas por mês (R$)?", tipo: "numero" },
        { id: "o_que_pagaria", rotulo: "O que esse dinheiro pagaria hoje? Seja concreto.", tipo: "area" }
      ] },
      missao: ["Preencher o raio-X inicial", "Escrever o número total num papel e guardar com você", "Definir a data do seu Dia 1 sem apostar (tela Início)"]
    },
    {
      dia: 2, titulo: "Feche as portas", subtitulo: "Tire o acesso do caminho antes de precisar de força de vontade",
      video: { roteiro: "A02", duracao: "4 min", url: null },
      texto: `<p>Força de vontade acaba. Barreira não. Quem sai das apostas não é quem resiste melhor — é quem deixa a aposta mais difícil de fazer.</p>
<p>Desde 6/10/2026 as apostas de quota fixa estão proibidas no Brasil (MP 1.394/2026). Isso não fecha todas as portas: sites irregulares continuam aparecendo em anúncios, grupos e mensagens. Um site que ainda aceita aposta hoje opera sem fiscalização e sem garantia de devolver o seu dinheiro.</p>
<p>Cada item abaixo leva poucos minutos. Marque o que fizer; o que não se aplicar a você, marque também.</p>`,
      acao: { tipo: "ferramenta", ferramenta: "barreiras" },
      missao: ["Concluir pelo menos 5 barreiras", "Sair de todo grupo de 'sinais', 'dicas' ou 'green'", "Contar a uma pessoa de confiança que você está fechando as portas"]
    },
    {
      dia: 3, titulo: "Seu plano de crise", subtitulo: "O que fazer nos 10 minutos mais perigosos",
      video: { roteiro: "A03", duracao: "5 min", url: null },
      texto: `<p>A vontade forte não avisa. Ela chega numa noite ruim, depois de uma briga, quando cai um dinheiro na conta. Nessa hora ninguém pensa bem — por isso o plano precisa estar pronto antes.</p>
<p>Seu plano de crise tem 4 partes: <strong>sinais de alerta</strong> (como você percebe que está entrando no ciclo), <strong>o que fazer primeiro</strong>, <strong>com quem falar</strong> e <strong>uma frase sua</strong> para ler na hora.</p>
<p>Depois de pronto, ele fica a um toque no botão <strong>“Estou com vontade agora”</strong>.</p>`,
      acao: { tipo: "ferramenta", ferramenta: "plano-crise" },
      missao: ["Montar o plano de crise", "Tirar um print do plano e deixar como favorito no celular", "Avisar a pessoa de confiança que ela está no seu plano"]
    },
    {
      dia: 4, titulo: "A onda da vontade", subtitulo: "Controle de impulso: você não precisa vencer, só atravessar",
      video: { roteiro: "A04", duracao: "4 min", url: null },
      texto: `<p>A vontade de apostar funciona como uma onda: sobe, chega no pico e desce. Ela parece que vai durar para sempre — não dura. O erro é tentar brigar com ela de frente.</p>
<p><strong>Regra dos 5 minutos:</strong> quando a vontade vier, você não decide nada. Só adia por 5 minutos e, nesse tempo, faz uma coisa do seu plano de crise. Depois, olha de novo para a vontade. Na maioria das vezes, ela já está menor. Se não estiver, mais 5 minutos.</p>
<p>O botão <strong>“Estou com vontade agora”</strong> faz isso por você: abre um cronômetro, mostra seu plano e, no fim, pede para você registrar como foi.</p>`,
      acao: { tipo: "checklist", titulo: "Treino de hoje", itens: ["Abrir o botão “Estou com vontade agora” uma vez, mesmo sem vontade, para conhecer", "Escolher 3 ações rápidas que funcionam para você (sair do cômodo, dar uma volta no quarteirão, ligar para alguém…)", "Escrever essas 3 ações no seu plano de crise"] },
      missao: ["Fazer o treino do botão", "Usar a regra dos 5 minutos se a vontade aparecer", "Registrar no diário qualquer vontade do dia"]
    },
    {
      dia: 5, titulo: "Diário da vontade", subtitulo: "30 segundos por registro que mostram o seu padrão",
      video: { roteiro: "A05", duracao: "3 min", url: null },
      texto: `<p>Você não controla o que não enxerga. A partir de hoje, toda vez que sentir vontade de apostar, registre: <strong>quando</strong>, <strong>o que estava sentindo</strong>, <strong>a intensidade</strong> (0 a 10) e <strong>o que fez</strong>.</p>
<p>Leva 30 segundos. Depois de alguns registros, o app mostra seus horários e emoções mais comuns — e o seu plano passa a ser feito sob medida para o seu padrão, não para um padrão genérico.</p>
<p>Registrar uma vontade não é fracasso. É exatamente o contrário: é você no controle.</p>`,
      acao: { tipo: "ferramenta", ferramenta: "diario" },
      missao: ["Fazer o primeiro registro no diário (pode ser uma vontade de ontem)", "Deixar o app na tela inicial do celular", "Registrar toda vontade que aparecer hoje"]
    },
    {
      dia: 6, titulo: "Seus gatilhos", subtitulo: "O que acontece antes da vontade",
      video: { roteiro: "A06", duracao: "4 min", url: null },
      texto: `<p>Gatilho é o que vem antes da vontade. Os mais comuns entre apostadores são: <strong>tédio</strong> (aposta como passatempo), <strong>ansiedade e estresse</strong> (aposta como fuga), <strong>dinheiro na mão</strong> (salário, Pix, pagamento), <strong>“dia de sorte”</strong> (euforia, jogo na TV) e <strong>desespero</strong> (apostar para recuperar).</p>
<p>Cada gatilho pede uma resposta diferente. Tédio pede ocupação. Ansiedade pede alívio de outro jeito. Dinheiro na mão pede barreira. Desespero pede um plano financeiro — que vem na Fase 3.</p>`,
      acao: { tipo: "campos", titulo: "Seu mapa de gatilhos", campos: [
        { id: "g_situacao", rotulo: "Em que situação você mais apostava? (hora, lugar, companhia)", tipo: "area" },
        { id: "g_emocao", rotulo: "Que emoção vinha antes da vontade?", tipo: "texto" },
        { id: "g_dinheiro", rotulo: "Em que dias o dinheiro cai na sua conta?", tipo: "texto" },
        { id: "g_resposta", rotulo: "Para o seu gatilho principal, o que você vai fazer no lugar?", tipo: "area" }
      ] },
      missao: ["Preencher o mapa de gatilhos", "Comparar o mapa com o seu diário", "Planejar o próximo dia de pagamento (onde o dinheiro vai ficar)"]
    },
    {
      dia: 7, titulo: "Pensamentos-armadilha", subtitulo: "As frases que o cérebro usa para te puxar de volta",
      video: { roteiro: "A07", duracao: "5 min", url: null },
      texto: `<p>Algumas frases aparecem na cabeça de quase todo apostador. Reconhecer a frase na hora em que ela aparece tira metade da força dela:</p>
<ul><li><strong>“Só preciso recuperar o que perdi.”</strong> — É a armadilha mais cara. Apostar para recuperar costuma aumentar a perda.</li>
<li><strong>“Foi quase.”</strong> — O quase não é sinal de que você está perto. Cada aposta é independente da anterior.</li>
<li><strong>“Eu entendo desse jogo.”</strong> — Entender de futebol não muda a matemática da casa.</li>
<li><strong>“Só uma, pequena.”</strong> — Para quem está saindo, a primeira aposta é o que reabre o ciclo.</li>
<li><strong>“Já perdi tanto, mais um pouco não faz diferença.”</strong> — Faz. Cada real que você não aposta hoje é um real a menos de dívida.</li></ul>`,
      acao: { tipo: "campos", titulo: "Responda à sua frase", campos: [
        { id: "a_frase", rotulo: "Qual dessas frases (ou outra) mais aparece para você?", tipo: "texto" },
        { id: "a_resposta", rotulo: "Escreva a resposta que você vai dar a ela da próxima vez", tipo: "area" }
      ] },
      missao: ["Escrever sua frase e sua resposta", "Colocar a resposta no plano de crise", "Perceber a frase pelo menos uma vez hoje"]
    },
    {
      dia: 8, titulo: "O que a aposta te dava", subtitulo: "Trocar a função, não só cortar o hábito",
      video: { roteiro: "A08", duracao: "4 min", url: null },
      texto: `<p>A aposta ocupava um lugar na sua vida: emoção, fuga, assunto com os amigos, sensação de que algo podia mudar de repente. Se você só tira a aposta e deixa o buraco vazio, a vontade volta para ocupar o espaço.</p>
<p>Hoje você vai escolher o que entra no lugar. Não precisa ser grandioso: uma caminhada no horário em que você apostava, um jogo sem dinheiro com amigos, uma tarefa com começo e fim.</p>`,
      acao: { tipo: "campos", titulo: "Plano de substituição", campos: [
        { id: "s_funcao", rotulo: "O que a aposta te dava? (emoção, fuga, companhia, esperança…)", tipo: "texto" },
        { id: "s_horario", rotulo: "Qual era o seu horário de apostar?", tipo: "texto" },
        { id: "s_troca", rotulo: "O que você vai fazer nesse horário a partir de hoje?", tipo: "area" }
      ] },
      missao: ["Preencher o plano de substituição", "Fazer a troca hoje, no seu horário de risco", "Registrar no diário como foi"]
    },
    {
      dia: 9, titulo: "Raio-X das dívidas", subtitulo: "Todas na mesa, sem exceção",
      video: { roteiro: "A09", duracao: "4 min", url: null },
      texto: `<p>Dívida que fica escondida cresce no escuro: juros, multas, cobrança, ansiedade — e ansiedade é gatilho. Hoje você vai listar todas as dívidas, inclusive as com família e amigos.</p>
<p>Para cada uma: com quem é, quanto falta, o juro ao mês (se souber) e a parcela mínima. Se não souber o juro, deixe em branco e descubra no app do banco ou pedindo o extrato.</p>`,
      acao: { tipo: "ferramenta", ferramenta: "dividas" },
      missao: ["Cadastrar todas as dívidas que você lembra", "Conferir pelo menos 2 no app do banco ou no extrato", "Não abrir nenhum crédito novo hoje"]
    },
    {
      dia: 10, titulo: "Orçamento de sobrevivência", subtitulo: "Quanto entra, quanto é inegociável, quanto sobra",
      video: { roteiro: "A10", duracao: "4 min", url: null },
      texto: `<p>Antes de pensar em quitar qualquer coisa, você precisa saber quanto sobra no mês depois do essencial: moradia, comida, transporte, contas básicas e as parcelas mínimas.</p>
<p>Se a conta der negativa, não é motivo para desespero — é informação. Ela mostra que o caminho é negociar (Dia 12) e não apostar para “fechar o mês”.</p>`,
      acao: { tipo: "ferramenta", ferramenta: "orcamento" },
      missao: ["Preencher o orçamento de sobrevivência", "Cortar ou pausar 1 gasto não essencial", "Definir um valor semanal para gastos livres"]
    },
    {
      dia: 11, titulo: "Ordem de ataque", subtitulo: "Qual dívida pagar primeiro",
      video: { roteiro: "A11", duracao: "4 min", url: null },
      texto: `<p>Existem dois jeitos clássicos de escolher a ordem:</p>
<ul><li><strong>Bola de neve:</strong> paga primeiro a menor dívida. Você vê uma dívida sumir rápido, o que dá fôlego para continuar.</li>
<li><strong>Avalanche:</strong> paga primeiro a de maior juro. No total, você paga menos juros.</li></ul>
<p>Os dois funcionam se você seguir. A ferramenta de dívidas mostra as duas ordens com os seus números. Escolha uma e mantenha.</p>
<p><strong>Atenção:</strong> rotativo do cartão e cheque especial costumam ter os juros mais altos do mercado. Se você tem um deles, ele normalmente é o primeiro da fila — ou o primeiro a ser renegociado.</p>`,
      acao: { tipo: "ferramenta", ferramenta: "dividas" },
      missao: ["Escolher bola de neve ou avalanche", "Anotar qual é a dívida nº 1 da sua fila", "Separar o valor que vai para ela este mês"]
    },
    {
      dia: 12, titulo: "Negociar sem medo", subtitulo: "Roteiro para falar com credor",
      video: { roteiro: "A12", duracao: "5 min", url: null },
      texto: `<p>Credor prefere receber menos do que não receber nada. Negociar não é favor, é parte normal do processo.</p>
<p><strong>Antes de ligar:</strong> saiba o valor que cabe no seu orçamento (Dia 10). Nunca aceite parcela que não cabe — acordo quebrado piora tudo.</p>
<p><strong>Roteiro:</strong> “Tenho uma dívida com vocês e quero resolver. Hoje consigo pagar R$ X por mês (ou R$ Y à vista). Quais condições vocês têm para esse valor? Pode me enviar a proposta por escrito?”</p>
<p><strong>Onde mais buscar:</strong> canais oficiais do próprio credor e plataformas de negociação de dívidas conhecidas. Se a soma das dívidas já compromete o seu mínimo para viver, a Lei do Superendividamento (Lei 14.181/2021) permite pedir uma repactuação conjunta — procure o Procon ou a Defensoria Pública da sua cidade.</p>
<p><strong>Nunca</strong> pague para alguém “recuperar” dinheiro perdido em apostas. Promessa de recuperação é um golpe comum.</p>`,
      acao: { tipo: "campos", titulo: "Preparação da negociação", campos: [
        { id: "n_credor", rotulo: "Com qual credor você vai negociar primeiro?", tipo: "texto" },
        { id: "n_valor", rotulo: "Quanto cabe no seu orçamento por mês (R$)?", tipo: "numero" },
        { id: "n_resultado", rotulo: "Como foi? (proposta recebida, próximo passo)", tipo: "area" }
      ] },
      missao: ["Definir o valor que cabe", "Fazer 1 contato de negociação (ou agendar)", "Pedir toda proposta por escrito"]
    },
    {
      dia: 13, titulo: "Proteja o dinheiro de você mesmo", subtitulo: "Barreiras financeiras para os dias difíceis",
      video: { roteiro: "A13", duracao: "4 min", url: null },
      texto: `<p>Nos primeiros meses, o dinheiro disponível na mão é um dos gatilhos mais fortes. Proteger o dinheiro não é falta de confiança em você — é inteligência.</p>
<ul><li>Reduza o limite do Pix e do cartão de débito no app do banco.</li>
<li>Peça ao banco para cancelar o limite do cheque especial e reduzir o do cartão.</li>
<li>Assim que o salário cair, separe o dinheiro das contas em outra conta ou deixe com alguém de confiança.</li>
<li>Combine com a pessoa de confiança que ela pode ver seu extrato por um período, se fizer sentido para vocês.</li></ul>`,
      acao: { tipo: "checklist", titulo: "Barreiras financeiras", itens: ["Reduzi o limite do Pix", "Reduzi ou cancelei limites de crédito que não uso", "Combinei para onde o salário vai no dia que cair", "Conversei sobre transparência com minha pessoa de confiança"] },
      missao: ["Fazer pelo menos 2 barreiras financeiras", "Atualizar o orçamento se algo mudou", "Registrar no diário qualquer vontade ligada a dinheiro"]
    },
    {
      dia: 14, titulo: "Meio do caminho", subtitulo: "Revisão das duas primeiras semanas",
      video: { roteiro: "A14", duracao: "3 min", url: null },
      texto: `<p>Duas semanas. Olhe para trás com honestidade: o que funcionou, o que não funcionou e onde você ainda está exposto.</p>
<p>Se você teve um deslize no caminho, ele não apaga o que você construiu. O que importa agora é o que você aprendeu com ele.</p>`,
      acao: { tipo: "campos", titulo: "Revisão", campos: [
        { id: "r_funcionou", rotulo: "O que mais funcionou até aqui?", tipo: "area" },
        { id: "r_exposto", rotulo: "Onde você ainda está exposto?", tipo: "area" },
        { id: "r_ajuste", rotulo: "Que ajuste você vai fazer na próxima semana?", tipo: "texto" }
      ] },
      missao: ["Fazer a revisão", "Atualizar o plano de crise com o que aprendeu", "Contar para sua pessoa de confiança como estão sendo as semanas"]
    },
    {
      dia: 15, titulo: "Primeira meta", subtitulo: "Uma reserva pequena muda a sensação de controle",
      video: { roteiro: "A15", duracao: "3 min", url: null },
      texto: `<p>Uma reserva de emergência pequena — mesmo R$ 50 ou R$ 100 — evita que um imprevisto vire nova dívida ou vontade de “resolver na aposta”.</p>
<p>Defina um valor possível, um prazo e um lugar separado para ele. Pagar dívida e montar reserva podem andar juntos: uma parte pequena para a reserva, o resto para a dívida nº 1.</p>`,
      acao: { tipo: "campos", titulo: "Minha primeira meta", campos: [
        { id: "m_valor", rotulo: "Valor da reserva (R$)", tipo: "numero" },
        { id: "m_prazo", rotulo: "Até quando?", tipo: "texto" },
        { id: "m_onde", rotulo: "Onde esse dinheiro vai ficar separado?", tipo: "texto" }
      ] },
      missao: ["Definir a meta", "Fazer o primeiro depósito, de qualquer valor", "Registrar no diário como se sentiu"]
    },
    {
      dia: 16, titulo: "A conversa com a família", subtitulo: "Contar a verdade sem se destruir",
      video: { roteiro: "A16", duracao: "5 min", url: null },
      texto: `<p>Esconder custa caro: cada mentira aumenta a distância e o peso. Contar não resolve tudo de uma vez, mas tira você do isolamento — e isolamento alimenta a aposta.</p>
<p><strong>Roteiro simples:</strong> “Preciso te contar uma coisa difícil. Eu estava apostando e perdi mais do que contei. Já estou fazendo um plano para sair e organizar as dívidas. Não estou pedindo para você resolver, estou pedindo para você saber e, se puder, me ajudar a manter o plano.”</p>
<p>Espere reações fortes. Raiva e decepção são normais no começo. Dê tempo. O que reconstrói a confiança são as próximas semanas, não a conversa.</p>`,
      acao: { tipo: "campos", titulo: "Preparação da conversa", campos: [
        { id: "f_quem", rotulo: "Com quem você vai conversar?", tipo: "texto" },
        { id: "f_quando", rotulo: "Quando e onde (lugar calmo, sem pressa)?", tipo: "texto" },
        { id: "f_pedido", rotulo: "O que você vai pedir a essa pessoa?", tipo: "area" }
      ] },
      missao: ["Preparar a conversa", "Marcar o momento", "Se a conversa já aconteceu, registrar como foi"]
    },
    {
      dia: 17, titulo: "Deslize não é recomeço do zero", subtitulo: "Seu plano para o dia seguinte a uma aposta",
      video: { roteiro: "A17", duracao: "4 min", url: null },
      texto: `<p>Muita gente que está saindo das apostas tem um deslize no caminho. O perigo não é o deslize — é o pensamento que vem depois: “já estraguei tudo, então tanto faz”. Esse pensamento transforma uma aposta numa noite inteira.</p>
<p><strong>Se acontecer:</strong> pare naquela aposta. Registre no app (botão “Tive um deslize”). Conte para sua pessoa de confiança. Volte ao plano no dia seguinte. Seus dias acumulados continuam contando no total.</p>
<p>Se os deslizes se repetem, isso não diz que você é fraco — diz que você precisa de mais apoio. É hora de procurar ajuda profissional (Dia 19).</p>`,
      acao: { tipo: "campos", titulo: "Meu plano para depois de um deslize", campos: [
        { id: "d_parar", rotulo: "O que eu faço para parar na primeira aposta?", tipo: "area" },
        { id: "d_quem", rotulo: "Para quem eu conto no mesmo dia?", tipo: "texto" },
        { id: "d_amanha", rotulo: "O que eu faço na manhã seguinte?", tipo: "area" }
      ] },
      missao: ["Escrever o plano pós-deslize", "Conhecer o botão “Tive um deslize” na tela Início", "Revisar suas barreiras do Dia 2"]
    },
    {
      dia: 18, titulo: "Rotina nova", subtitulo: "Sono, horários de risco e fins de semana",
      video: { roteiro: "A18", duracao: "4 min", url: null },
      texto: `<p>Cansaço e madrugada no celular são combinação de risco. Muita aposta acontece tarde da noite, quando o controle está mais baixo.</p>
<p>Ajuste três coisas: um horário para largar o celular, um plano para os seus horários de risco (veja no diário) e um plano para jogos importantes e fins de semana.</p>`,
      acao: { tipo: "checklist", titulo: "Rotina de proteção", itens: ["Defini um horário para largar o celular", "Tenho um plano para meus horários de risco", "Tenho um plano para dias de jogo importante", "Coloquei uma atividade fixa no fim de semana"] },
      missao: ["Montar a rotina de proteção", "Cumprir o horário de largar o celular hoje", "Registrar no diário como dormiu"]
    },
    {
      dia: 19, titulo: "Quando buscar ajuda profissional", subtitulo: "Pedir ajuda é parte do plano, não fracasso",
      video: { roteiro: "A19", duracao: "4 min", url: null },
      texto: `<p>Este programa é educativo. Ele ajuda a organizar a vida e a lidar com a vontade, mas não substitui acompanhamento de profissionais de saúde.</p>
<p><strong>Procure ajuda profissional se:</strong> os deslizes se repetem; você sente que perdeu o controle; a ansiedade ou a tristeza não passam; você pensa em se machucar ou em tirar a própria vida; ou as dívidas estão ameaçando moradia e comida.</p>
<p><strong>Onde:</strong> UBS (posto de saúde) do seu bairro, que pode encaminhar ao CAPS; ligue 136 para localizar serviços do SUS; grupos de Jogadores Anônimos. Em sofrimento intenso, ligue para o CVV no 188 — gratuito.</p>`,
      acao: { tipo: "checklist", titulo: "Rede de apoio", itens: ["Sei onde fica a UBS mais próxima", "Salvei o 188 (CVV) no celular", "Pesquisei um grupo de apoio (presencial ou online)", "Decidi se vou marcar atendimento agora"] },
      missao: ["Montar sua rede de apoio", "Salvar os contatos no celular", "Se algum sinal de alerta se aplica a você, marcar o atendimento esta semana"]
    },
    {
      dia: 20, titulo: "Seus padrões", subtitulo: "O que o seu diário mostra",
      video: { roteiro: "A20", duracao: "3 min", url: null },
      texto: `<p>Abra a ferramenta Diário. Ela resume seus horários e emoções mais frequentes. Compare com o mapa de gatilhos do Dia 6: o que confirmou, o que mudou?</p>
<p>Os seus dados valem mais do que qualquer conselho genérico. Ajuste o plano de crise e a rotina com base neles.</p>`,
      acao: { tipo: "ferramenta", ferramenta: "diario" },
      missao: ["Revisar seus padrões no diário", "Atualizar o plano de crise", "Escolher o horário de risco que mais precisa de atenção"]
    },
    {
      dia: 21, titulo: "Os próximos 30 dias", subtitulo: "Do programa para a vida",
      video: { roteiro: "A21", duracao: "4 min", url: null },
      texto: `<p>Você chegou ao fim do programa, não ao fim do caminho. O que mantém a mudança agora é rotina: diário quando a vontade aparecer, barreiras no lugar, dívidas andando e pessoas por perto.</p>
<p>Defina o que você vai manter nos próximos 30 dias. Volte a este app sempre que precisar — seu plano de crise e suas ferramentas continuam aqui.</p>`,
      acao: { tipo: "campos", titulo: "Compromisso dos próximos 30 dias", campos: [
        { id: "c_manter", rotulo: "O que eu vou manter todo dia?", tipo: "area" },
        { id: "c_semana", rotulo: "O que eu vou revisar toda semana?", tipo: "area" },
        { id: "c_apoio", rotulo: "Quem vai me acompanhar?", tipo: "texto" }
      ] },
      missao: ["Escrever o compromisso", "Fazer um backup do seu progresso (tela Progresso)", "Contar para sua pessoa de confiança que você terminou o programa"]
    }
  ],
  barreiras: [
    "Apaguei todos os apps e atalhos de apostas do celular",
    "Saí de grupos de 'sinais', 'dicas' ou 'green' (WhatsApp, Telegram, Discord)",
    "Deixei de seguir perfis e influenciadores que divulgam apostas",
    "Apaguei senhas e cartões salvos em sites de apostas",
    "Bloqueei ou reduzi o limite do Pix no app do banco",
    "Ativei o controle de conteúdo/bloqueio de sites no celular",
    "Contei para uma pessoa de confiança que estou saindo",
    "Combinei com essa pessoa o que fazer se eu pedir dinheiro emprestado"
  ],
  emocoes: ["Tédio", "Ansiedade", "Estresse", "Tristeza", "Raiva", "Euforia", "Solidão", "Desespero com dinheiro", "Outra"]
};
