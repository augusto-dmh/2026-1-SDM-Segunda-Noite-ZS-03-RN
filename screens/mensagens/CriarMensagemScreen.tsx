import TelaFormulario, { CampoFormulario } from '../../components/TelaFormulario';
import { useRoute } from '@react-navigation/native';

function criarCampos(ocultarHospedagem: boolean): CampoFormulario[] {
  return [
  { nome: 'hospedagem', label: 'ID da Hospedagem', keyboardType: 'numeric', numero: true, oculto: ocultarHospedagem },
  { nome: 'nome', label: 'Nome' },
  { nome: 'email', label: 'Email', keyboardType: 'email-address' },
  { nome: 'telefone', label: 'Telefone', keyboardType: 'phone-pad' },
  { nome: 'assunto', label: 'Assunto' },
  { nome: 'mensagem', label: 'Mensagem', multiline: true },
  { nome: 'lida', label: 'Lida', booleano: true, valorPadrao: false, oculto: ocultarHospedagem },
  ];
}

export default function CriarMensagemScreen() {
  const route = useRoute<any>();
  const ocultarHospedagem = Boolean(route.params?.valoresIniciais?.hospedagem);
  const campos = criarCampos(ocultarHospedagem);

  return <TelaFormulario endpoint="/mensagens/mensagens/" campos={campos} />;
}
