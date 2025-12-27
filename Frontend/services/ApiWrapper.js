import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from './ApiService';

const ApiWrapper = {

  // Login de usuario, almacena la sesión localmente
  login: async (username, password) => {
    const res = await ApiService.request('/users/auth', 'POST', { username, password });
    if (res && res.data) {
      await AsyncStorage.setItem('userSession', JSON.stringify(res.data));
    }
    return res.data;
  },

  // Users
  insertUser: async (userData) => {
    const res = await ApiService.request('/users', 'POST', userData);
    return res.data;
  },

  // Ejemplo: obtener lista de niños
  getNinos: async () => {
    const res = await ApiService.request('/kids');
    return res.data;
  },

  insertNino: async (ninoData) => {
    const body = {
    name: ninoData.name,
    surname: ninoData.surname,
    birth: ninoData.birth,
    gender: ninoData.gender,
    ...(ninoData.phone ? { phone: ninoData.phone } : {})
  };
  
  const res = await ApiService.request('/kids', 'POST', body);
  return res.data;
  },

  //Niños
  updateNino: async (id, ninoData) => {
  // Construir el body solo con los campos necesarios
  const body = {
    kids_id: id,
    name: ninoData.name,
    surname: ninoData.surname,
    birth: ninoData.birth,
    ...(ninoData.phone ? { phone: ninoData.phone } : {})
  };
  const res = await ApiService.request('/kids', 'PUT', body);
  return res.data;
},

  // Buscar niños por nombre o apellido (o ambos)
  buscarNinos: async ({ nombre, apellido, sala, page = 1, limit = 10 }) => {
    // Construir query string dinámicamente
    console.log("sdasd",sala);
    
    const params = [];
    if (nombre) params.push(`nombre=${encodeURIComponent(nombre)}`);
    if (apellido) params.push(`apellido=${encodeURIComponent(apellido)}`);
    if (sala) params.push(`room_id=${encodeURIComponent(sala)}`);
    if (page) params.push(`page=${page}`);
    if (limit) params.push(`limit=${limit}`);
    const query = params.length ? `?${params.join('&')}` : '';
    const res = await ApiService.request(`/kids/room${query}`);
    return res.data || res;  
  },

  getNiñosBySala: async (sala) => {
    const res = await ApiService.request(`/kids/sala/?sala=${(sala)}`);
    return res.data;
  },


  // Obtener maestros por sala (nuevo endpoint)
  getMaestrosBySala: async (salaIds, serviceId) => {
    // salaIds puede ser string o array
    let param = Array.isArray(salaIds) ? salaIds.join(',') : salaIds;
    const res = await ApiService.request(`/masters/by-sala?sala_id=${encodeURIComponent(param)}&service_id=${encodeURIComponent(serviceId)}`);
    return res.data;
  },

  // Ejemplo: obtener lista de maestros
  getMaestros: async () => {
    const res = await ApiService.request('/masters');
    return res.data;
  },

  // Puedes agregar más métodos según tus endpoints
};

export default ApiWrapper;
