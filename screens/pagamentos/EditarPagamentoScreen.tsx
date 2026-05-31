import TelaFormulario, { CampoFormulario } from '../../components/TelaFormulario';

const METODOS = [
  { valor: 'cartao_credito', nome: 'Cartao de Credito' },
  { valor: 'cartao_debito', nome: 'Cartao de Debito' },
  { valor: 'pix', nome: 'PIX' },
  { valor: 'boleto', nome: 'Boleto' },
  { valor: 'dinheiro', nome: 'Dinheiro' },
];

const STATUS = [
  { valor: 'pendente', nome: 'Pendente' },
  { valor: 'pago', nome: 'Pago' },
  { valor: 'cancelado', nome: 'Cancelado' },
  { valor: 'reembolsado', nome: 'Reembolsado' },
];

const campos: CampoFormulario[] = [
  { nome: 'reserva', label: 'ID da Reserva', keyboardType: 'numeric', numero: true },
  { nome: 'valor', label: 'Valor (R$)', keyboardType: 'decimal-pad', numero: true },
  { nome: 'metodo', label: 'Metodo', selecao: METODOS },
  { nome: 'status', label: 'Status', selecao: STATUS },
  { nome: 'data_pagamento', label: 'Data do Pagamento (AAAA-MM-DD HH:MM)' },
];

export default function EditarPagamentoScreen() {
  return <TelaFormulario endpoint="/pagamentos/pagamentos/" campos={campos} />;
}
