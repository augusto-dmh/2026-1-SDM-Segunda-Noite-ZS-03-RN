import TelaLista from '../../components/TelaLista';

export default function ReservasScreen() {
  return (
    <TelaLista
      endpoint="/reservas/reservas/"
      rotaCadastro="CriarReserva"
      rotaEdicao="EditarReserva"
      descricao={(reserva) =>
        `Reserva ${reserva.id}\nHospedagem: ${reserva.hospedagem} | Hospede: ${reserva.hospede}\nCheck-in: ${reserva.data_checkin} | Check-out: ${reserva.data_checkout}\nHospedes: ${reserva.quantidade_hospedes} | Total: R$ ${reserva.valor_total}\nStatus: ${reserva.status}`
      }
    />
  );
}
