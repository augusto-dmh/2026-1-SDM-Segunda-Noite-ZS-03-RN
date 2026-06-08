import TelaFormulario, { CampoFormulario } from '../../components/TelaFormulario';

const campos: CampoFormulario[] = [
  { nome: 'hospedagem', label: 'ID da Hospedagem', keyboardType: 'numeric', numero: true },
  { nome: 'nome', label: 'Nome' },
  { nome: 'email', label: 'E-mail', keyboardType: 'email-address' },
  { nome: 'telefone', label: 'Telefone', keyboardType: 'phone-pad' },
  { nome: 'assunto', label: 'Assunto' },
  { nome: 'mensagem', label: 'Mensagem', multiline: true },
  { nome: 'lida', label: 'Lida', booleano: true },
];

export default function EditarMensagemScreen() {
  return <TelaFormulario endpoint="/mensagens/mensagens/" campos={campos} />;
}
