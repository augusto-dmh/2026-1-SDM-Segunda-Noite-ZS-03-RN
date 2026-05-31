import TelaLista from '../../components/TelaLista';

export default function AvaliacoesScreen() {
  return (
    <TelaLista
      endpoint="/avaliacoes/"
      rotaCadastro="CriarAvaliacao"
      rotaEdicao="EditarAvaliacao"
      descricao={(avaliacao) =>
        `Nota: ${avaliacao.nota} - Hospedagem #${avaliacao.hospedagem}\n${avaliacao.nome_hospede} (${avaliacao.email})\n${avaliacao.comentario || 'Sem comentário'}`
      }
    />
  );
}
