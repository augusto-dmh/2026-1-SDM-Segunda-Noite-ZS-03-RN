import TelaFormulario, { CampoFormulario } from '../../components/TelaFormulario';

const TIPOS = [
  { valor: 'casa', nome: 'Casa' },
  { valor: 'apartamento', nome: 'Apartamento' },
  { valor: 'quarto', nome: 'Quarto' },
  { valor: 'hostel', nome: 'Hostel' },
  { valor: 'pousada', nome: 'Pousada' },
];

const campos: CampoFormulario[] = [
  { nome: 'titulo', label: 'Titulo' },
  { nome: 'descricao', label: 'Descricao', multiline: true },
  { nome: 'tipo', label: 'Tipo', selecao: TIPOS },
  {
    nome: 'endereco',
    label: 'Endereco',
    selecaoEndpoint: '/enderecos/',
    selecaoNome: (endereco) =>
      `${endereco.logradouro}, ${endereco.numero} - ${endereco.cidade}/${endereco.estado}`,
  },
  {
    nome: 'comodidades',
    label: 'Comodidades',
    selecaoEndpoint: '/comodidades/',
    selecaoNome: (comodidade) => comodidade.nome,
    multipla: true,
  },
  { nome: 'preco_diaria', label: 'Preco da Diaria (R$)', keyboardType: 'decimal-pad', numero: true },
  { nome: 'capacidade', label: 'Capacidade', keyboardType: 'numeric', numero: true },
  { nome: 'quartos', label: 'Quartos', keyboardType: 'numeric', numero: true },
  { nome: 'banheiros', label: 'Banheiros', keyboardType: 'numeric', numero: true },
  { nome: 'ativo', label: 'Ativo', booleano: true },
];

export default function EditarHospedagemScreen() {
  return <TelaFormulario endpoint="/hospedagens/" campos={campos} />;
}
