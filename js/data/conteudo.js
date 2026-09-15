/**
 * data/conteudo.js
 * Fonte de dados da aplicação. Não importa nenhum módulo.
 * Alterar o conteúdo do site significa editar este arquivo.
 */

export const projetos = [
  {
    id: "alimenta",
    titulo: "Alimenta Bairro",
    descricao: "Distribuição semanal de cestas básicas para 120 famílias da região.",
    imagem: "img/projeto-alimenta",
    alt: "Voluntários organizando cestas básicas em um galpão",
    categoria: "Segurança alimentar",
    status: "andamento"
  },
  {
    id: "reforco",
    titulo: "Reforço na Praça",
    descricao: "Aulas de apoio em matemática e português para crianças do ensino fundamental.",
    imagem: "img/projeto-reforco",
    alt: "Crianças estudando ao redor de uma mesa com uma voluntária",
    categoria: "Educação",
    status: "andamento"
  },
  {
    id: "oficina",
    titulo: "Oficina de Marcenaria",
    descricao: "Curso gratuito de marcenaria básica, com ferramentas doadas pela comunidade.",
    imagem: "img/projeto-oficina",
    alt: "Bancada de marcenaria com ferramentas manuais",
    categoria: "Capacitação",
    status: "concluido"
  }
];

export const doacoes = [
  { id: "pix", titulo: "Pix", descricao: "Transferência direta para a conta da associação." },
  { id: "alimento", titulo: "Alimentos", descricao: "Itens não perecíveis recebidos na sede, de segunda a sexta." },
  { id: "tempo", titulo: "Tempo", descricao: "Quatro horas por mês já ajudam em qualquer um dos projetos." }
];

export const faq = [
  { id: "idade", titulo: "Preciso ter experiência para ser voluntário?", descricao: "Não. A formação inicial é feita pela própria equipe no primeiro encontro." },
  { id: "horario", titulo: "Qual a carga horária mínima?", descricao: "Quatro horas mensais, com horários combinados conforme a disponibilidade." },
  { id: "contato", titulo: "Como acompanho as atividades?", descricao: "Pelo grupo de avisos criado após a confirmação do cadastro." }
];
