import TelaFormulario, { CampoFormulario } from '../../components/TelaFormulario';

const campos: CampoFormulario[] = [
  { nome: 'nome', label: 'Nome' },
  { nome: 'descricao', label: 'Descrição', multiline: true },
  { nome: 'icone', label: 'Ícone' },
  { nome: 'ativo', label: 'Ativo', booleano: true, valorPadrao: true },
];

export default function CriarComodidadeScreen() {
  return <TelaFormulario endpoint="/comodidades/" campos={campos} />;
}
