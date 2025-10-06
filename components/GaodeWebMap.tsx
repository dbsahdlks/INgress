// components/GaodeWebMap.tsx - 增强错误诊断版本
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

interface Portal {
  id: number;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  level: number;
  faction: string | null;
}

interface GaodeWebMapProps {
  portals: Portal[];
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

export default function GaodeWebMap({ portals, userLocation }: GaodeWebMapProps) {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webViewLoaded, setWebViewLoaded] = useState(false);

  // 替换为你的真实 API 密钥
  const AMAP_API_KEY = 'e7c6e115cae0add856da5fe78f72041d';

  // 生成测试 HTML（不依赖高德API）
  const generateTestHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>测试页面</title>
          <style>
            body, html { 
              margin: 0; 
              padding: 20px; 
              width: 100%; 
              height: 100%; 
              font-family: Arial, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
            }
            .status {
              background: rgba(255,255,255,0.2);
              padding: 20px;
              border-radius: 10px;
              margin: 10px;
            }
          </style>
      </head>
      <body>
          <h1>🚀 WebView 测试页面</h1>
          <div class="status">
            <h3>WebView 状态：正常 ✅</h3>
            <p>如果看到这个页面，说明 WebView 工作正常</p>
          </div>
          <div class="status">
            <h3>网络连接：正常 ✅</h3>
            <p>WebView 可以加载网络内容</p>
          </div>
          <div class="status">
            <h3>JavaScript：正常 ✅</h3>
            <p>JavaScript 执行正常</p>
          </div>
          <script>
            // 向 React Native 发送成功消息
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage('WebView加载成功');
            }
            
            // 测试 JavaScript 执行
            console.log('WebView JavaScript 执行正常');
          </script>
      </body>
      </html>
    `;
  };

  // 生成高德地图 HTML
  const generateMapHTML = () => {
    const portalsScript = portals.map(portal => {
      const color = portal.faction ? 
        (portal.faction === 'RESISTANCE' ? '#1E90FF' : '#32CD32') : '#FFD700';
      
      return `
        new AMap.Marker({
          position: [${portal.location.longitude}, ${portal.location.latitude}],
          title: '${portal.name}',
          content: '<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${portal.level}</div>',
          offset: new AMap.Pixel(-12, -12)
        }).setMap(map);
      `;
    }).join('');

    const userLocationScript = userLocation ? `
      new AMap.Marker({
        position: [${userLocation.longitude}, ${userLocation.latitude}],
        title: '我的位置',
        content: '<div style="background-color: #FF0000; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        offset: new AMap.Pixel(-8, -8)
      }).setMap(map);
      
      map.setCenter([${userLocation.longitude}, ${userLocation.latitude}]);
      map.setZoom(15);
    ` : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>高德地图</title>
          <style>
            body, html, #container { 
              margin: 0; 
              padding: 0; 
              width: 100%; 
              height: 100%; 
              font-family: Arial, sans-serif;
            }
            .loading {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
              font-size: 16px;
              color: #666;
              flex-direction: column;
            }
            .error {
              color: red;
              text-align: center;
              padding: 20px;
              background: #ffe6e6;
              border: 1px solid red;
              margin: 10px;
              border-radius: 5px;
            }
          </style>
          <script src="https://webapi.amap.com/maps?v=2.0&key=${AMAP_API_KEY}"></script>
      </head>
      <body>
          <div id="container">
            <div class="loading">
              <div>高德地图加载中...</div>
              <div style="font-size: 12px; margin-top: 10px; color: #999;" id="status">初始化中</div>
            </div>
          </div>
          <script>
            console.log('开始加载高德地图 API...');
            document.getElementById('status').innerText = '加载高德地图 API...';
            
            let mapLoadTimeout = setTimeout(() => {
              document.getElementById('status').innerText = '地图加载超时，请检查网络和API密钥';
            }, 10000);
            
            window.onLoad = function() {
              clearTimeout(mapLoadTimeout);
              document.querySelector('.loading').style.display = 'none';
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage('高德地图加载成功');
              }
            };
            
            window.onError = function(errorMsg) {
              clearTimeout(mapLoadTimeout);
              var container = document.getElementById('container');
              container.innerHTML = '<div class="error">高德地图加载失败: ' + errorMsg + '</div>';
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage('高德地图错误: ' + errorMsg);
              }
            };
            
            try {
              console.log('创建高德地图实例...');
              document.getElementById('status').innerText = '创建地图实例...';
              
              var map = new AMap.Map('container', {
                  zoom: 13,
                  center: [116.397428, 39.90923],
                  viewMode: '3D',
                  mapStyle: 'amap://styles/normal'
              });
              
              console.log('地图实例创建成功');
              document.getElementById('status').innerText = '地图创建成功，加载资源...';
              
              map.on('complete', function() {
                console.log('地图资源加载完成');
                window.onLoad();
              });
              
              // 添加门泉标记
              ${portalsScript}
              
              // 添加用户位置
              ${userLocationScript}
              
            } catch (error) {
              console.error('地图初始化错误:', error);
              window.onError(error.message);
            }
          </script>
      </body>
      </html>
    `;
  };

  const [useTestMode, setUseTestMode] = useState(false);

  return (
    <View style={styles.container}>
      {/* 调试控制面板 */}
      <View style={styles.debugPanel}>
        <Button 
          title={useTestMode ? "切换到地图模式" : "切换到测试模式"} 
          onPress={() => setUseTestMode(!useTestMode)}
          color="#007AFF"
        />
        <Text style={styles.debugText}>
          模式: {useTestMode ? "测试" : "地图"} | 
          WebView: {webViewLoaded ? "✅" : "❌"} | 
          错误: {error ? "❌" : "✅"}
        </Text>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E90FF" />
          <Text style={styles.loadingText}>
            {useTestMode ? "加载测试页面..." : "加载高德地图中..."}
          </Text>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>错误: {error}</Text>
              <Text style={styles.errorDetail}>
                可能原因: API密钥无效、网络问题、安全限制
              </Text>
            </View>
          )}
        </View>
      )}
      
      <WebView
        ref={webViewRef}
        style={styles.webview}
        source={{ html: useTestMode ? generateTestHTML() : generateMapHTML() }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        onLoadEnd={() => {
          setLoading(false);
          setWebViewLoaded(true);
          console.log('WebView 加载完成');
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView 错误:', nativeEvent);
          setError(`WebView加载失败: ${nativeEvent.description}`);
          setLoading(false);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView HTTP 错误:', nativeEvent);
          setError(`HTTP错误 (${nativeEvent.statusCode})`);
        }}
        onMessage={(event) => {
          console.log('来自WebView的消息:', event.nativeEvent.data);
          const message = event.nativeEvent.data;
          if (message.includes('错误')) {
            setError(message);
          } else if (message.includes('成功')) {
            setError(null);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  debugPanel: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 8,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debugText: {
    fontSize: 12,
    color: '#333',
  },
  webview: {
    width: width,
    height: height,
  },
  loadingContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    zIndex: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffe6e6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  errorText: {
    color: '#d00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorDetail: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
});