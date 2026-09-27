# A Política dos Homens

**Ideias que atravessaram os séculos.**

Plataforma web de streaming para organizar, apresentar e reproduzir podcasts de Filosofia Política produzidos por estudantes. O projeto combina uma interface editorial escura com recursos típicos de serviços de áudio: player global, episódios, favoritos, busca, filtros, progresso salvo e páginas imersivas.

## Tecnologias

- HTML5 semântico
- CSS3 modular
- JavaScript puro (Vanilla JavaScript)
- `localStorage` para favoritos, preferências e progresso
- Google Fonts via CDN apenas como melhoria visual opcional

Não há React, Vue, Node.js, build, npm ou dependências obrigatórias.

## Como executar

### Opção 1 — abrir diretamente

Abra `index.html` no navegador.

A interface principal funciona sem servidor. Para uma experiência mais consistente com PDF incorporado e armazenamento local, recomenda-se um servidor local.

### Opção 2 — servidor local com Python

Dentro da pasta do projeto:

```bash
python3 -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

## Estrutura

```text
A-Politica-dos-Homens/
│
├── index.html
├── .nojekyll
│
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── style.css
│   ├── components.css
│   ├── player.css
│   ├── modal.css
│   ├── animations.css
│   └── responsive.css
│
├── js/
│   ├── data.js
│   ├── storage.js
│   ├── favorites.js
│   ├── filters.js
│   ├── search.js
│   ├── player.js
│   ├── navigation.js
│   ├── animations.js
│   ├── modal.js
│   └── app.js
│
├── imagens/
│   ├── capa/
│   ├── filosofos/
│   ├── episodios/
│   ├── equipes/
│   ├── backgrounds/
│   ├── icons/
│   └── placeholders/
│
├── audios/
│   ├── marx/
│   ├── locke/
│   ├── hobbes/
│   ├── rawls/
│   └── maquiavel/
│
├── roteiros/
│   ├── marx/
│   ├── locke/
│   ├── hobbes/
│   ├── rawls/
│   └── maquiavel/
│
└── materiais-professor/
    └── manual-do-podcast-de-filosofia-politica.pdf
```

## Arquivo central de dados

Quase todo o conteúdo editável fica em:

```text
js/data.js
```

Cada episódio possui:

- identificador;
- número;
- grupo;
- filósofo;
- título;
- descrição curta e longa;
- caminhos de imagens;
- cor secundária;
- período histórico;
- região;
- biografia;
- temas;
- conceitos;
- obras;
- contexto histórico;
- áudios;
- roteiro;
- integrantes.

Isso evita espalhar informações diretamente pelo HTML.

## Como adicionar as capas

Coloque os arquivos finais com estes nomes:

```text
imagens/capa/capa-principal.jpg

imagens/episodios/marx.jpg
imagens/episodios/locke.jpg
imagens/episodios/hobbes.jpg
imagens/episodios/rawls.jpg
imagens/episodios/maquiavel.jpg
```

Para retratos independentes dos filósofos:

```text
imagens/filosofos/marx.jpg
imagens/filosofos/locke.jpg
imagens/filosofos/hobbes.jpg
imagens/filosofos/rawls.jpg
imagens/filosofos/maquiavel.jpg
```

Se esses arquivos não existirem, a plataforma troca automaticamente para placeholders locais. Não aparecem ícones de imagem quebrada.

## Como adicionar os áudios

### Marx

O episódio de Marx possui duas versões:

```text
audios/marx/episodio-curto.mp3
audios/marx/episodio-completo.mp3
```

### Outros episódios

```text
audios/locke/episodio-02.mp3
audios/hobbes/episodio-03.mp3
audios/rawls/episodio-04.mp3
audios/maquiavel/episodio-05.mp3
```

Depois de colocar o MP3, abra `js/data.js` e altere o campo do áudio correspondente:

```javascript
available: false
```

para:

```javascript
available: true
```

Isso é proposital. Enquanto o áudio ainda não existir, o site mantém os controles desabilitados e informa elegantemente que o episódio está em produção, evitando um player quebrado.

## Como funciona o player

Há uma única instância global de `Audio`, criada em `js/player.js`.

Isso garante que dois episódios nunca toquem simultaneamente.

Ao iniciar outro áudio:

1. o progresso do áudio atual é salvo;
2. o áudio atual é pausado;
3. a mesma instância recebe o novo arquivo;
4. o novo episódio é carregado;
5. os players visualmente diferentes são sincronizados com essa mesma instância.

O player oferece:

- play/pause;
- voltar 10 segundos;
- avançar 10 segundos;
- busca na barra de progresso;
- tempo atual;
- duração real do arquivo;
- volume;
- mute;
- indicador de carregamento;
- feedback visual de `+10s` e `-10s`;
- equalizador enquanto está tocando.

Atalhos de teclado, quando nenhum campo de texto ou modal está ativo:

```text
Espaço       Play/Pause
←            -10 segundos
→            +10 segundos
M            Mute
/            Focar a pesquisa
```

## Progresso e LocalStorage

O navegador salva localmente:

- favoritos;
- volume;
- estado de mute;
- áudio mais recente;
- posição de cada episódio;
- porcentagem ouvida.

As chaves usam o prefixo:

```text
aph.v2.
```

A seção **Continuar ouvindo** é construída automaticamente a partir desses dados.

## Favoritos

O botão de coração usa `localStorage`.

Os episódios marcados aparecem na seção **Favoritos** mesmo após recarregar a página.

## Pesquisa

A pesquisa procura em:

- nome do filósofo;
- título;
- descrição;
- temas;
- conceitos;
- obras;
- contexto histórico.

Os resultados aparecem instantaneamente sem recarregar a página.

## Filtros

A página de podcasts possui filtros simultâneos por:

- pensador;
- tema;
- conceito.

Toda a filtragem acontece em JavaScript.

## Como adicionar roteiros

Coloque os PDFs nestes caminhos:

```text
roteiros/marx/roteiro.pdf
roteiros/locke/roteiro.pdf
roteiros/hobbes/roteiro.pdf
roteiros/rawls/roteiro.pdf
roteiros/maquiavel/roteiro.pdf
```

Depois, em `js/data.js`, altere:

```javascript
script: {
  type: 'pdf',
  path: 'roteiros/marx/roteiro.pdf',
  available: false
}
```

para:

```javascript
script: {
  type: 'pdf',
  path: 'roteiros/marx/roteiro.pdf',
  available: true
}
```

O PDF passa a ser exibido dentro do modal do episódio e também poderá ser aberto em uma nova guia.

## Integrantes e funções

Os nomes das equipes já estão em `js/data.js`, de acordo com o quadro de organização fornecido.

As funções individuais não foram atribuídas porque o material recebido informa os integrantes, mas não associa cada nome a um papel específico.

Quando a divisão estiver pronta, altere:

```javascript
{ name: 'Nome do aluno', role: '' }
```

para, por exemplo:

```javascript
{ name: 'Nome do aluno', role: 'Âncora / Apresentador' }
```

Papéis previstos no manual:

- Âncora / Apresentador;
- O Pensador / Convidado;
- Co-host / Entrevistador de Apoio;
- Repórter / Ouvinte;
- Narrador em Off;
- Radialista / Comercial;
- Sonoplasta / Produtor Musical em grupos com sete integrantes.

## Como adicionar novos episódios

Copie um objeto existente no array `episodes` em `js/data.js` e altere seus dados.

O novo episódio será utilizado automaticamente pelas partes dinâmicas da plataforma, como:

- página de podcasts;
- busca;
- filtros;
- favoritos;
- player;
- modal;
- página de pensadores;
- equipes.

Crie também as pastas de áudio e roteiro correspondentes.

## Como alterar cores

### Identidade geral

Edite:

```text
css/variables.css
```

Principais variáveis:

```css
--charcoal: #121212;
--graphite: #1C1C1C;
--wine: #7A1F2B;
--wine-light: #A83A48;
--ivory: #F2EDE3;
--stone: #A8A29A;
--gold: #B89B5E;
```

### Cor de cada filósofo

Edite `color` e `accentSoft` dentro de `js/data.js`.

A cor individual aparece apenas em detalhes, bordas, luzes, badges, hover e elementos do episódio.

## Material do professor

O arquivo enviado já está incluído em:

```text
materiais-professor/manual-do-podcast-de-filosofia-politica.pdf
```

A tela **O trabalho** apresenta um resumo visual e incorpora o PDF completo.

## Quadro das equipes

A imagem fornecida está incluída em:

```text
imagens/equipes/quadro-organizacao-podcasts.png
```

A tela **Equipes** mostra tanto a organização dinâmica quanto a imagem original.

## Acessibilidade

O projeto inclui:

- HTML semântico;
- navegação por teclado;
- foco visível;
- `aria-labels` em controles importantes;
- link para pular ao conteúdo;
- contraste alto;
- controles com tamanhos adequados;
- `prefers-reduced-motion`;
- textos alternativos;
- botões reais para ações interativas.

## Responsividade

A interface possui adaptações específicas para:

- monitores grandes;
- notebooks;
- 1366px;
- tablets;
- celulares.

No mobile:

- a sidebar vira menu lateral;
- a busca ganha acionador próprio;
- o player global fica compacto;
- o modal ocupa a tela inteira;
- grids passam a uma coluna quando necessário;
- controles continuam adequados ao toque.

## Publicar no GitHub Pages

Na pasta do projeto:

```bash
git init
git add .
git commit -m "feat: publica A Política dos Homens"
git branch -M main
```

Conecte ao repositório:

```bash
git remote add origin https://github.com/SEU-USUARIO/A-Politica-dos-Homens.git
git push -u origin main
```

No GitHub:

1. abra o repositório;
2. entre em **Settings**;
3. abra **Pages**;
4. em **Build and deployment**, escolha **Deploy from a branch**;
5. selecione `main`;
6. selecione `/ (root)`;
7. clique em **Save**.

O endereço normalmente ficará assim:

```text
https://SEU-USUARIO.github.io/A-Politica-dos-Homens/
```

A presença de `.nojekyll` mantém a publicação simples e direta.

## Observação sobre conteúdo

Os áudios e roteiros dos alunos não foram inventados. O projeto está preparado para recebê-los posteriormente. Os placeholders visuais existem apenas para preservar a qualidade da interface enquanto as capas finais não são adicionadas.

---

**A Política dos Homens**  
*Ideias que atravessaram os séculos.*
