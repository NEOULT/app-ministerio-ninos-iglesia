import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login, loading, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/(protected)');
    }
  }, [user, router]);

  const handleLogin = async () => {
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
    } catch (e) {
      console.log(e);
      setError('Usuario o contraseña incorrectos');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#FFA751" /></View>;
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#fffbe6", "#ffe259", "#ffa751"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <TextInput
          style={[styles.input, { color: '#333' }]}
          placeholder="Usuario"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, { color: '#333' }]}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={submitting}>
          <Text style={styles.buttonText}>{submitting ? 'Ingresando...' : 'Entrar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFA751',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: '#FFA751',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#FFA751',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  error: {
    color: '#F44336',
    marginBottom: 8,
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
