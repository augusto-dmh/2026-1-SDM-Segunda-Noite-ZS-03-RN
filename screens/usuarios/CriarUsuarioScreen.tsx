import TelaFormulario, {
  CampoFormulario,
} from '../../components/TelaFormulario';

const campos: CampoFormulario[] = [
  { nome: 'nome', label: 'Nome' },
  { nome: 'email', label: 'E-mail', keyboardType: 'email-address' },
  { nome: 'telefone', label: 'Telefone', keyboardType: 'phone-pad' },
  { nome: 'cpf', label: 'CPF', keyboardType: 'numeric' },
  { nome: 'data_nascimento', label: 'Data de nascimento' },
  { nome: 'ativo', label: 'Ativo', booleano: true, valorPadrao: true },
];

export default function CriarUsuarioScreen() {
  return <TelaFormulario endpoint="/usuarios/" campos={campos} />;
}
