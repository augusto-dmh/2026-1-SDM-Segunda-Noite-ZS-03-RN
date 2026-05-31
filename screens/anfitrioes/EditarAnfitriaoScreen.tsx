import TelaFormulario, {
  CampoFormulario,
} from '../../components/TelaFormulario';

const campos: CampoFormulario[] = [
  { nome: 'nome', label: 'Nome' },
  { nome: 'email', label: 'E-mail', keyboardType: 'email-address' },
  { nome: 'telefone', label: 'Telefone', keyboardType: 'phone-pad' },
  { nome: 'documento', label: 'Documento' },
  { nome: 'bio', label: 'Biografia', multiline: true },
  {
    nome: 'avaliacao_media',
    label: 'Avaliação média',
    keyboardType: 'decimal-pad',
  },
];

export default function EditarAnfitriaoScreen() {
  return <TelaFormulario endpoint="/anfitrioes/" campos={campos} />;
}
