/**
 * modules/router.js
 * Roteamento por hash. Recebe o mapa de rotas como parâmetro, por isso não
 * importa data/. Importa templates e ui.
 */

import { $, $$ } from "../utils/helpers.js";
import { alternarMenu } from "./ui.js";

let rotas = {};
const ouvintes = [];

/** Registra uma função chamada após cada troca de rota. */
export function aoNavegar(fn) {
  ouvintes.push(fn);
}

function rotaAtual() {
  const caminho = location.hash.replace(/^#/, "") || "/";
  return rotas[caminho] ? caminho : "/";
}

async function navegar() {
  const caminho = rotaAtual();
  const rota = rotas[caminho];
  const app = $("#app");
  if (!app) return;

  try {
    const url = new URL(rota.fragmento, document.baseURI);
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    app.innerHTML = await resposta.text();
  } catch (erro) {
    console.error("Falha ao carregar a rota", caminho, erro);
    app.innerHTML = "<h1>Conteúdo indisponível</h1><p>Recarregue a página ou volte ao início.</p>";
  }

  document.title = `${rota.titulo} | ONG Mãos Solidárias`;

  $$("a[data-rota]").forEach((link) => {
    const ativo = link.dataset.rota === caminho;
    link.classList.toggle("ativo", ativo);
    if (ativo) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  alternarMenu(false);
  app.focus();                       // avisa o leitor de tela da mudança
  ouvintes.forEach((fn) => fn(caminho));
}

export function iniciarRouter(mapaDeRotas) {
  rotas = mapaDeRotas;

  // Delegação: um listener para todos os links internos, presentes ou futuros.
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-rota]");
    if (!link) return;
    e.preventDefault();
    const destino = `#${link.dataset.rota}`;
    if (location.hash === destino) navegar();
    else location.hash = destino;
  });

  window.addEventListener("hashchange", navegar);
  return navegar();
}

export function irPara(caminho) {
  location.hash = `#${caminho}`;
}
