import TelaLista from '../../components/TelaLista';

export default function ComodidadesScreen() {
  return (
    <TelaLista
      endpoint="/comodidades/"
      rotaCadastro="CriarComodidade"
      rotaEdicao="EditarComodidade"
      descricao={(comodidade) =>
        `${comodidade.nome}${comodidade.icone ? ` (${comodidade.icone})` : ''}\n${comodidade.descricao}`
      }
    />
  );
}
