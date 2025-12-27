import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ApiWrapper from '../services/ApiWrapper';
import { useAuth } from '../context/AuthContext';

export default function AsistenciaMaestros({ grupoActivo }) {
  const [listaMaestros, setListaMaestros] = useState([]);
  const [loadingMaestros, setLoadingMaestros] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    console.log(grupoActivo);
    
    const fetchData = async () => {
      setLoadingMaestros(true);
      try {
        // grupoActivo empieza en 0, pero las salas en backend empiezan en 1
        const salaId = (parseInt(grupoActivo, 10) + 1).toString();
        const maestros = await ApiWrapper.getMaestrosBySala(salaId,user.maestro.service_id);
        setListaMaestros(maestros);
      } catch {
        setListaMaestros([]);
      } finally {
        setLoadingMaestros(false);
      }
    };
    fetchData();
  }, [grupoActivo, user.maestro.service_id]);

  const marcarAsistenciaMaestro = (index) => {
    setListaMaestros(prev =>
      prev.map((m, i) => (i === index ? { ...m, asistio: !m.asistio } : m))
    );
  };

  return (
    <View>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#FFA751', marginBottom: 8 }}>Maestros</Text>
      {loadingMaestros ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Ionicons name="hourglass-outline" size={36} color="#FFA751" style={{ marginBottom: 8 }} />
          <Text style={{
            color: '#FFA751',
            fontSize: 18,
            fontWeight: 'bold',
            opacity: 0.85,
            textAlign: 'center'
          }}>
            Cargando maestros...
          </Text>
        </View>
      ) : listaMaestros.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Ionicons name="sad-outline" size={36} color="#FFA751" style={{ marginBottom: 8 }} />
          <Text style={{
            color: '#FFA751',
            fontSize: 18,
            fontWeight: 'bold',
            opacity: 0.85,
            textAlign: 'center'
          }}>
            No hay maestros registrados.
          </Text>
        </View>
      ) : (
        <ScrollView style={{ maxHeight: 440 }} showsVerticalScrollIndicator={true}>
          {listaMaestros.map((maestro, idx) => {
            const key = String(maestro.master_id ?? idx);
            const nombreCompleto = (maestro.name && maestro.surname) ? `${maestro.name} ${maestro.surname}` : maestro.name || maestro.nombre || 'Sin nombre';
            const inicial = (maestro.name || maestro.nombre || '?').charAt(0).toUpperCase();
            return (
              <View key={key} style={{ marginBottom: 16, borderRadius: 18, overflow: 'hidden', backgroundColor: '#fff', shadowColor: '#FFA751', shadowOpacity: 0.10, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#FFE25933', flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 18, gap: 8 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFE259', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFA751', shadowColor: '#FFA751', shadowOpacity: 0.10, shadowRadius: 4, elevation: 2 }}>
                  <Text style={{ fontSize: 24, color: '#FFA751', fontWeight: 'bold' }}>{inicial}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={{ fontSize: 20, color: '#222', fontWeight: 'bold', marginBottom: 2, maxWidth: 200 }} numberOfLines={1} ellipsizeMode="tail">{nombreCompleto}</Text>
                  <Text style={{ fontSize: 14, color: '#888', maxWidth: 200 }}>{maestro.surname || ''}</Text>
                </View>
                <TouchableOpacity onPress={() => marcarAsistenciaMaestro(idx)} style={{ borderRadius: 20, padding: 4, backgroundColor: '#fff', shadowColor: '#FFA751', shadowOpacity: 0.12, shadowRadius: 6, elevation: 2, marginLeft: 10 }}>
                  <Ionicons
                    name={maestro.asistio ? 'checkmark-circle' : 'close-circle-outline'}
                    size={32}
                    color={maestro.asistio ? '#4CAF50' : '#F44336'}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
