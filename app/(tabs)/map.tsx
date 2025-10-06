// app/(tabs)/map.tsx
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import GaodeMap from '../../components/GaodeWebMap';
import { initialPortals } from '../../data/portalData';

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [portals] = useState(initialPortals);

  useEffect(() => {
    (async () => {
      try {
        // 请求位置权限
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('需要位置权限', '请允许位置权限以使用地图功能');
          return;
        }

        // 获取当前位置
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      } catch (error) {
        console.error('获取位置失败:', error);
        Alert.alert('位置服务错误', '无法获取当前位置信息');
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <GaodeMap portals={portals} userLocation={userLocation || undefined} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});