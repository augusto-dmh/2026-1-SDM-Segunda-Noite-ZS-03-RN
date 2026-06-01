import TelaFormulario, { CampoFormulario } from '../../components/TelaFormulario';
import { useRoute } from '@react-navigation/native';

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

function criarCampos(ocultarReserva: boolean): CampoFormulario[] {
  return [
  { nome: 'reserva', label: 'ID da Reserva', keyboardType: 'numeric', numero: true, oculto: ocultarReserva },
  { nome: 'valor', label: 'Valor (R$)', keyboardType: 'decimal-pad', numero: true },
  { nome: 'metodo', label: 'Metodo', selecao: METODOS },
  { nome: 'status', label: 'Status', selecao: STATUS, valorPadrao: 'pendente' },
  { nome: 'data_pagamento', label: 'Data do Pagamento (AAAA-MM-DD HH:MM)' },
  ];
}

export default function CriarPagamentoScreen() {
  const route = useRoute<any>();
  const ocultarReserva = Boolean(route.params?.valoresIniciais?.reserva);
  const campos = criarCampos(ocultarReserva);

  return <TelaFormulario endpoint="/pagamentos/pagamentos/" campos={campos} />;
}
