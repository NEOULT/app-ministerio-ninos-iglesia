import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/shared/Header';
import { useAuth } from '../../../context/AuthContext';
import ApiWrapper from '../../../services/ApiWrapper';

const PAGE_SIZE = 10;


export default function NinosScreen({ grupoActivo = 0 }) {
  const { user } = useAuth();
  const [ninos, setNinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNino, setEditingNino] = useState(null);
  const [form, setForm] = useState({ name: '', surname: '', gender: '', birth: '', phone: '' });
  const [pagina, setPagina] = useState(1);
  // Estados para paginación backend
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalNinos, setTotalNinos] = useState(0);
  // Date picker
  const [showDate, setShowDate] = useState(false);
  // Estados para búsqueda
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [busquedaApellido, setBusquedaApellido] = useState("");

  useEffect(() => {
    fetchNinos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grupoActivo, user?.maestro?.service_id, pagina, busquedaNombre, busquedaApellido]);

  const fetchNinos = async () => {
    setLoading(true);
    try {
      const data = await ApiWrapper.buscarNinos({
        nombre: busquedaNombre,
        apellido: busquedaApellido,
        page: pagina,
        limit: PAGE_SIZE,
      });
      setNinos(data?.data || []);
      setTotalPaginas(data?.paginasTotales || 1);
      setTotalNinos(data?.itemsTotales || 0);
    } catch {
      setNinos([]);
      setTotalPaginas(1);
      setTotalNinos(0);
    }
    setLoading(false);
  };

  const handleInput = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = (nino) => {
    setEditingNino(nino);
    setForm({
      name: nino.name || '',
      surname: nino.surname || '',
      gender: nino.gender || '',
      birth: nino.birth || '',
      phone: nino.phone || '',
    });
  };

  const handleCancel = () => {
    setEditingNino(null);
    setForm({ name: '', surname: '', gender: '', birth: '', phone: '' });
  };

  // Validación de teléfono: 10 dígitos, empieza en 4
  const isValidPhone = phone => /^4\d{9}$/.test(phone);

  const handleSubmit = async () => { 
    if (!form.name || !form.surname || !form.gender || !form.birth) {
      Alert.alert('Campos requeridos', 'Completa todos los campos obligatorios.');
      return;
    }
    if ((form.phone) && !isValidPhone(form.phone)) {
      Alert.alert('Teléfono inválido', 'El teléfono debe tener 10 dígitos y comenzar con 4 (ej: 4146012563).');
      return;
    }
    try {
      if (editingNino) {
        await ApiWrapper.updateNino(editingNino.kids_id, form);
        Alert.alert('Actualizado', 'Niño actualizado correctamente.');
      } else {
        await ApiWrapper.insertNino(form);
        Alert.alert('Añadido', 'Niño añadido correctamente.');
      }
      handleCancel();
      fetchNinos();
    } catch {
      Alert.alert('Error', 'No se pudo guardar el niño.');
    }
  };

  // Date picker handler
  const onChangeDate = (event, selectedDate) => {
    setShowDate(false);
    if (selectedDate) {
      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      handleInput('birth', `${yyyy}-${mm}-${dd}`);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>{editingNino ? 'Editar Niño' : 'Añadir Niño'}</Text>
        <View style={styles.form}>
          <TextInput
            placeholder="Nombre"
            value={form.name}
            onChangeText={v => handleInput('name', v)}
            style={styles.input}
          />
          <TextInput
            placeholder="Apellido"
            value={form.surname}
            onChangeText={v => handleInput('surname', v)}
            style={styles.input}
          />
          {/* Select de género */}
          <View style={styles.selectWrap}>
            <TouchableOpacity
              style={[
                styles.selectOption,
                form.gender === 'M' && styles.selectOptionActive,
              ]}
              onPress={() => handleInput('gender', 'M')}
            >
              <Text style={[
                styles.selectOptionText,
                form.gender === 'M' && styles.selectOptionTextActive,
              ]}>Masculino</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectOption,
                form.gender === 'F' && styles.selectOptionActive,
              ]}
              onPress={() => handleInput('gender', 'F')}
            >
              <Text style={[
                styles.selectOptionText,
                form.gender === 'F' && styles.selectOptionTextActive,
              ]}>Femenino</Text>
            </TouchableOpacity>
          </View>
          {/* Fecha de nacimiento */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDate(true)}
            activeOpacity={0.7}
          >
            <Text style={{ color: form.birth ? '#222' : '#888' }}>
              {form.birth ? form.birth : 'Fecha de nacimiento (YYYY-MM-DD)'}
            </Text>
          </TouchableOpacity>
          {showDate && (
            <DateTimePicker
              value={form.birth ? new Date(form.birth) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          )}
          <TextInput
            placeholder="Teléfono (ej: 4146012563)"
            value={form.phone}
            onChangeText={v => handleInput('phone', v.replace(/[^0-9]/g, ''))}
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={10}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{editingNino ? "Actualizar" : "Añadir"}</Text>
          </TouchableOpacity>
          {editingNino && (
            <TouchableOpacity onPress={handleCancel} style={{ marginTop: 8 }}>
              <Text style={{ color: '#FFA751', textAlign: 'center' }}>Cancelar edición</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.sectionTitle}>Lista de Niños</Text>
        {/* Inputs de búsqueda */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <TextInput
            style={{ backgroundColor: '#fff', borderColor: '#FFA751', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, fontSize: 16, flex: 1, minWidth: 120, marginRight: 4 }}
            placeholder="Buscar nombre"
            value={busquedaNombre}
            onChangeText={setBusquedaNombre}
            returnKeyType="search"
            clearButtonMode="while-editing"
            maxLength={20}
          />
          <TextInput
            style={{ backgroundColor: '#fff', borderColor: '#FFA751', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, fontSize: 16, flex: 1, minWidth: 120, marginRight: 4 }}
            placeholder="Buscar apellido"
            value={busquedaApellido}
            onChangeText={setBusquedaApellido}
            returnKeyType="search"
            clearButtonMode="while-editing"
            maxLength={20}
          />
        </View>
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Cargando...</Text>
        ) : ninos.length === 0 ? (
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
          ninos.map(item => (
            <TouchableOpacity
              key={item.kid_id?.toString() || item.kids_id?.toString() || (item.name + item.surname)}
              style={styles.card}
              onPress={() => handleEdit(item)}
            >
              <Ionicons name="person-circle-outline" size={32} color="#FFA751" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.ninoName}>{item.name} {item.surname}</Text>
                <Text style={styles.ninoSala}>
                  Género: {item.gender} | Nac: {item.birth} | Tel: {item.phone}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        <Text style={styles.sectionTitle}>Navegación de Páginas</Text>
        <View style={styles.paginacionWrap}>
          <TouchableOpacity
            style={[styles.paginacionBtn, pagina === 1 && styles.paginacionBtnDisabled]}
            onPress={() => setPagina(p => Math.max(1, p - 1))}
            disabled={pagina === 1}
          >
            <Ionicons name="chevron-back" size={22} color={pagina === 1 ? '#ccc' : '#FFA751'} />
          </TouchableOpacity>
          <Text style={styles.paginacionTexto}>
            Página {pagina} de {totalPaginas}
          </Text>
          <TouchableOpacity
            style={[styles.paginacionBtn, pagina === totalPaginas && styles.paginacionBtnDisabled]}
            onPress={() => setPagina(p => Math.min(totalPaginas, p + 1))}
            disabled={pagina === totalPaginas}
          >
            <Ionicons name="chevron-forward" size={22} color={pagina === totalPaginas ? '#ccc' : '#FFA751'} />
          </TouchableOpacity>
        </View>
        <Text style={styles.paginacionTotal}>{totalNinos} niños en total</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFA751',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
    color: '#FFA751',
    letterSpacing: 1,
    textAlign: 'center',
  },
  form: {
    marginBottom: 18,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    elevation: 3,
    shadowColor: '#FFA751',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE25933',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFA751',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    elevation: 1,
  },
  selectWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  selectOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FFA751',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  selectOptionActive: {
    backgroundColor: '#FFA751',
  },
  selectOptionText: {
    color: '#FFA751',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectOptionTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#FFA751',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 2,
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#FFA751',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE25933',
  },
  ninoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
    maxWidth: 200,
  },
  ninoSala: {
    fontSize: 14,
    color: '#888',
    maxWidth: 200,
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