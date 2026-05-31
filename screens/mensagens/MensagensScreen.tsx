import TelaLista from '../../components/TelaLista';

export default function MensagensScreen() {
  return (
    <TelaLista
      endpoint="/mensagens/mensagens/"
      rotaCadastro="CriarMensagem"
      rotaEdicao="EditarMensagem"
      descricao={(mensagem) =>
        `Mensagem ${mensagem.id}\nHospedagem: ${mensagem.hospedagem} | De: ${mensagem.nome}\nEmail: ${mensagem.email} | Telefone: ${mensagem.telefone || 'Nao informado'}\nAssunto: ${mensagem.assunto}\nLida: ${mensagem.lida ? 'Sim' : 'Nao'}`
      }
    />
  );
}
