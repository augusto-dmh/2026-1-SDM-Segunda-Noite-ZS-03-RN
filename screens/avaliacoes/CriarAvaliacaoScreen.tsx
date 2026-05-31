import TelaFormulario, { CampoFormulario } from '../../components/TelaFormulario';

const campos: CampoFormulario[] = [
  { nome: 'hospedagem', label: 'ID da Hospedagem', keyboardType: 'numeric', numero: true },
  { nome: 'nome_hospede', label: 'Nome do Hóspede' },
  { nome: 'email', label: 'E-mail', keyboardType: 'email-address' },
  { nome: 'nota', label: 'Nota', keyboardType: 'numeric', numero: true },
  { nome: 'comentario', label: 'Comentário', multiline: true },
];

export default function CriarAvaliacaoScreen() {
  return <TelaFormulario endpoint="/avaliacoes/" campos={campos} />;
}
