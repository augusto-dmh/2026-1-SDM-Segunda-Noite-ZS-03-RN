import TelaFormulario, {
  CampoFormulario,
} from '../../components/TelaFormulario';

const campos: CampoFormulario[] = [
  { nome: 'nome', label: 'Nome' },
  { nome: 'email', label: 'E-mail', keyboardType: 'email-address' },
  { nome: 'telefone', label: 'Telefone', keyboardType: 'phone-pad' },
  { nome: 'documento', label: 'Documento' },
  { nome: 'nacionalidade', label: 'Nacionalidade' },
  { nome: 'data_nascimento', label: 'Data de nascimento' },
];

export default function EditarHospedeScreen() {
  return <TelaFormulario endpoint="/hospedes/" campos={campos} />;
}
