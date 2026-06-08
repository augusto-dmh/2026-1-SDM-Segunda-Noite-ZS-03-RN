import { createDrawerNavigator } from '@react-navigation/drawer';

import CustomDrawerContent from './CustomDrawerContent';
import AnfitrioesScreen from '../screens/anfitrioes/AnfitrioesScreen';
import CriarAnfitriaoScreen from '../screens/anfitrioes/CriarAnfitriaoScreen';
import EditarAnfitriaoScreen from '../screens/anfitrioes/EditarAnfitriaoScreen';
import CriarEnderecoScreen from '../screens/enderecos/CriarEnderecoScreen';
import EditarEnderecoScreen from '../screens/enderecos/EditarEnderecoScreen';
import EnderecosScreen from '../screens/enderecos/EnderecosScreen';
import HomeScreen from '../screens/HomeScreen';
import CriarHospedeScreen from '../screens/hospedes/CriarHospedeScreen';
import EditarHospedeScreen from '../screens/hospedes/EditarHospedeScreen';
import HospedesScreen from '../screens/hospedes/HospedesScreen';
import CriarUsuarioScreen from '../screens/usuarios/CriarUsuarioScreen';
import EditarUsuarioScreen from '../screens/usuarios/EditarUsuarioScreen';
import UsuariosScreen from '../screens/usuarios/UsuariosScreen';
import ComodidadesScreen from '../screens/comodidades/ComodidadesScreen';
import CriarComodidadeScreen from '../screens/comodidades/CriarComodidadeScreen';
import EditarComodidadeScreen from '../screens/comodidades/EditarComodidadeScreen';
import AvaliacoesScreen from '../screens/avaliacoes/AvaliacoesScreen';
import CriarAvaliacaoScreen from '../screens/avaliacoes/CriarAvaliacaoScreen';
import EditarAvaliacaoScreen from '../screens/avaliacoes/EditarAvaliacaoScreen';
import HospedagensScreen from '../screens/hospedagens/HospedagensScreen';
import CriarHospedagemScreen from '../screens/hospedagens/CriarHospedagemScreen';
import EditarHospedagemScreen from '../screens/hospedagens/EditarHospedagemScreen';
import ReservasScreen from '../screens/reservas/ReservasScreen';
import CriarReservaScreen from '../screens/reservas/CriarReservaScreen';
import EditarReservaScreen from '../screens/reservas/EditarReservaScreen';
import PagamentosScreen from '../screens/pagamentos/PagamentosScreen';
import CriarPagamentoScreen from '../screens/pagamentos/CriarPagamentoScreen';
import EditarPagamentoScreen from '../screens/pagamentos/EditarPagamentoScreen';
import MensagensScreen from '../screens/mensagens/MensagensScreen';
import CriarMensagemScreen from '../screens/mensagens/CriarMensagemScreen';
import EditarMensagemScreen from '../screens/mensagens/EditarMensagemScreen';
import { TipoLogin } from '../services/api';

const Drawer = createDrawerNavigator();

type Props = {
  onLogout: () => void;
  tipoLogin: TipoLogin;
  hospedeId: number | null;
  anfitriaoId: number | null;
};

export default function DrawerNavigator({ onLogout, tipoLogin, hospedeId }: Props) {
  const ehAnfitriao = tipoLogin === 'anfitriao';
  const ehHospede = tipoLogin === 'hospede';

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} onLogout={onLogout} />
      )}
    >
      {!ehAnfitriao && !ehHospede && (
        <>
          <Drawer.Screen name="Inicio" component={HomeScreen} />
          <Drawer.Screen name="Usuarios" component={UsuariosScreen} />
          <Drawer.Screen name="Hospedes" component={HospedesScreen} />
          <Drawer.Screen name="Anfitrioes" component={AnfitrioesScreen} />
          <Drawer.Screen
            name="CriarAnfitriao"
            component={CriarAnfitriaoScreen}
            options={{ drawerItemStyle: { display: 'none' }, title: 'Criar anfitriao' }}
          />
          <Drawer.Screen
            name="EditarAnfitriao"
            component={EditarAnfitriaoScreen}
            options={{ drawerItemStyle: { display: 'none' }, title: 'Editar anfitriao' }}
          />
          <Drawer.Screen
            name="CriarHospede"
            component={CriarHospedeScreen}
            options={{ drawerItemStyle: { display: 'none' }, title: 'Criar hospede' }}
          />
          <Drawer.Screen
            name="EditarHospede"
            component={EditarHospedeScreen}
            options={{ drawerItemStyle: { display: 'none' }, title: 'Editar hospede' }}
          />
          <Drawer.Screen
            name="CriarUsuario"
            component={CriarUsuarioScreen}
            options={{ drawerItemStyle: { display: 'none' }, title: 'Criar usuario' }}
          />
          <Drawer.Screen
            name="EditarUsuario"
            component={EditarUsuarioScreen}
            options={{ drawerItemStyle: { display: 'none' }, title: 'Editar usuario' }}
          />
        </>
      )}

      {ehAnfitriao && (
        <>
          <Drawer.Screen name="Enderecos" component={EnderecosScreen} />
          <Drawer.Screen
            name="CriarEndereco"
            component={CriarEnderecoScreen}
            options={{ drawerItemStyle: { display: 'none' }, title: 'Criar endereco' }}
          />
          <Drawer.Screen
            name="EditarEndereco"
            component={EditarEnderecoScreen}
            options={{ drawerItemStyle: { display: 'none' }, title: 'Editar endereco' }}
          />
        </>
      )}

      <Drawer.Screen name="Hospedagens">
        {(props) => (
          <HospedagensScreen
            {...props}
            tipoLogin={tipoLogin}
            hospedeId={hospedeId}
          />
        )}
      </Drawer.Screen>
      {ehAnfitriao && (
        <>
          <Drawer.Screen
            name="CriarHospedagem"
            component={CriarHospedagemScreen}
            options={{ drawerItemStyle: { display: 'none' }, title: 'Criar hospedagem' }}
          />
          <Drawer.Screen
            name="EditarHospedagem"
            component={EditarHospedagemScreen}
            options={{ drawerItemStyle: { display: 'none' }, title: 'Editar hospedagem' }}
          />
        </>
      )}

      <Drawer.Screen name="Reservas">
        {(props) => <ReservasScreen {...props} tipoLogin={tipoLogin} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="CriarReserva"
        component={CriarReservaScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Criar reserva' }}
      />
      <Drawer.Screen
        name="EditarReserva"
        component={EditarReservaScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Editar reserva' }}
      />

      {ehHospede && (
        <>
          <Drawer.Screen name="Pagamentos" component={PagamentosScreen} />
          <Drawer.Screen
            name="CriarPagamento"
            component={CriarPagamentoScreen}
            options={{ drawerItemStyle: { display: 'none' }, title: 'Criar pagamento' }}
          />
          <Drawer.Screen
            name="EditarPagamento"
            component={EditarPagamentoScreen}
            options={{ drawerItemStyle: { display: 'none' }, title: 'Editar pagamento' }}
          />
        </>
      )}

      <Drawer.Screen name="Mensagens" component={MensagensScreen} />
      <Drawer.Screen
        name="CriarMensagem"
        component={CriarMensagemScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Criar mensagem' }}
      />
      <Drawer.Screen
        name="EditarMensagem"
        component={EditarMensagemScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Editar mensagem' }}
      />

      <Drawer.Screen name="Avaliacoes">
        {(props) => <AvaliacoesScreen {...props} tipoLogin={tipoLogin} />}
      </Drawer.Screen>
      {ehHospede && (
        <>
          <Drawer.Screen
            name="CriarAvaliacao"
            component={CriarAvaliacaoScreen}
            options={{ drawerItemStyle: { display: 'none' }, title: 'Criar avaliacao' }}
          />
          <Drawer.Screen
            name="EditarAvaliacao"
            component={EditarAvaliacaoScreen}
            options={{ drawerItemStyle: { display: 'none' }, title: 'Editar avaliacao' }}
          />
        </>
      )}

      {ehAnfitriao && (
        <>
          <Drawer.Screen name="Comodidades" component={ComodidadesScreen} />
          <Drawer.Screen
            name="CriarComodidade"
            component={CriarComodidadeScreen}
            options={{ drawerItemStyle: { display: 'none' }, title: 'Criar comodidade' }}
          />
          <Drawer.Screen
            name="EditarComodidade"
            component={EditarComodidadeScreen}
            options={{ drawerItemStyle: { display: 'none' }, title: 'Editar comodidade' }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
}
