import TelaFormulario, { CampoFormulario } from '../../components/TelaFormulario';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { api } from '../../services/api';

const METODOS = [
  { valor: 'cartao_credito', nome: 'Cartão de crédito' },
  { valor: 'cartao_debito', nome: 'Cartão de débito' },
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

function criarCampos(bloquearReserva: boolean): CampoFormulario[] {
  return [
  { nome: 'reserva', label: 'ID da Reserva', keyboardType: 'numeric', numero: true, somenteLeitura: bloquearReserva },
  { nome: 'valor', label: 'Valor (R$)', keyboardType: 'decimal-pad', numero: true },
  { nome: 'metodo', label: 'Método', selecao: METODOS },
  { nome: 'status', label: 'Status', selecao: STATUS, valorPadrao: 'pago', oculto: true },
  ];
}

export default function CriarPagamentoScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const bloquearReserva = Boolean(route.params?.valoresIniciais?.reserva);
  const campos = criarCampos(bloquearReserva);

  return (
    <TelaFormulario
      endpoint="/pagamentos/pagamentos/"
      campos={campos}
      textoBotao="Pagar"
      textoSalvando="Pagando..."
      aoSalvarSucesso={async (_pagamentoCriado, dadosPagamento) => {
        try {
          await api.patch(`/reservas/reservas/${dadosPagamento.reserva}/`, {
            status: 'confirmada',
          });
        } finally {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Reservas' }],
            }),
          );
        }
      }}
    />
  );
}
