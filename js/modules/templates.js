/**
 * modules/templates.js
 * Funções puras: recebem dados, devolvem string HTML.
 * Importa apenas helpers. Nenhuma função aqui toca no DOM.
 */

import { escapar } from "../utils/helpers.js";

export function cardProjeto(p) {
  const concluido = p.status === "concluido";
  return `
    <article class="card" data-projeto="${escapar(p.id)}">
      <picture>
        <source srcset="${escapar(p.imagem)}-480.webp 480w, ${escapar(p.imagem)}-960.webp 960w"
                sizes="(min-width: 60rem) 32vw, 100vw" type="image/webp">
        <img src="${escapar(p.imagem)}-960.jpg" alt="${escapar(p.alt)}"
             width="960" height="640" loading="lazy" decoding="async">
      </picture>
      <div class="card__corpo">
        <p class="card__categoria">${escapar(p.categoria)}</p>
        <h3 class="card__titulo">${escapar(p.titulo)}</h3>
        <p>${escapar(p.descricao)}</p>
        <p class="selo ${concluido ? "selo--concluido" : "selo--andamento"}">
          ${concluido ? "Concluído" : "Em andamento"}
        </p>
        <button type="button" class="botao botao--primario"
                data-acao="participar" data-id="${escapar(p.id)}"
                aria-label="Quero participar do projeto ${escapar(p.titulo)}">
          Quero participar
        </button>
      </div>
    </article>`;
}

export function itemDoacao(d) {
  return `
    <li class="doacao">
      <h3>${escapar(d.titulo)}</h3>
      <p>${escapar(d.descricao)}</p>
    </li>`;
}

export function itemFaq(f) {
  return `
    <details class="faq__item">
      <summary>${escapar(f.titulo)}</summary>
      <p>${escapar(f.descricao)}</p>
    </details>`;
}

export function linhaInscricao(c) {
  return `<li>${escapar(c.nome)} — ${escapar(c.area)}</li>`;
}

/** Aplica um template a uma lista e devolve uma única string. */
export function renderizarLista(dados, template) {
  return dados.map(template).join("");
}
