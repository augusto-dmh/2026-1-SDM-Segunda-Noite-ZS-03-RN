import TelaLista from '../../components/TelaLista';
import { TipoLogin } from '../../services/api';

type Props = {
  tipoLogin: TipoLogin;
};

export default function AvaliacoesScreen({ tipoLogin }: Props) {
  const ehHospede = tipoLogin === 'hospede';

  return (
    <TelaLista
      endpoint="/avaliacoes/"
      rotaCadastro="CriarAvaliacao"
      rotaEdicao="EditarAvaliacao"
      permiteExcluir={ehHospede}
      exibeAcoes={ehHospede}
      exibeCriacao={ehHospede}
      descricao={(avaliacao) =>
        `Nota: ${avaliacao.nota} - Hospedagem #${avaliacao.hospedagem}\n${avaliacao.nome_hospede} (${avaliacao.email})\n${avaliacao.comentario || 'Sem comentário'}`
      }
    />
  );
}
