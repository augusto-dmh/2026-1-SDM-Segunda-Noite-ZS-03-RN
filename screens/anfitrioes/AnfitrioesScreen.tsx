import TelaLista from '../../components/TelaLista';

export default function AnfitrioesScreen() {
  return (
    <TelaLista
      endpoint="/anfitrioes/"
      rotaCadastro="CriarAnfitriao"
      rotaEdicao="EditarAnfitriao"
      permiteExcluir={false}
      descricao={(anfitriao) =>
        `${anfitriao.nome}\n${anfitriao.email}\nAvaliação: ${anfitriao.avaliacao_media}`
      }
    />
  );
}
