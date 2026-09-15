/**
 * modules/ui.js
 * Tema, menu, modal e toast. Importa armazenamento e helpers.
 */

import { salvar, carregar, CHAVES } from "./armazenamento.js";
import { $, $$ } from "../utils/helpers.js";

let ultimoFoco = null;

/* ---------- tema ---------- */

export function aplicarTemaSalvo() {
  const prefs = carregar(CHAVES.prefs, {});
  if (prefs.tema) document.documentElement.dataset.tema = prefs.tema;
  sincronizarBotaoTema();
}

export function alternarTema() {
  const atual = document.documentElement.dataset.tema
    || (matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro");
  const novo = atual === "escuro" ? "claro" : "escuro";
  document.documentElement.dataset.tema = novo;
  salvar(CHAVES.prefs, { ...carregar(CHAVES.prefs, {}), tema: novo });
  sincronizarBotaoTema();
}

function sincronizarBotaoTema() {
  const botao = $("[data-acao='tema']");
  if (!botao) return;
  const escuro = document.documentElement.dataset.tema === "escuro";
  botao.setAttribute("aria-pressed", String(escuro));
  botao.textContent = escuro ? "Tema claro" : "Tema escuro";
}

/* ---------- menu ---------- */

export function alternarMenu(forcar) {
  const botao = $("[data-acao='menu']");
  const nav = $("#menu-principal");
  if (!botao || !nav) return;
  const aberto = forcar ?? botao.getAttribute("aria-expanded") !== "true";
  botao.setAttribute("aria-expanded", String(aberto));
  nav.classList.toggle("aberto", aberto);
  if (aberto) nav.querySelector("a")?.focus();
}

/* ---------- modal ---------- */

export function abrirModal(titulo, conteudo) {
  const modal = $("#modal");
  if (!modal) return;
  ultimoFoco = document.activeElement;
  $("#modal-titulo", modal).textContent = titulo;
  $("[data-modal-corpo]", modal).textContent = conteudo;
  modal.showModal?.() ?? modal.setAttribute("open", "");
  $("#modal-titulo", modal).focus();
}

export function fecharModal() {
  const modal = $("#modal");
  if (!modal) return;
  modal.close?.() ?? modal.removeAttribute("open");
  ultimoFoco?.focus();
}

/** Mantém a tabulação dentro do modal enquanto ele estiver aberto. */
export function prenderFoco(evento) {
  const modal = $("#modal");
  if (!modal || !modal.open || evento.key !== "Tab") return;
  const focaveis = $$("a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex='-1'])", modal);
  if (!focaveis.length) return;
  const primeiro = focaveis[0];
  const ultimo = focaveis[focaveis.length - 1];
  if (evento.shiftKey && document.activeElement === primeiro) {
    evento.preventDefault();
    ultimo.focus();
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault();
    primeiro.focus();
  }
}

/* ---------- toast ---------- */

export function mostrarToast(mensagem, ms = 4000) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = mensagem;
  toast.classList.add("visivel");
  setTimeout(() => toast.classList.remove("visivel"), ms);
}
