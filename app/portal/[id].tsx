// app/portal/[id].tsx
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { initialPortals } from '../../data/portalData';

export default function PortalDetailScreen() {
  const { id } = useLocalSearchParams();
  const portal = initialPortals.find(p => p.id === parseInt(id as string));

  // 这里应该从全局状态获取，暂时用假数据
  const [player] = React.useState({
    name: '新特工',
    level: 1,
    faction: 'RESISTANCE' as string | null,
  });

  const [currentPortal, setCurrentPortal] = React.useState(portal);

  if (!currentPortal) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>门泉不存在</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>返回</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = () => {
    if (!player.faction) {
      Alert.alert('请先选择阵营', '你需要先选择抵抗军或启蒙军才能占领门泉');
      return;
    }

    // 更新门泉状态
    setCurrentPortal(prev => prev ? {
      ...prev,
      owner: player.name,
      faction: player.faction
    } : prev);

    Alert.alert('成功', '门泉占领成功！获得125AP');
    
    // 可以在这里添加AP奖励逻辑
    // 然后延迟返回上一页
    setTimeout(() => {
      router.back();
    }, 1500);
  };

  const getPortalColor = () => {
    if (!currentPortal.owner) return '#FFD700'; // 金色 - 中立
    return currentPortal.faction === 'RESISTANCE' ? '#1E90FF' : '#32CD32';
  };

  const getPortalStatus = () => {
    if (!currentPortal.owner) return '中立';
    return currentPortal.faction === 'RESISTANCE' ? '抵抗军控制' : '启蒙军控制';
  };

  return (
    <ScrollView style={styles.container}>
      {/* 头部信息 */}
      <View style={[styles.header, { borderLeftColor: getPortalColor() }]}>
        <Text style={styles.portalName}>{currentPortal.name}</Text>
        <View style={styles.basicInfo}>
          <Text style={styles.status}>{getPortalStatus()}</Text>
          <Text style={styles.level}>等级: {currentPortal.level}</Text>
          <Text style={styles.distance}>距离: {(Math.random() * 500).toFixed(0)}米</Text>
        </View>
      </View>

      {/* 操作区域 */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>操作</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.hackButton]}
            onPress={() => Alert.alert('入侵', '执行入侵操作')}
          >
            <Text style={styles.actionButtonText}>入侵</Text>
          </TouchableOpacity>
          
          {!currentPortal.owner && (
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                styles.captureButton,
                { backgroundColor: player.faction === 'RESISTANCE' ? '#1E90FF' : '#32CD32' }
              ]}
              onPress={handleCapture}
            >
              <Text style={styles.actionButtonText}>占领门泉</Text>
            </TouchableOpacity>
          )}
          
          {currentPortal.owner && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.attackButton]}
              onPress={() => Alert.alert('攻击', '执行攻击操作')}
            >
              <Text style={styles.actionButtonText}>攻击</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 详细信息 */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>详细信息</Text>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>所有者:</Text>
          <Text style={styles.detailValue}>
            {currentPortal.owner || '无'}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>阵营:</Text>
          <Text style={styles.detailValue}>
            {currentPortal.faction ? 
              (currentPortal.faction === 'RESISTANCE' ? '抵抗军' : '启蒙军') : 
              '中立'
            }
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>能量:</Text>
          <Text style={styles.detailValue}>{currentPortal.energy}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>谐振器:</Text>
          <Text style={styles.detailValue}>
            {currentPortal.resonators?.length || 0} / 8
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>MODs:</Text>
          <Text style={styles.detailValue}>
            {currentPortal.mods?.length || 0} / 4
          </Text>
        </View>
      </View>

      {/* 返回按钮 */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>返回门泉列表</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    borderLeftWidth: 6,
  },
  portalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  basicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  status: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  level: {
    color: '#1E90FF',
    fontSize: 16,
  },
  distance: {
    color: '#32CD32',
    fontSize: 16,
  },
  actionsSection: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  hackButton: {
    backgroundColor: '#ff9800',
  },
  captureButton: {
    backgroundColor: '#4caf50',
  },
  attackButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  detailsSection: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  detailLabel: {
    color: '#ccc',
    fontSize: 16,
  },
  detailValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#333',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});