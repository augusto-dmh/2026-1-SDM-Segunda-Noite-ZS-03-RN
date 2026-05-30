import TelaLista from '../../components/TelaLista';

export default function HospedesScreen() {
  return (
    <TelaLista
      endpoint="/hospedes/"
      rotaCadastro="CriarHospede"
      rotaEdicao="EditarHospede"
      descricao={(hospede) =>
        `${hospede.nome}\n${hospede.email}\nDocumento: ${hospede.documento}`
      }
    />
  );
}
