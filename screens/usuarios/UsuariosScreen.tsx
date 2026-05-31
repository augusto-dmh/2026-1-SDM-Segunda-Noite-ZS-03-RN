import TelaLista from '../../components/TelaLista';

export default function UsuariosScreen() {
  return (
    <TelaLista
      endpoint="/usuarios/"
      rotaCadastro="CriarUsuario"
      rotaEdicao="EditarUsuario"
      descricao={(usuario) =>
        `${usuario.nome}\n${usuario.email}\nCPF: ${usuario.cpf}`
      }
    />
  );
}
