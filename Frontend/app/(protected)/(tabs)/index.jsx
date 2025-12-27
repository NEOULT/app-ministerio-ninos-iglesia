import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import AsistenciaMaestros from '../../../components/asistencia_maestros';
import AsistenciaNinos from '../../../components/asistencia_ninos';
import Header from '../../../components/shared/Header';

const salas = [
  { id: 1, label: 'Sala Cuna' },
  { id: 2, label: '4-6' },
  { id: 3, label: '7-9' },
  { id: 4, label: '10-12' },
];

// Utilidad para mostrar la fecha de hoy en formato 'D de Mes de YYYY'
function getFechaHoy() {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const hoy = new Date();
  return `${hoy.getDate()} de ${meses[hoy.getMonth()]} de ${hoy.getFullYear()}`;
}


export default function AsistenciaScreen() {
  const [grupoActivo, setGrupoActivo] = useState(0);
  const [vista, setVista] = useState('ninos'); // 'ninos' o 'maestros'

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />
      <View style={styles.tabs}>
        {salas.map((g, idx) => (
          <TouchableOpacity
            key={g.label}
            style={[styles.tab, grupoActivo === idx && styles.tabActive, grupoActivo === idx && { shadowColor: '#FFA751', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }]}
            onPress={() => setGrupoActivo(idx)}
          >
            <Text style={[styles.tabText, grupoActivo === idx && styles.tabTextActive]}>{g.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          <View style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={styles.titulo}>Asistencia</Text>
            <TouchableOpacity
              style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, backgroundColor: '#FFA751' }}
              onPress={() => setVista(vista === 'ninos' ? 'maestros' : 'ninos')}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{vista === 'ninos' ? 'Ver Maestros' : 'Ver Niños'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 1, backgroundColor: '#FFE259', marginVertical: 8, opacity: 0.5 }} />
          <View style={styles.fechaRow }>
            <Ionicons name="calendar-outline" size={22} color="#222" style={{ marginRight: 8 }} />
            <Text style={styles.fecha}>{getFechaHoy()}</Text>
          </View>
          <View style={{ marginTop: 24 }}>
            {vista === 'ninos' ? (
              <AsistenciaNinos grupoActivo={grupoActivo} />
            ) : (
              <AsistenciaMaestros grupoActivo={grupoActivo} />
            )}
          </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#FFA751',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTitle: {
    color: '#222',
    fontSize: 16,
    letterSpacing: 3,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  headerSubtitle: {
    color: '#222',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'cursive',
    marginTop: -4,
    letterSpacing: 1,
    textShadowColor: '#fff7',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#FFE259',
    marginBottom: 2,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 2,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#FFE259',
    borderColor: '#FFA751',
    shadowColor: '#FFA751',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    color: '#222',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 1,
  },
  tabTextActive: {
    fontWeight: 'bold',
    color: '#FFA751',
  },
  titulo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFA751',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'left',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFA751',
    letterSpacing: 1,
  },
  fechaRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#FFE259',
    opacity: 0.5,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 2,
  },
  fecha: {
    fontSize: 22,
    color: '#222',
  },
  botonPrincipal: {
    backgroundColor: '#FFE259',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  botonPrincipalTexto: {
    color: '#222',
    fontSize: 22,
    fontWeight: 'bold',
  },
  ninoCardBigWrap: {
    marginBottom: 16,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#FFA751',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FFE25933',
  },
  ninoCardBig: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 8,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE259',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFA751',
    shadowColor: '#FFA751',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarText: {
    fontSize: 24,
    color: '#FFA751',
    fontWeight: 'bold',
  },
  ninoNombreBig: {
    fontSize: 20,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 2,
    maxWidth: 200,
  },
  ninoSubInfo: {
    fontSize: 14,
    color: '#888',
    maxWidth: 200,
  },
  asistenciaBtnBig: {
    borderRadius: 20,
    padding: 4,
    backgroundColor: '#fff',
    shadowColor: '#FFA751',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
    marginLeft: 10,
  },
  asistenciaBtn: {
    borderRadius: 20,
    padding: 2,
    backgroundColor: '#fff',
    shadowColor: '#FFA751',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  ninoNombre: {
    fontSize: 18,
    color: '#222',
    fontWeight: '500',
    maxWidth: 180,
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFE259',
    paddingVertical: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 14,
    color: '#222',
    marginTop: 2,
  },
    inputBusqueda: {
      backgroundColor: '#fff',
      borderColor: '#FFA751',
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 16,
      marginRight: 4,
      marginBottom: 0,
      elevation: 1,
    },

    paginacionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 2,
    gap: 8,
  },
  paginacionBtn: {
    backgroundColor: '#FFE259',
    borderRadius: 8,
    padding: 6,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#FFA751',
    opacity: 1,
  },
  paginacionBtnDisabled: {
    opacity: 0.5,
    borderColor: '#ccc',
  },
  paginacionTexto: {
    fontSize: 16,
    color: '#FFA751',
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  paginacionTotal: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 8,
  },

});
