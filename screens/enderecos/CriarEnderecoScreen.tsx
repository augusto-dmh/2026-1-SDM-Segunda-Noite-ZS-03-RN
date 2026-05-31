import TelaFormulario, {
  CampoFormulario,
} from '../../components/TelaFormulario';

const campos: CampoFormulario[] = [
  { nome: 'logradouro', label: 'Logradouro' },
  { nome: 'numero', label: 'Número' },
  { nome: 'complemento', label: 'Complemento' },
  { nome: 'bairro', label: 'Bairro' },
  { nome: 'cidade', label: 'Cidade' },
  { nome: 'estado', label: 'Estado' },
  { nome: 'cep', label: 'CEP' },
];

export default function CriarEnderecoScreen() {
  return <TelaFormulario endpoint="/enderecos/" campos={campos} />;
}
