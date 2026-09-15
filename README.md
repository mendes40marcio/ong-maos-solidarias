# ONG Mãos Solidárias

Site institucional de uma organização fictícia, desenvolvido como experiência prática
de Front-end do curso de Engenharia de Software (Cruzeiro do Sul Virtual).

**Site publicado:** https://mendes40marcio.github.io/ong-maos-solidarias/

---

## Sobre o projeto

A ONG Mãos Solidárias atua com segurança alimentar, reforço escolar e capacitação
profissional. O site apresenta os projetos em andamento, as formas de contribuir e
um formulário de cadastro de voluntários.

O objetivo técnico foi construir uma aplicação de página única em JavaScript puro,
sem frameworks, aplicando semântica, acessibilidade, modularização e otimização.

## Tecnologias utilizadas

| Camada | Tecnologia |
| --- | --- |
| Estrutura | HTML5 semântico, landmarks, WAI-ARIA |
| Estilo | CSS3 com variáveis (tokens), Flexbox e Grid |
| Comportamento | JavaScript ES6+ (modules, template literals, destructuring, async/await) |
| Máscaras | IMask (via CDN) |
| Persistência | Web Storage API (localStorage) |
| Build | Vite |
| Versionamento | Git, GitHub, GitFlow, Conventional Commits |
| Publicação | GitHub Pages com GitHub Actions |

## Funcionalidades

- Navegação em página única (SPA) por hash, sem recarregar o documento
- Componentes gerados dinamicamente a partir de arrays de dados
- Formulário com validação em tempo real, máscaras e mensagens acessíveis
- Persistência de cadastros, rascunho do formulário e preferências no navegador
- Alternância entre tema claro e escuro, respeitando a preferência do sistema
- Layout responsivo e navegação completa por teclado

## Estrutura de diretórios

```
ong-maos-solidarias/
├── index.html              # documento base, com <main id="app">
├── html/                   # fragmentos carregados por rota
│   ├── inicio.html
│   ├── projetos.html
│   └── cadastro.html
├── css/
│   ├── tokens.css          # variáveis de cor e tema
│   └── style.css           # estilos dos componentes
├── js/
│   ├── main.js             # ponto de entrada, orquestra os módulos
│   ├── modules/
│   │   ├── router.js       # rotas por hash e carregamento dos fragmentos
│   │   ├── templates.js    # funções puras: dados → HTML
│   │   ├── formulario.js   # validação, máscaras e submissão
│   │   ├── armazenamento.js# encapsula o localStorage
│   │   └── ui.js           # tema, menu, modal e toast
│   ├── utils/helpers.js    # escapar, debounce, formatarData
│   └── data/conteudo.js    # projetos, formas de doação e FAQ
├── img/                    # imagens em WebP e JPEG, em três larguras
├── .github/workflows/      # automação de build e deploy
├── vite.config.js
└── package.json
```

O fluxo de importação é em sentido único — `helpers` e `data` não importam ninguém;
`armazenamento` e `templates` importam apenas `helpers`; `formulario` e `ui` importam
`armazenamento`, `templates` e `helpers`; `router` importa `templates` e `ui`; e só o
`main.js` conhece todos. Isso evita importação circular.

## Instalação e execução local

**Pré-requisitos:** Git, um navegador atual e Node.js 18+ (apenas para o build).

```bash
git clone https://github.com/mendes40marcio/ong-maos-solidarias.git
cd ong-maos-solidarias
```

Como o projeto usa ES6 Modules e `fetch`, ele precisa ser servido por HTTP —
abrir o `index.html` direto do disco não funciona. Escolha uma opção:

```bash
npm install && npm run dev     # servidor de desenvolvimento do Vite
python3 -m http.server 8000    # sem instalar nada
npx serve                      # alternativa
```

Acesse `http://localhost:8000` (ou a porta indicada no terminal).

Para gerar e testar a versão de produção:

```bash
npm run build      # gera a pasta dist/
npm run preview    # serve a dist/ localmente
```

## Versionamento e contribuição

O repositório segue o modelo **GitFlow**:

- `main` — versões estáveis e publicadas, sempre com tag
- `develop` — integração contínua do que ainda não foi lançado
- `feature/*` — uma branch por funcionalidade, criada a partir de `develop`
- `hotfix/*` — correção urgente a partir de `main`

As mensagens seguem **Conventional Commits** (`feat`, `fix`, `refactor`, `docs`,
`style`, `chore`) com escopo entre parênteses, e as versões seguem o
**versionamento semântico** MAJOR.MINOR.PATCH.

Para contribuir: faça um fork, crie uma branch `feature/`, commite no padrão acima
e abra um pull request descritivo apontando para `develop`.

## Acessibilidade

- Landmarks `header`, `nav`, `main` e `footer`, com um `h1` por página
- Link "pular para o conteúdo" como primeiro elemento focável
- Modal com `dialog`, `aria-modal`, contenção e retorno de foco
- Campos com `label` associado, `aria-describedby` e `aria-invalid`
- Mensagens dinâmicas em regiões `aria-live`
- Contraste mínimo de 4.5:1 em texto e 3:1 em componentes, verificado no WebAIM

## Autor

**Marcio Mendes** — [github.com/mendes40marcio](https://github.com/mendes40marcio)
Engenharia de Software — Cruzeiro do Sul Virtual

## Licença

Distribuído sob a licença MIT. Veja o arquivo `LICENSE`.
