import TelaLista from '../../components/TelaLista';

export default function PagamentosScreen() {
  return (
    <TelaLista
      endpoint="/pagamentos/pagamentos/"
      rotaCadastro="CriarPagamento"
      rotaEdicao="EditarPagamento"
      exibeAcoes={false}
      descricao={(pagamento) =>
        `Pagamento ${pagamento.id}\nReserva: ${pagamento.reserva} | Valor: R$ ${pagamento.valor}\nMetodo: ${pagamento.metodo} | Status: ${pagamento.status}\nData do pagamento: ${pagamento.data_pagamento || 'Nao informada'}`
      }
    />
  );
}
