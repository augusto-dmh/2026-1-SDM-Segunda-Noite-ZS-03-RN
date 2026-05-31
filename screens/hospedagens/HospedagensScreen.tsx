import TelaLista from '../../components/TelaLista';

export default function HospedagensScreen() {
  return (
    <TelaLista
      endpoint="/hospedagens/"
      rotaCadastro="CriarHospedagem"
      rotaEdicao="EditarHospedagem"
      descricao={(hospedagem) =>
        `${hospedagem.titulo}\nTipo: ${hospedagem.tipo} | Diária: R$ ${hospedagem.preco_diaria}\nCapacidade: ${hospedagem.capacidade} | Quartos: ${hospedagem.quartos} | Banheiros: ${hospedagem.banheiros}`
      }
    />
  );
}
