/**
 * modules/formulario.js
 * Validação, máscaras e submissão do cadastro.
 * Importa armazenamento, ui e helpers.
 */

import { salvar, carregar, remover, CHAVES } from "./armazenamento.js";
import { mostrarToast, abrirModal } from "./ui.js";
import { $, $$, debounce } from "../utils/helpers.js";

const mascaras = [];

/* ---------- regras ---------- */

const soDigitos = (v) => v.replace(/\D/g, "");

function cpfValido(valor) {
  const n = soDigitos(valor);
  if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;
  const digito = (base, peso) => {
    const soma = [...base].reduce((acc, d, i) => acc + Number(d) * (peso - i), 0);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(n.slice(0, 9), 10) === Number(n[9])
      && digito(n.slice(0, 10), 11) === Number(n[10]);
}

function idade(iso) {
  const nasc = new Date(iso);
  if (Number.isNaN(nasc.getTime())) return NaN;
  const hoje = new Date();
  let anos = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) anos--;
  return anos;
}

export const validadores = {
  nome: (v) => /^[A-Za-zÀ-ú\s]{3,}$/.test(v.trim()) ? "" : "Informe o nome completo, com ao menos 3 letras.",
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Informe um e-mail no formato nome@dominio.com.",
  cpf: (v) => !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v) ? "Informe o CPF no formato 000.000.000-00."
            : !cpfValido(v) ? "Este CPF não é válido." : "",
  telefone: (v) => /^\(\d{2}\)\s9\d{4}-\d{4}$/.test(v) ? "" : "Informe o celular no formato (00) 90000-0000.",
  cep: (v) => /^\d{5}-\d{3}$/.test(v) ? "" : "Informe o CEP no formato 00000-000.",
  nascimento: (v) => {
    const anos = idade(v);
    if (Number.isNaN(anos)) return "Informe uma data válida.";
    return anos >= 16 ? "" : "É necessário ter ao menos 16 anos para se voluntariar.";
  },
  area: (v) => v ? "" : "Escolha uma área de interesse.",
  termos: (v) => v === "on" ? "" : "É preciso aceitar os termos para continuar."
};

/* ---------- feedback visual ---------- */

function mensagemDe(campo) {
  return document.getElementById(`erro-${campo.id}`);
}

export function validarCampo(campo, forcar = false) {
  const regra = validadores[campo.id];
  if (!regra) return true;
  const valor = campo.type === "checkbox" ? (campo.checked ? "on" : "") : campo.value;
  const erro = regra(valor);
  const alvo = mensagemDe(campo);

  if (!forcar && !campo.classList.contains("tocado")) return !erro;

  campo.classList.toggle("campo-invalido", Boolean(erro));
  campo.classList.toggle("campo-valido", !erro);
  campo.setAttribute("aria-invalid", String(Boolean(erro)));
  if (alvo) alvo.textContent = erro;
  return !erro;
}

export function validarFormulario(form) {
  return Object.keys(validadores)
    .map((id) => {
      const campo = form.querySelector(`#${id}`);
      return campo ? validarCampo(campo, true) : true;
    })
    .every(Boolean);
}

/* ---------- máscaras (IMask via CDN, com fallback) ---------- */

export function aplicarMascaras() {
  destruirMascaras();
  if (typeof IMask === "undefined") return; // CDN indisponível: a RegEx continua valendo
  const alvos = [
    ["#cpf", "000.000.000-00"],
    ["#telefone", "(00) 00000-0000"],
    ["#cep", "00000-000"]
  ];
  alvos.forEach(([seletor, mask]) => {
    const campo = $(seletor);
    if (campo) mascaras.push(IMask(campo, { mask }));
  });
}

export function destruirMascaras() {
  while (mascaras.length) mascaras.pop().destroy();
}

/* ---------- rascunho ---------- */

const gravarRascunho = debounce((form) => {
  const dados = Object.fromEntries(new FormData(form));
  delete dados.termos;
  salvar(CHAVES.rascunho, dados);
}, 400);

export function restaurarRascunho(form) {
  const dados = carregar(CHAVES.rascunho, {});
  Object.entries(dados).forEach(([id, valor]) => {
    const campo = form.querySelector(`#${id}`);
    if (campo && typeof valor === "string") campo.value = valor;
  });
}

/* ---------- ligação dos eventos ---------- */

export function iniciarFormulario(form) {
  if (!form) return;
  form.setAttribute("novalidate", "");
  restaurarRascunho(form);
  aplicarMascaras();

  $$("input, select, textarea", form).forEach((campo) => {
    campo.addEventListener("blur", () => {
      campo.classList.add("tocado");
      validarCampo(campo);
    });
    campo.addEventListener("input", () => {
      validarCampo(campo);
      gravarRascunho(form);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validarFormulario(form)) {
      const primeiro = form.querySelector(".campo-invalido");
      primeiro?.focus();
      primeiro?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    const dados = Object.fromEntries(new FormData(form));
    const cadastro = { ...dados, id: Date.now(), enviadoEm: new Date().toISOString() };
    const lista = carregar(CHAVES.cadastros, []);
    lista.push(cadastro);
    salvar(CHAVES.cadastros, lista);
    remover(CHAVES.rascunho);

    form.reset();
    $$(".campo-valido, .campo-invalido, .tocado", form)
      .forEach((c) => c.classList.remove("campo-valido", "campo-invalido", "tocado"));

    abrirModal("Inscrição confirmada", `Obrigado, ${cadastro.nome}. A equipe entra em contato em até três dias úteis.`);
    mostrarToast("Cadastro enviado.");
    document.dispatchEvent(new CustomEvent("cadastro:salvo", { detail: cadastro }));
  });
}
