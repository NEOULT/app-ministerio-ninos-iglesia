import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { logout } = useAuth();
  return (
    <LinearGradient
      colors={['#FFE259', '#FFA751']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerRow}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>IGLESIA CRISTIANA</Text>
          <Text style={styles.headerSubtitle}>Filadelfia</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
  logoutBtn: {
    padding: 6,
    borderRadius: 20,
    elevation: 2,
    position: 'relative',
    zIndex: 10,
    top: -30,
  },
});