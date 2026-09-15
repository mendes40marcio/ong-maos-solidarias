/**
 * utils/helpers.js
 * Utilidades genéricas. Não importa nenhum outro módulo do projeto.
 */

/** Converte caracteres especiais em entidades, evitando injeção de marcação. */
export function escapar(valor = "") {
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Adia a execução até parar de receber chamadas por `espera` ms. */
export function debounce(fn, espera = 300) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), espera);
  };
}

/** Formata uma data ISO no padrão brasileiro. */
export function formatarData(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("pt-BR");
}

export const $ = (seletor, escopo = document) => escopo.querySelector(seletor);
export const $$ = (seletor, escopo = document) => [...escopo.querySelectorAll(seletor)];
