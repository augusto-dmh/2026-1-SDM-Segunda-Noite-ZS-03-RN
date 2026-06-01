import TelaFormulario, { CampoFormulario } from '../../components/TelaFormulario';
import { useRoute } from '@react-navigation/native';

const STATUS = [
  { valor: 'pendente', nome: 'Pendente' },
  { valor: 'confirmada', nome: 'Confirmada' },
  { valor: 'cancelada', nome: 'Cancelada' },
  { valor: 'finalizada', nome: 'Finalizada' },
];

function criarCampos(ocultarHospedagemEHospede: boolean): CampoFormulario[] {
  return [
  { nome: 'hospedagem', label: 'ID da Hospedagem', keyboardType: 'numeric', numero: true, oculto: ocultarHospedagemEHospede },
  { nome: 'hospede', label: 'ID do Hospede', keyboardType: 'numeric', numero: true, oculto: ocultarHospedagemEHospede },
  { nome: 'data_checkin', label: 'Data de Check-in (AAAA-MM-DD)' },
  { nome: 'data_checkout', label: 'Data de Check-out (AAAA-MM-DD)' },
  { nome: 'quantidade_hospedes', label: 'Quantidade de Hospedes', keyboardType: 'numeric', numero: true },
  { nome: 'valor_total', label: 'Valor Total (R$)', keyboardType: 'decimal-pad', numero: true, somenteLeitura: ocultarHospedagemEHospede },
  { nome: 'status', label: 'Status', selecao: STATUS, valorPadrao: 'pendente', oculto: ocultarHospedagemEHospede },
  ];
}

export default function CriarReservaScreen() {
  const route = useRoute<any>();
  const valoresIniciais = route.params?.valoresIniciais;
  const deveOcultarIds = Boolean(
    valoresIniciais?.hospedagem && valoresIniciais?.hospede,
  );

  const campos = criarCampos(deveOcultarIds);

  return <TelaFormulario endpoint="/reservas/reservas/" campos={campos} />;
}
