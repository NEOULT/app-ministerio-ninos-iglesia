import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ApiWrapper from '../services/ApiWrapper';

export default function AsistenciaNinos({ grupoActivo }) {
  const [listaNinos, setListaNinos] = useState([]);
  const [paginaNinos, setPaginaNinos] = useState(1);
  const [paginasTotalesNinos, setPaginasTotalesNinos] = useState(1);
  const [itemsTotalesNinos, setItemsTotalesNinos] = useState(0);
  const [loadingNinos, setLoadingNinos] = useState(true);
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [busquedaApellido, setBusquedaApellido] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoadingNinos(true);
      try {
        const ninosResp = await ApiWrapper.buscarNinos({
          nombre: busquedaNombre,
          apellido: busquedaApellido,
          sala: grupoActivo + 1,
          page: paginaNinos,
          limit: 10
        });
        if (ninosResp && typeof ninosResp === 'object') {
          setListaNinos(Array.isArray(ninosResp.data) ? ninosResp.data : []);
          setPaginasTotalesNinos(Number(ninosResp.paginasTotales) || 1);
          setItemsTotalesNinos(Number(ninosResp.itemsTotales) || 0);
        } else {
          setListaNinos([]);
          setPaginasTotalesNinos(1);
          setItemsTotalesNinos(0);
        }
      } catch {
        setListaNinos([]);
        setPaginasTotalesNinos(1);
        setItemsTotalesNinos(0);
      } finally {
        setLoadingNinos(false);
      }
    };
    fetchData();
  }, [grupoActivo, busquedaNombre, busquedaApellido, paginaNinos]);

  const marcarAsistenciaNino = (index) => {
    setListaNinos(prev =>
      prev.map((n, i) => (i === index ? { ...n, asistio: !n.asistio } : n))
    );
  };

  return (
    <View>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#FFA751', marginBottom: 8 }}>Niños</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <TextInput
          style={{ backgroundColor: '#fff', borderColor: '#FFA751', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, fontSize: 16, flex: 1, minWidth: 120, marginRight: 4 }}
          placeholder="Nombre"
          value={busquedaNombre}
          onChangeText={setBusquedaNombre}
          returnKeyType="search"
          clearButtonMode="while-editing"
          maxLength={20}
        />
        <TextInput
          style={{ backgroundColor: '#fff', borderColor: '#FFA751', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, fontSize: 16, flex: 1, minWidth: 120, marginRight: 4 }}
          placeholder="Apellido"
          value={busquedaApellido}
          onChangeText={setBusquedaApellido}
          returnKeyType="search"
          clearButtonMode="while-editing"
          maxLength={20}
        />
      </View>
      {loadingNinos ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Ionicons name="hourglass-outline" size={36} color="#FFA751" style={{ marginBottom: 8 }} />
          <Text style={{
            color: '#FFA751',
            fontSize: 18,
            fontWeight: 'bold',
            opacity: 0.85,
            textAlign: 'center'
          }}>
            Cargando niños...
          </Text>
        </View>
      ) : listaNinos.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Ionicons name="sad-outline" size={36} color="#FFA751" style={{ marginBottom: 8 }} />
          <Text style={{
            color: '#FFA751',
            fontSize: 18,
            fontWeight: 'bold',
            opacity: 0.85,
            textAlign: 'center'
          }}>
            No hay niños registrados.
          </Text>
        </View>
      ) : (
        <>
          {Array.isArray(listaNinos) && listaNinos.map((nino, idx) => {
            const key = String(nino.kids_id ?? idx);
            const nombreCompleto = (nino.name && nino.surname) ? `${nino.name} ${nino.surname}` : nino.name || nino.nombre || 'Sin nombre';
            const inicial = (nino.name || nino.nombre || '?').charAt(0).toUpperCase();
            return (
              <View key={key} style={{ marginBottom: 16, borderRadius: 18, overflow: 'hidden', backgroundColor: '#fff', shadowColor: '#FFA751', shadowOpacity: 0.10, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#FFE25933', flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 18, gap: 8 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFE259', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFA751', shadowColor: '#FFA751', shadowOpacity: 0.10, shadowRadius: 4, elevation: 2 }}>
                  <Text style={{ fontSize: 24, color: '#FFA751', fontWeight: 'bold' }}>{inicial}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={{ fontSize: 20, color: '#222', fontWeight: 'bold', marginBottom: 2, maxWidth: 200 }} numberOfLines={1} ellipsizeMode="tail">{nombreCompleto}</Text>
                  <Text style={{ fontSize: 14, color: '#888', maxWidth: 200 }}>{nino.surname || ''}</Text>
                </View>
                <TouchableOpacity onPress={() => marcarAsistenciaNino(idx)} style={{ borderRadius: 20, padding: 4, backgroundColor: '#fff', shadowColor: '#FFA751', shadowOpacity: 0.12, shadowRadius: 6, elevation: 2, marginLeft: 10 }}>
                  <Ionicons
                    name={nino.asistio ? 'checkmark-circle' : 'close-circle-outline'}
                    size={32}
                    color={nino.asistio ? '#4CAF50' : '#F44336'}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
          {/* Paginación */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8, marginBottom: 2, gap: 8 }}>
            <TouchableOpacity
              style={{ backgroundColor: '#FFE259', borderRadius: 8, padding: 6, marginHorizontal: 4, borderWidth: 1, borderColor: '#FFA751', opacity: paginaNinos <= 1 ? 0.5 : 1 }}
              onPress={() => setPaginaNinos(p => Math.max(1, p - 1))}
              disabled={paginaNinos <= 1}
            >
              <Ionicons name="chevron-back" size={22} color={paginaNinos <= 1 ? '#ccc' : '#FFA751'} />
            </TouchableOpacity>
            <Text style={{ fontSize: 16, color: '#FFA751', fontWeight: 'bold', marginHorizontal: 8 }}>
              Página {paginaNinos} de {paginasTotalesNinos}
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: '#FFE259', borderRadius: 8, padding: 6, marginHorizontal: 4, borderWidth: 1, borderColor: '#FFA751', opacity: paginaNinos >= paginasTotalesNinos ? 0.5 : 1 }}
              onPress={() => setPaginaNinos(p => Math.min(paginasTotalesNinos, p + 1))}
              disabled={paginaNinos >= paginasTotalesNinos}
            >
              <Ionicons name="chevron-forward" size={22} color={paginaNinos >= paginasTotalesNinos ? '#ccc' : '#FFA751'} />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 13, color: '#888', textAlign: 'center', marginTop: 2, marginBottom: 8 }}>{itemsTotalesNinos} niños encontrados</Text>
        </>
      )}
    </View>
  );
}
