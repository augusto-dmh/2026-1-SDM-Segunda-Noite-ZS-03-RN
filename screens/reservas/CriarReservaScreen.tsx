import TelaFormulario, { CampoFormulario } from '../../components/TelaFormulario';

const STATUS = [
  { valor: 'pendente', nome: 'Pendente' },
  { valor: 'confirmada', nome: 'Confirmada' },
  { valor: 'cancelada', nome: 'Cancelada' },
  { valor: 'finalizada', nome: 'Finalizada' },
];

const campos: CampoFormulario[] = [
  { nome: 'hospedagem', label: 'ID da Hospedagem', keyboardType: 'numeric', numero: true },
  { nome: 'hospede', label: 'ID do Hospede', keyboardType: 'numeric', numero: true },
  { nome: 'data_checkin', label: 'Data de Check-in (AAAA-MM-DD)' },
  { nome: 'data_checkout', label: 'Data de Check-out (AAAA-MM-DD)' },
  { nome: 'quantidade_hospedes', label: 'Quantidade de Hospedes', keyboardType: 'numeric', numero: true },
  { nome: 'valor_total', label: 'Valor Total (R$)', keyboardType: 'decimal-pad', numero: true },
  { nome: 'status', label: 'Status', selecao: STATUS, valorPadrao: 'pendente' },
];

export default function CriarReservaScreen() {
  return <TelaFormulario endpoint="/reservas/reservas/" campos={campos} />;
}
