/**
 * main.js
 * Único ponto de entrada. Orquestra os módulos; nenhum outro arquivo o importa.
 */

import { iniciarRouter, aoNavegar, irPara } from "./modules/router.js";
import { renderizarLista, cardProjeto, itemDoacao, itemFaq, linhaInscricao } from "./modules/templates.js";
import { iniciarFormulario, destruirMascaras } from "./modules/formulario.js";
import { carregar, CHAVES } from "./modules/armazenamento.js";
import { aplicarTemaSalvo, alternarTema, alternarMenu, abrirModal, fecharModal, prenderFoco } from "./modules/ui.js";
import { projetos, doacoes, faq } from "./data/conteudo.js";
import { $ } from "./utils/helpers.js";

const ROTAS = {
  "/":          { fragmento: "html/inicio.html",   titulo: "Início" },
  "/projetos":  { fragmento: "html/projetos.html", titulo: "Projetos" },
  "/cadastro":  { fragmento: "html/cadastro.html", titulo: "Seja voluntário" }
};

/** Preenche os contêineres de dados presentes no fragmento recém-injetado. */
function montarComponentes() {
  const mapa = {
    projetos: [projetos, cardProjeto],
    doacoes:  [doacoes, itemDoacao],
    faq:      [faq, itemFaq]
  };

  Object.entries(mapa).forEach(([chave, [dados, template]]) => {
    const alvo = $(`[data-lista="${chave}"]`);
    if (alvo) alvo.innerHTML = renderizarLista(dados, template);
  });

  atualizarInscricoes();

  const form = $("#form-cadastro");
  if (form) iniciarFormulario(form);
  else destruirMascaras();
}

function atualizarInscricoes() {
  const cadastros = carregar(CHAVES.cadastros, []);
  const contador = $("[data-contador='voluntarios']");
  if (contador) contador.textContent = String(cadastros.length);
  const lista = $("[data-lista='inscricoes']");
  if (lista) lista.innerHTML = renderizarLista(cadastros.slice(-5).reverse(), linhaInscricao);
}

function iniciar() {
  aplicarTemaSalvo();

  // Delegação de ações: vale para qualquer elemento gerado depois.
  document.addEventListener("click", (e) => {
    const alvo = e.target.closest("[data-acao]");
    if (!alvo) return;
    const { acao, id } = alvo.dataset;

    if (acao === "tema") alternarTema();
    if (acao === "menu") alternarMenu();
    if (acao === "fechar-modal") fecharModal();
    if (acao === "participar") {
      irPara("/cadastro");
      setTimeout(() => {
        const oculto = $("#projeto-escolhido");
        if (oculto) oculto.value = id;
      }, 0);
    }
    if (acao === "detalhes") {
      const p = projetos.find((x) => x.id === id);
      if (p) abrirModal(p.titulo, p.descricao);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { fecharModal(); alternarMenu(false); }
    prenderFoco(e);
  });

  // Comunicação de baixo para cima: o formulário avisa, a home escuta.
  document.addEventListener("cadastro:salvo", atualizarInscricoes);

  aoNavegar(montarComponentes);
  iniciarRouter(ROTAS);
}

document.addEventListener("DOMContentLoaded", iniciar);
