import TelaLista from '../../components/TelaLista';

export default function EnderecosScreen() {
  return (
    <TelaLista
      endpoint="/enderecos/"
      rotaCadastro="CriarEndereco"
      rotaEdicao="EditarEndereco"
      descricao={(endereco) =>
        `${endereco.logradouro}, ${endereco.numero}\n${endereco.bairro}\n${endereco.cidade}/${endereco.estado} - ${endereco.cep}`
      }
    />
  );
}
