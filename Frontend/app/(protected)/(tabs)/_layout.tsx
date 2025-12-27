import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';

export default function TabLayout() {
  const { height } = useWindowDimensions();
  const tabBarHeight = Math.round(height * 0.07); // 10% de la altura de pantalla

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFE259' }} edges={['bottom', 'left', 'right']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFE259',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            height: tabBarHeight,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            elevation: 0, // Android: elimina sombra
            shadowColor: 'transparent', // iOS: elimina sombra
            borderTopWidth: 0, // elimina línea superior
          },
          tabBarLabelStyle: {
            color: '#222',
            fontSize: 14,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
          tabBarActiveTintColor: '#222',
          tabBarInactiveTintColor: '#222',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="ninos"
          options={{
            title: 'Niños',
            tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="reportes"
          options={{
            title: 'Reportes',
            tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="configuracion"
          options={{
            title: 'Configuración',
            tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}