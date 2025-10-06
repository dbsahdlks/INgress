// app/(tabs)/index.tsx
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { initialPortals, Portal } from '../../data/portalData'; // 你的正确路径

export default function TabOneScreen() {
  const [player, setPlayer] = useState({
    name: '新特工',
    level: 1,
    ap: 0,
    xm: 1000,
    faction: null as string | null,
    location: { latitude: 39.9042, longitude: 116.4074 }
  });

  const [portals, setPortals] = useState<Portal[]>(initialPortals || []); // 添加 fallback
  const [showFactionSelect, setShowFactionSelect] = useState(true);

  // 获取位置权限
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('需要位置权限', '请允许位置权限以使用地图功能');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setPlayer(prev => ({
        ...prev,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
      }));
    })();
  }, []);

  // 选择阵营
  const selectFaction = (faction: string) => {
    setPlayer(prev => ({ ...prev, faction }));
    setShowFactionSelect(false);
    Alert.alert('欢迎！', `你已加入${faction === 'RESISTANCE' ? '抵抗军' : '启蒙军'}`, [
      { text: '开始游戏', style: 'default' }
    ]);
  };

  // 处理门泉点击 - 使用正确的路由跳转
  const handlePortalPress = (portal: Portal) => {
    router.push({ pathname: '/portal/[id]', params: { id: portal.id.toString() } });
  };

  // 获取门泉颜色
  const getPortalColor = (portal: Portal) => {
    if (!portal.owner) return '#FFD700';
    return portal.faction === 'RESISTANCE' ? '#1E90FF' : '#32CD32';
  };

  // 获取门泉状态文本
  const getPortalStatus = (portal: Portal) => {
    if (!portal.owner) return '中立';
    return portal.faction === 'RESISTANCE' ? '抵抗军控制' : '启蒙军控制';
  };

  return (
    <View style={styles.container}>
      {/* 阵营选择模态框 */}
      <Modal visible={showFactionSelect} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>选择你的阵营</Text>
            <Text style={styles.modalSubtitle}>这将决定你的游戏旅程</Text>
            
            <TouchableOpacity 
              style={[styles.factionButton, { backgroundColor: '#1E90FF' }]}
              onPress={() => selectFaction('RESISTANCE')}
            >
              <Text style={styles.factionButtonText}>抵抗军 (蓝色)</Text>
              <Text style={styles.factionDesc}>保护人类自由意志</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.factionButton, { backgroundColor: '#32CD32' }]}
              onPress={() => selectFaction('ENLIGHTENED')}
            >
              <Text style={styles.factionButtonText}>启蒙军 (绿色)</Text>
              <Text style={styles.factionDesc}>追求人类进化</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 玩家信息面板 */}
      <View style={[
        styles.playerInfo, 
        { backgroundColor: player.faction ? (player.faction === 'RESISTANCE' ? '#1E3A8A' : '#166534') : '#333' }
      ]}>
        <View style={styles.playerHeader}>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.level}>Lv.{player.level}</Text>
        </View>
        <View style={styles.playerStats}>
          <Text style={styles.ap}>AP: {player.ap}</Text>
          <Text style={styles.xm}>XM: {player.xm}/1000</Text>
        </View>
        {player.faction && (
          <View style={[
            styles.factionBadge, 
            { backgroundColor: player.faction === 'RESISTANCE' ? '#1E90FF' : '#32CD32' }
          ]}>
            <Text style={styles.factionBadgeText}>
              {player.faction === 'RESISTANCE' ? '抵抗军' : '启蒙军'}
            </Text>
          </View>
        )}
      </View>

      {/* 门泉列表区域 */}
      <View style={styles.portalArea}>
        <Text style={styles.areaTitle}>🚀 iNgress 门泉列表</Text>
        <Text style={styles.areaSubtitle}>点击门泉进行交互</Text>
        
        <ScrollView style={styles.portalList} contentContainerStyle={styles.portalListContent}>
          {portals.map(portal => (
            <TouchableOpacity 
              key={portal.id}
              style={[styles.portalItem, { borderLeftColor: getPortalColor(portal) }]}
              onPress={() => handlePortalPress(portal)}
            >
              <View style={styles.portalHeader}>
                <Text style={styles.portalName}>{portal.name}</Text>
                <Text style={styles.portalLevel}>等级 {portal.level}</Text>
              </View>
              <View style={styles.portalDetails}>
                <Text style={[styles.portalStatus, { color: getPortalColor(portal) }]}>
                  {getPortalStatus(portal)}
                </Text>
                <Text style={styles.portalDistance}>距离: {(Math.random() * 500).toFixed(0)}米</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

// 样式代码保持不变...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  // 玩家信息面板样式
  playerInfo: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  level: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  playerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ap: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  xm: {
    color: '#00FFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  factionBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  factionBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // 门泉区域样式
  portalArea: {
    flex: 1,
    padding: 15,
    backgroundColor: '#1a1a1a',
  },
  areaTitle: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  areaSubtitle: {
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  portalList: {
    flex: 1,
  },
  portalListContent: {
    paddingBottom: 20,
  },
  portalItem: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  portalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  portalName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  portalLevel: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  portalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  portalStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  portalDistance: {
    color: '#ccc',
    fontSize: 12,
  },
  // 模态框样式
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
  },
  factionButton: {
    padding: 18,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  factionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  factionDesc: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
    opacity: 0.9,
  },
});