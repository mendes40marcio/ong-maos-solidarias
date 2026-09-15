/**
 * modules/armazenamento.js
 * Encapsula o localStorage. Importa apenas helpers.
 * Toda leitura e escrita passa por try/catch: em modo privado ou com a cota
 * esgotada o navegador lança exceção, e a aplicação segue em memória.
 */

export const CHAVES = {
  cadastros: "ong:cadastros",
  rascunho: "ong:rascunho",
  prefs: "ong:prefs"
};

export function salvar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch (erro) {
    console.warn("Não foi possível gravar no armazenamento local:", erro.name);
    return false;
  }
}

export function carregar(chave, padrao) {
  try {
    const bruto = localStorage.getItem(chave);
    if (bruto === null) return padrao;
    return JSON.parse(bruto);
  } catch (erro) {
    // String corrompida gera SyntaxError: descarta e devolve o padrão.
    try { localStorage.removeItem(chave); } catch {}
    console.warn("Conteúdo inválido em", chave, "-", erro.name);
    return padrao;
  }
}

export function remover(chave) {
  try { localStorage.removeItem(chave); } catch {}
}
