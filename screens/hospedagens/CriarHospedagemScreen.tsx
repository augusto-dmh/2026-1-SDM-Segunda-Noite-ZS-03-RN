import TelaFormulario, { CampoFormulario } from '../../components/TelaFormulario';

const TIPOS = [
  { valor: 'casa', nome: 'Casa' },
  { valor: 'apartamento', nome: 'Apartamento' },
  { valor: 'quarto', nome: 'Quarto' },
  { valor: 'hostel', nome: 'Hostel' },
  { valor: 'pousada', nome: 'Pousada' },
];

const campos: CampoFormulario[] = [
  { nome: 'titulo', label: 'Título' },
  { nome: 'descricao', label: 'Descrição', multiline: true },
  { nome: 'tipo', label: 'Tipo', selecao: TIPOS },
  { nome: 'endereco', label: 'ID do Endereço', keyboardType: 'numeric', numero: true },
  { nome: 'comodidades', label: 'IDs das Comodidades (separados por vírgula)', separadoPorVirgula: true },
  { nome: 'preco_diaria', label: 'Preço da Diária (R$)', keyboardType: 'decimal-pad', numero: true },
  { nome: 'capacidade', label: 'Capacidade', keyboardType: 'numeric', numero: true },
  { nome: 'quartos', label: 'Quartos', keyboardType: 'numeric', numero: true },
  { nome: 'banheiros', label: 'Banheiros', keyboardType: 'numeric', numero: true },
  { nome: 'ativo', label: 'Ativo', booleano: true, valorPadrao: true },
];

export default function CriarHospedagemScreen() {
  return <TelaFormulario endpoint="/hospedagens/" campos={campos} />;
}
