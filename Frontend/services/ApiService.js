// Servicio base para peticiones HTTP
import { Alert } from 'react-native';

const BASE_URL = 'https://asistencia-iglesia.onrender.com/api'; // Cambia esto por la URL de tu backend

export default class ApiService {
  static async request(endpoint, method = 'GET', data = null, headers = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Error en la petición');
      }
      return response.json();
    } catch (err) {
      Alert.alert('Tenemos un retardo en el servidor', 'Sea paciente y espere unos minutos');
      throw err;
    }
  }
}
