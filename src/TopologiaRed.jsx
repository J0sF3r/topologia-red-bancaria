import React, { useState, useEffect } from 'react';
import { Activity, Shield, Wifi, WifiOff, TrendingUp, Server, Database, Lock, AlertTriangle, CheckCircle, XCircle, Radio, Zap, Globe, Clock, Bell, Thermometer, Cpu } from 'lucide-react';

const TopologiaRed = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [trafficActive, setTrafficActive] = useState(false);
  const [activeConnections, setActiveConnections] = useState([]);
  const [linkStatus, setLinkStatus] = useState({
    mpls_claro: true,
    mpls_tigo: true,
    dia_claro: true,
    dia_tigo: true
  });
  const [viewMode, setViewMode] = useState('topology');
  const [networkStats, setNetworkStats] = useState({
    totalBandwidth: 0,
    activeNodes: 25,
    securityAlerts: 0,
    uptime: 99.8
  });
  const [showBackupAlert, setShowBackupAlert] = useState(false);
  const [trafficStats, setTrafficStats] = useState({
    mpls_claro: 0,
    mpls_tigo: 0,
    dia_claro: 0,
    dia_tigo: 0
  });
  const [eventLog, setEventLog] = useState([]);
  const [trafficHistory, setTrafficHistory] = useState([]);
  const [autoFailureMode, setAutoFailureMode] = useState(false);
  const [equipmentHealth, setEquipmentHealth] = useState({
    firewall_primary: { temp: 45, cpu: 32, status: 'healthy' },
    firewall_backup: { temp: 42, cpu: 15, status: 'healthy' },
    core_switch: { temp: 48, cpu: 45, status: 'healthy' },
    router_claro: { temp: 50, cpu: 28, status: 'healthy' },
    router_tigo: { temp: 46, cpu: 25, status: 'healthy' }
  });

  const branches = [
    { id: 0, name: 'Sede Central', x: 58, y: 50, network: '10.0.0.0/16', isHub: true, employees: 150, services: ['Core Bancario', 'Data Center', 'NOC'] },
    { id: 17, name: 'Petén', x: 50, y: 8, network: '10.17.0.0/16', employees: 12, services: ['Cajas', 'Plataforma'] },
    { id: 16, name: 'Alta Verapaz', x: 50, y: 20, network: '10.16.0.0/16', employees: 15, services: ['Cajas', 'Plataforma', 'ATM'] },
    { id: 15, name: 'Baja Verapaz', x: 38, y: 28, network: '10.15.0.0/16', employees: 10, services: ['Cajas', 'Plataforma'] },
    { id: 14, name: 'El Quiché', x: 28, y: 30, network: '10.14.0.0/16', employees: 12, services: ['Cajas', 'Plataforma'] },
    { id: 13, name: 'Huehuetenango', x: 10, y: 20, network: '10.13.0.0/16', employees: 18, services: ['Cajas', 'Plataforma', 'ATM'] },
    { id: 12, name: 'San Marcos', x: 8, y: 38, network: '10.12.0.0/16', employees: 16, services: ['Cajas', 'Plataforma', 'ATM'] },
    { id: 8, name: 'Totonicapán', x: 18, y: 35, network: '10.8.0.0/16', employees: 10, services: ['Cajas', 'Plataforma'] },
    { id: 9, name: 'Quetzaltenango', x: 12, y: 50, network: '10.9.0.0/16', employees: 25, services: ['Cajas', 'Plataforma', 'ATM', 'Bóveda'] },
    { id: 11, name: 'Retalhuleu', x: 8, y: 65, network: '10.11.0.0/16', employees: 12, services: ['Cajas', 'Plataforma'] },
    { id: 10, name: 'Suchitepéquez', x: 18, y: 72, network: '10.10.0.0/16', employees: 14, services: ['Cajas', 'Plataforma', 'ATM'] },
    { id: 7, name: 'Sololá', x: 25, y: 45, network: '10.7.0.0/16', employees: 11, services: ['Cajas', 'Plataforma'] },
    { id: 3, name: 'Chimaltenango', x: 32, y: 55, network: '10.3.0.0/16', employees: 16, services: ['Cajas', 'Plataforma', 'ATM'] },
    { id: 2, name: 'Sacatepéquez', x: 40, y: 62, network: '10.2.0.0/16', employees: 14, services: ['Cajas', 'Plataforma'] },
    { id: 1, name: 'Capital 1', x: 58, y: 58, network: '10.1.0.0/16', employees: 30, services: ['Cajas', 'Plataforma', 'ATM', 'Bóveda'] },
    { id: 101, name: 'Capital 2', x: 62, y: 45, network: '10.101.0.0/16', employees: 28, services: ['Cajas', 'Plataforma', 'ATM'] },
    { id: 102, name: 'Capital 3', x: 42, y: 42, network: '10.102.0.0/16', employees: 26, services: ['Cajas', 'Plataforma', 'ATM'] },
    { id: 5, name: 'Escuintla', x: 35, y: 78, network: '10.5.0.0/16', employees: 18, services: ['Cajas', 'Plataforma', 'ATM'] },
    { id: 6, name: 'Santa Rosa', x: 50, y: 85, network: '10.6.0.0/16', employees: 13, services: ['Cajas', 'Plataforma'] },
    { id: 22, name: 'Jutiapa', x: 65, y: 82, network: '10.22.0.0/16', employees: 12, services: ['Cajas', 'Plataforma'] },
    { id: 4, name: 'El Progreso', x: 70, y: 40, network: '10.4.0.0/16', employees: 11, services: ['Cajas', 'Plataforma'] },
    { id: 21, name: 'Jalapa', x: 68, y: 58, network: '10.21.0.0/16', employees: 10, services: ['Cajas', 'Plataforma'] },
    { id: 19, name: 'Zacapa', x: 82, y: 35, network: '10.19.0.0/16', employees: 14, services: ['Cajas', 'Plataforma', 'ATM'] },
    { id: 20, name: 'Chiquimula', x: 90, y: 50, network: '10.20.0.0/16', employees: 13, services: ['Cajas', 'Plataforma'] },
    { id: 18, name: 'Izabal', x: 85, y: 22, network: '10.18.0.0/16', employees: 16, services: ['Cajas', 'Plataforma', 'ATM'] }
  ];

  const vlans = [
    { id: 1, name: 'Gestión', network: '10.X.1.0/24', security: 'Crítico' },
    { id: 10, name: 'Datos Corporativos', network: '10.X.10.0/24', security: 'Alto' },
    { id: 20, name: 'Core Bancario', network: '10.X.20.0/24', security: 'Crítico' },
    { id: 30, name: 'VoIP', network: '10.X.30.0/24', security: 'Medio' },
    { id: 40, name: 'ATM', network: '10.X.40.0/24', security: 'Crítico' },
    { id: 50, name: 'Seguridad Física', network: '10.X.50.0/24', security: 'Bajo' },
    { id: 60, name: 'Wi-Fi Corporativo', network: '10.X.60.0/24', security: 'Medio' },
    { id: 100, name: 'Wi-Fi Invitados', network: '10.X.100.0/24', security: 'Bajo' }
  ];

  // Función para agregar eventos al log
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setEventLog(prev => [{ timestamp, message, type }, ...prev].slice(0, 50));
  };

  // Determinar qué enlaces están activos
  const getActiveLink = () => {
    if (linkStatus.mpls_claro) return 'mpls_claro';
    if (linkStatus.mpls_tigo) return 'mpls_tigo';
    return null;
  };

  const getActiveDIALink = () => {
    if (linkStatus.dia_claro) return 'dia_claro';
    if (linkStatus.dia_tigo) return 'dia_tigo';
    return null;
  };

  // Simulador de fallas automáticas
  useEffect(() => {
    if (!autoFailureMode) return;

    const failureInterval = setInterval(() => {
      const links = ['mpls_claro', 'mpls_tigo', 'dia_claro', 'dia_tigo'];
      const randomLink = links[Math.floor(Math.random() * links.length)];
      
      setLinkStatus(prev => {
        const newStatus = !prev[randomLink];
        if (!newStatus) {
          addLog(`⚠️ Falla simulada en ${randomLink.toUpperCase().replace('_', ' ')}`, 'warning');
        } else {
          addLog(`✅ Recuperación de ${randomLink.toUpperCase().replace('_', ' ')}`, 'success');
        }
        return { ...prev, [randomLink]: newStatus };
      });
    }, 8000);

    return () => clearInterval(failureInterval);
  }, [autoFailureMode]);

  // Actualizar salud de equipos
  useEffect(() => {
    const healthInterval = setInterval(() => {
      setEquipmentHealth(prev => {
        const newHealth = { ...prev };
        Object.keys(newHealth).forEach(key => {
          newHealth[key].temp = Math.max(35, Math.min(75, newHealth[key].temp + (Math.random() - 0.5) * 3));
          newHealth[key].cpu = Math.max(5, Math.min(95, newHealth[key].cpu + (Math.random() - 0.5) * 10));
          
          if (newHealth[key].temp > 70 || newHealth[key].cpu > 90) {
            newHealth[key].status = 'critical';
            if (prev[key].status !== 'critical') {
              addLog(`🔥 ${key.replace('_', ' ').toUpperCase()} en estado crítico`, 'error');
            }
          } else if (newHealth[key].temp > 60 || newHealth[key].cpu > 75) {
            newHealth[key].status = 'warning';
          } else {
            newHealth[key].status = 'healthy';
          }
        });
        return newHealth;
      });
    }, 3000);

    return () => clearInterval(healthInterval);
  }, []);

  // Simulación de tráfico
  useEffect(() => {
    if (!trafficActive) {
      setActiveConnections([]);
      return;
    }

    // Inicializar con algunas conexiones al activar
    const activeWANLink = getActiveLink();
    if (activeWANLink && activeConnections.length === 0) {
      const initialConnections = [];
      for (let i = 0; i < 5; i++) {
        const randomBranch = branches.filter(b => !b.isHub)[Math.floor(Math.random() * 24)];
        initialConnections.push({
          id: Date.now() + i,
          branchId: randomBranch.id,
          linkType: activeWANLink,
          bandwidth: Math.random() * 4 + 2
        });
      }
      setActiveConnections(initialConnections);
    }

    const interval = setInterval(() => {
      const activeWANLink = getActiveLink();
      if (!activeWANLink) return;

      const highTrafficBranches = branches.filter(b => 
        !b.isHub && (b.id === 1 || b.id === 101 || b.id === 102 || b.id === 9 || b.id === 16)
      );
      
      // Solo 1-2 conexiones por intervalo
      const numConnections = Math.random() > 0.5 ? 2 : 1;
      
      for (let i = 0; i < numConnections; i++) {
        const randomBranch = Math.random() > 0.7 
          ? highTrafficBranches[Math.floor(Math.random() * highTrafficBranches.length)]
          : branches.filter(b => !b.isHub)[Math.floor(Math.random() * 24)];
        
        const connectionId = Date.now() + Math.random() + i;
        const bandwidth = Math.random() * 4 + 2; // 2-6 Mbps
        
        setActiveConnections(prev => {
          // Limitar a máximo 10 conexiones simultáneas
          const newConnections = [...prev, { 
            id: connectionId, 
            branchId: randomBranch.id,
            linkType: activeWANLink,
            bandwidth: bandwidth
          }];
          return newConnections.slice(-10);
        });
        
        // Duración de 5 segundos
        setTimeout(() => {
          setActiveConnections(prev => prev.filter(conn => conn.id !== connectionId));
        }, 5000);
      }
    }, 1000); // Cada 1 segundo

    return () => clearInterval(interval);
  }, [trafficActive, linkStatus]);

  // Actualizar estadísticas
  useEffect(() => {
    if (!trafficActive) {
      setNetworkStats(prev => ({ ...prev, totalBandwidth: "0.00" }));
      setTrafficStats({
        mpls_claro: 0,
        mpls_tigo: 0,
        dia_claro: 0,
        dia_tigo: 0
      });
      return;
    }

    const statsInterval = setInterval(() => {
      // Calcular el tráfico sumando todas las conexiones activas
      let activeBandwidth = 0;
      for (const conn of activeConnections) {
        if (conn && typeof conn.bandwidth === 'number') {
          activeBandwidth += conn.bandwidth;
        }
      }
      
      // Actualizar trafficStats para los botones
      const activeWANLink = getActiveLink();
      if (activeWANLink) {
        setTrafficStats(prev => ({
          ...prev,
          [activeWANLink]: activeBandwidth
        }));
      }
      
      setNetworkStats(prev => ({
        ...prev,
        totalBandwidth: activeBandwidth.toFixed(2),
        activeNodes: branches.filter(b => Math.random() > 0.05).length,
        securityAlerts: Math.floor(Math.random() * 3)
      }));

      setTrafficHistory(prev => {
        const newHistory = [...prev, {
          time: new Date().toLocaleTimeString(),
          bandwidth: parseFloat(activeBandwidth.toFixed(2))
        }];
        return newHistory.slice(-20);
      });
    }, 500);

    return () => clearInterval(statsInterval);
  }, [activeConnections, linkStatus, trafficActive]);

  // Toggle enlace con alerta de backup
  const toggleLink = (link) => {
    const newStatus = !linkStatus[link];
    
    if (link === 'mpls_claro' && !newStatus && linkStatus.mpls_tigo) {
      setShowBackupAlert(true);
      addLog('⚠️ MPLS Claro desconectado - Failover a MPLS Tigo activado', 'warning');
      setTimeout(() => setShowBackupAlert(false), 5000);
    } else if (link === 'mpls_claro' && newStatus) {
      addLog('✅ MPLS Claro reconectado - Volviendo a enlace principal', 'success');
    }
    
    if (link === 'dia_claro' && !newStatus && linkStatus.dia_tigo) {
      setShowBackupAlert(true);
      addLog('⚠️ DIA Claro desconectado - Failover a DIA Tigo activado', 'warning');
      setTimeout(() => setShowBackupAlert(false), 5000);
    } else if (link === 'dia_claro' && newStatus) {
      addLog('✅ DIA Claro reconectado - Volviendo a enlace principal', 'success');
    }
    
    if (link === 'mpls_tigo' && !newStatus) {
      addLog('⚠️ MPLS Tigo desconectado', 'warning');
    }
    
    if (link === 'dia_tigo' && !newStatus) {
      addLog('⚠️ DIA Tigo desconectado', 'warning');
    }
    
    setLinkStatus(prev => ({
      ...prev,
      [link]: newStatus
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Alerta de Backup */}
        {showBackupAlert && (
          <div className="fixed top-4 right-4 z-50 bg-yellow-600 text-white px-6 py-4 rounded-lg shadow-2xl animate-pulse flex items-center gap-3">
            <AlertTriangle size={24} />
            <div>
              <div className="font-bold">¡Failover Automático Activado!</div>
              <div className="text-sm">El enlace de respaldo ha tomado el control del tráfico</div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 shadow-2xl border border-slate-700">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Server className="text-blue-400" size={32} />
                Banco Cuscatlán - Infraestructura de TI - 
              </h1>
              <p className="text-slate-400 mt-2">Topología Hub-and-Spoke | 24 Sucursales + Sede Central</p><br />
               <p className="text-slate-400 mt-2">Seminario Privados - Administración IT</p><br />
               <p className="text-slate-400 mt-2">UMG - Ingeniería en Sistemas</p><br />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setViewMode('topology')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  viewMode === 'topology' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                Topología
              </button>
              <button
                onClick={() => setViewMode('security')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  viewMode === 'security' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                Seguridad
              </button>
              <button
                onClick={() => setViewMode('monitoring')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  viewMode === 'monitoring' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                Monitoreo
              </button>
            </div>
          </div>
        </div>

        {/* Panel de Control */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Ancho de Banda</p>
                <p className="text-2xl font-bold text-green-400">{networkStats.totalBandwidth} Mbps</p>
              </div>
              <TrendingUp className="text-green-400" size={32} />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Nodos Activos</p>
                <p className="text-2xl font-bold text-blue-400">{networkStats.activeNodes}/25</p>
              </div>
              <Activity className="text-blue-400" size={32} />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Alertas de Seguridad</p>
                <p className="text-2xl font-bold text-yellow-400">{networkStats.securityAlerts}</p>
              </div>
              <Shield className="text-yellow-400" size={32} />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Uptime</p>
                <p className="text-2xl font-bold text-green-400">{networkStats.uptime}%</p>
              </div>
              <CheckCircle className="text-green-400" size={32} />
            </div>
          </div>
        </div>

        {viewMode === 'topology' && (
          <>
            {/* Control de Enlaces */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="col-span-2 bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Control de Redundancia</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTrafficActive(!trafficActive)}
                      className={`px-6 py-2 rounded-lg font-bold transition-all ${
                        trafficActive 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {trafficActive ? '⏸️ Detener Tráfico' : '▶️ Iniciar Tráfico'}
                    </button>
                    <button
                      onClick={() => {
                        setAutoFailureMode(!autoFailureMode);
                        addLog(autoFailureMode ? '🛑 Simulador de fallas desactivado' : '🎲 Simulador de fallas activado', 'info');
                      }}
                      className={`px-6 py-2 rounded-lg font-bold transition-all ${
                        autoFailureMode 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                          : 'bg-slate-700 hover:bg-slate-600 text-white'
                      }`}
                    >
                      {autoFailureMode ? '🎲 Fallas Auto: ON' : '🎲 Fallas Auto: OFF'}
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Enlaces WAN (MPLS)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => toggleLink('mpls_claro')}
                      className={`p-4 rounded-lg font-semibold transition relative ${
                        linkStatus.mpls_claro 
                          ? 'bg-green-600 text-white' 
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>MPLS Claro {linkStatus.mpls_claro ? '✓' : '✗'}</span>
                        {linkStatus.mpls_claro && getActiveLink() === 'mpls_claro' && (
                          <Zap className="animate-pulse" size={20} />
                        )}
                      </div>
                      {trafficActive && linkStatus.mpls_claro && getActiveLink() === 'mpls_claro' && (
                        <div className="text-xs mt-1">
                          Tráfico: {networkStats.totalBandwidth} Mbps
                        </div>
                      )}
                    </button>
                    
                    <button
                      onClick={() => toggleLink('mpls_tigo')}
                      className={`p-4 rounded-lg font-semibold transition relative ${
                        linkStatus.mpls_tigo 
                          ? !linkStatus.mpls_claro ? 'bg-yellow-600 text-white' : 'bg-blue-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>MPLS Tigo {linkStatus.mpls_tigo ? '✓' : '✗'}</span>
                        {linkStatus.mpls_tigo && getActiveLink() === 'mpls_tigo' && (
                          <Zap className="animate-pulse" size={20} />
                        )}
                      </div>
                      {!linkStatus.mpls_claro && linkStatus.mpls_tigo && (
                        <div className="text-xs mt-1 font-bold">⚠️ BACKUP ACTIVO</div>
                      )}
                      {trafficActive && linkStatus.mpls_tigo && getActiveLink() === 'mpls_tigo' && (
                        <div className="text-xs mt-1">
                          Tráfico: {networkStats.totalBandwidth} Mbps
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Enlaces Internet (DIA)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => toggleLink('dia_claro')}
                      className={`p-4 rounded-lg font-semibold transition ${
                        linkStatus.dia_claro 
                          ? 'bg-green-600 text-white' 
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>DIA Claro {linkStatus.dia_claro ? '✓' : '✗'}</span>
                        {linkStatus.dia_claro && getActiveDIALink() === 'dia_claro' && (
                          <Globe className="animate-pulse" size={20} />
                        )}
                      </div>
                      <div className="text-xs mt-1">512 Mbps</div>
                    </button>
                    
                    <button
                      onClick={() => toggleLink('dia_tigo')}
                      className={`p-4 rounded-lg font-semibold transition ${
                        linkStatus.dia_tigo 
                          ? !linkStatus.dia_claro ? 'bg-yellow-600 text-white' : 'bg-blue-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>DIA Tigo {linkStatus.dia_tigo ? '✓' : '✗'}</span>
                        {linkStatus.dia_tigo && getActiveDIALink() === 'dia_tigo' && (
                          <Globe className="animate-pulse" size={20} />
                        )}
                      </div>
                      {!linkStatus.dia_claro && linkStatus.dia_tigo && (
                        <div className="text-xs mt-1 font-bold">⚠️ BACKUP ACTIVO</div>
                      )}
                      <div className="text-xs mt-1">512 Mbps</div>
                    </button>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-300">
                      <span className="font-semibold">Estado de Redundancia:</span>
                      {!linkStatus.mpls_claro && !linkStatus.mpls_tigo && (
                        <span className="ml-2 text-red-400 font-bold">⚠️ CRÍTICO - Sin enlaces WAN</span>
                      )}
                      {!linkStatus.mpls_claro && linkStatus.mpls_tigo && (
                        <span className="ml-2 text-yellow-400 font-bold">⚠️ Operando en BACKUP (MPLS Tigo)</span>
                      )}
                      {linkStatus.mpls_claro && (
                        <span className="ml-2 text-green-400 font-bold">✓ Operación Normal (MPLS Claro Principal)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Log de Eventos */}
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Bell className="text-blue-400" />
                  Log de Eventos
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {eventLog.length === 0 && (
                    <div className="text-slate-400 text-sm text-center py-4">
                      No hay eventos recientes
                    </div>
                  )}
                  {eventLog.map((log, idx) => (
                    <div key={idx} className={`p-2 rounded text-xs ${
                      log.type === 'error' ? 'bg-red-900/30 text-red-300' :
                      log.type === 'warning' ? 'bg-yellow-900/30 text-yellow-300' :
                      log.type === 'success' ? 'bg-green-900/30 text-green-300' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      <div className="flex items-start gap-2">
                        <Clock size={12} className="mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold">{log.timestamp}</div>
                          <div>{log.message}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mapa de Red */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Mapa de Topología de Red</h2>
              
              <div className="relative bg-slate-950 rounded-lg border border-slate-700" style={{ height: '700px' }}>
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }}></div>
                </div>

                <svg className="absolute inset-0 w-full h-full">
                  {branches.filter(b => !b.isHub).map(branch => {
                    const hub = branches[0];
                    const connection = activeConnections.find(conn => conn.branchId === branch.id);
                    const isActive = !!connection;
                    const isBackup = connection && connection.linkType === 'mpls_tigo';
                    
                    return (
                      <g key={`line-${branch.id}`}>
                        <line
                          x1={`${branch.x}%`}
                          y1={`${branch.y}%`}
                          x2={`${hub.x}%`}
                          y2={`${hub.y}%`}
                          stroke={isActive ? (isBackup ? '#f59e0b' : '#3b82f6') : '#64748b'}
                          strokeWidth={isActive ? '4' : '2'}
                          strokeDasharray="8,4"
                          opacity={isActive ? '1' : '0.4'}
                          className="transition-all duration-300"
                        />
                        
                        {isActive && (
                          <>
                            <circle r="6" fill={isBackup ? '#f59e0b' : '#3b82f6'} className="animate-pulse">
                              <animateMotion
                                dur="2s"
                                repeatCount="1"
                                path={`M ${branch.x * 10} ${branch.y * 7} L ${hub.x * 10} ${hub.y * 7}`}
                              />
                            </circle>
                            {isBackup && (
                              <text
                                x={`${(branch.x + hub.x) / 2}%`}
                                y={`${(branch.y + hub.y) / 2}%`}
                                fill="#f59e0b"
                                fontSize="10"
                                fontWeight="bold"
                                className="animate-pulse"
                              >
                                BACKUP
                              </text>
                            )}
                          </>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {branches.map(branch => (
                  <div
                    key={branch.id}
                    className="absolute"
                    style={{
                      left: `${branch.x}%`,
                      top: `${branch.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div 
                      className={`cursor-pointer transition-all hover:scale-125 ${
                        selectedNode?.id === branch.id ? 'scale-150 z-50' : ''
                      }`}
                      onClick={() => setSelectedNode(branch)}
                    >
                      <div className={`relative w-10 h-10 rounded-full border-3 ${
                        branch.isHub 
                          ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-300 shadow-lg shadow-green-500/50' 
                          : 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-300 shadow-lg shadow-blue-500/50'
                      }`}>
                        {branch.isHub && (
                          <Server className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" size={20} />
                        )}
                        {activeConnections.some(conn => conn.branchId === branch.id) && !branch.isHub && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className={`absolute top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-bold px-3 py-1 rounded-lg shadow-lg ${
                        branch.isHub 
                          ? 'bg-green-900 text-green-200 border-2 border-green-600' 
                          : 'bg-blue-900 text-blue-200 border-2 border-blue-600'
                      }`}>
                        {branch.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {viewMode === 'security' && (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="text-red-400" />
              Arquitectura de Seguridad
            </h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-3">Firewall FortiGate - Alta Disponibilidad</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Firewall Principal</span>
                    <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-bold">Activo</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Firewall Respaldo</span>
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-bold">Standby</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Políticas Activas</span>
                    <span className="text-white font-bold">847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Sesiones Activas</span>
                    <span className="text-white font-bold">12,543</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-3">Seguridad de Endpoints</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Endpoints Protegidos</span>
                    <span className="text-white font-bold">487/500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Amenazas Bloqueadas (24h)</span>
                    <span className="text-red-400 font-bold">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Actualizaciones Pendientes</span>
                    <span className="text-yellow-400 font-bold">13</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Estado General</span>
                    <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-bold">Saludable</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-900 rounded-lg p-4 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-3">VLANs de Seguridad</h3>
              <div className="grid grid-cols-4 gap-3">
                {vlans.map(vlan => (
                  <div key={vlan.id} className={`p-3 rounded-lg border-2 ${
                    vlan.security === 'Crítico' ? 'bg-red-900/30 border-red-600' :
                    vlan.security === 'Alto' ? 'bg-orange-900/30 border-orange-600' :
                    vlan.security === 'Medio' ? 'bg-yellow-900/30 border-yellow-600' :
                    'bg-green-900/30 border-green-600'
                  }`}>
                    <div className="text-white font-bold text-sm">{vlan.name}</div>
                    <div className="text-slate-400 text-xs mt-1">VLAN {vlan.id}</div>
                    <div className={`text-xs mt-1 font-semibold ${
                      vlan.security === 'Crítico' ? 'text-red-400' :
                      vlan.security === 'Alto' ? 'text-orange-400' :
                      vlan.security === 'Medio' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {vlan.security}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'monitoring' && (
          <div className="space-y-6">
            {/* Gráfica de Tráfico */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="text-green-400" />
                Tráfico en Tiempo Real
              </h2>
              <div className="bg-slate-900 rounded-lg p-4" style={{ height: '300px' }}>
                <svg width="100%" height="100%" viewBox="0 0 800 250">
                  <line x1="50" y1="200" x2="750" y2="200" stroke="#475569" strokeWidth="2" />
                  <line x1="50" y1="10" x2="50" y2="200" stroke="#475569" strokeWidth="2" />
                  
                  {/* Calcular el valor máximo para escalar la gráfica */}
                  {(() => {
                    const maxBandwidth = Math.max(...trafficHistory.map(p => p.bandwidth), 20);
                    const scale = 190 / maxBandwidth; // 190 es la altura útil del gráfico
                    const step = Math.ceil(maxBandwidth / 4); // Dividir en 4 líneas guía
                    
                    return (
                      <>
                        {/* Líneas de guía dinámicas */}
                        {[0, 1, 2, 3, 4].map(i => {
                          const value = i * step;
                          const y = 200 - (value * scale);
                          return (
                            <g key={i}>
                              <line x1="50" y1={y} x2="750" y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
                              <text x="35" y={y + 5} fill="#94a3b8" fontSize="12" textAnchor="end">{value}</text>
                            </g>
                          );
                        })}
                        
                        {/* Datos */}
                        {trafficHistory.length > 1 && (
                          <polyline
                            points={trafficHistory.map((point, idx) => {
                              const x = 50 + (idx * (700 / (trafficHistory.length - 1)));
                              const y = 200 - (point.bandwidth * scale);
                              return `${x},${y}`;
                            }).join(' ')}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                          />
                        )}
                        
                        {/* Puntos */}
                        {trafficHistory.map((point, idx) => {
                          const x = 50 + (idx * (700 / Math.max(trafficHistory.length - 1, 1)));
                          const y = 200 - (point.bandwidth * scale);
                          return (
                            <circle
                              key={idx}
                              cx={x}
                              cy={y}
                              r="4"
                              fill="#3b82f6"
                            />
                          );
                        })}
                      </>
                    );
                  })()}
                  
                  <text x="400" y="240" fill="#94a3b8" fontSize="14" textAnchor="middle">Tiempo</text>
                  <text x="15" y="110" fill="#94a3b8" fontSize="14" textAnchor="middle" transform="rotate(-90 15 110)">Mbps</text>
                </svg>
              </div>
            </div>

            {/* Salud de Equipos */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Server className="text-blue-400" />
                Salud de Equipos
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(equipmentHealth).map(([key, data]) => (
                  <div key={key} className={`bg-slate-900 rounded-lg p-4 border-2 ${
                    data.status === 'critical' ? 'border-red-600' :
                    data.status === 'warning' ? 'border-yellow-600' :
                    'border-green-600'
                  }`}>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-white font-bold">{key.replace(/_/g, ' ').toUpperCase()}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        data.status === 'critical' ? 'bg-red-600 text-white' :
                        data.status === 'warning' ? 'bg-yellow-600 text-white' :
                        'bg-green-600 text-white'
                      }`}>
                        {data.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-400 text-sm flex items-center gap-1">
                            <Thermometer size={14} />
                            Temperatura
                          </span>
                          <span className={`text-sm font-bold ${
                            data.temp > 70 ? 'text-red-400' :
                            data.temp > 60 ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>
                            {data.temp.toFixed(1)}°C
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              data.temp > 70 ? 'bg-red-500' :
                              data.temp > 60 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((data.temp / 80) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-400 text-sm flex items-center gap-1">
                            <Cpu size={14} />
                            CPU Usage
                          </span>
                          <span className={`text-sm font-bold ${
                            data.cpu > 90 ? 'text-red-400' :
                            data.cpu > 75 ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>
                            {data.cpu.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              data.cpu > 90 ? 'bg-red-500' :
                              data.cpu > 75 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${data.cpu}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedNode && (
          <div className="mt-6 bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                {selectedNode.isHub ? <Server className="text-green-400" /> : <Wifi className="text-blue-400" />}
                {selectedNode.name}
              </h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition"
              >
                ✕ Cerrar
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-slate-400 text-sm mb-1">Red Asignada</div>
                <div className="text-white font-mono font-bold">{selectedNode.network}</div>
              </div>
              
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-slate-400 text-sm mb-1">Tipo de Nodo</div>
                <div className="text-white font-bold">
                  {selectedNode.isHub ? '🏢 Hub Central' : '📍 Sucursal'}
                </div>
              </div>
              
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-slate-400 text-sm mb-1">Estado</div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-green-400 font-bold">Activo</span>
                </div>
              </div>

              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-slate-400 text-sm mb-1">Empleados</div>
                <div className="text-white font-bold">{selectedNode.employees} usuarios</div>
              </div>
            </div>

            {!selectedNode.isHub && (
              <div className="mt-4 bg-slate-700 p-4 rounded-lg">
                <div className="text-slate-400 text-sm mb-2">Servicios Activos</div>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.services.map(service => (
                    <span key={service} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedNode.isHub && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-slate-400 text-sm mb-1">Servicios Centralizados</div>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-2 text-white">
                      <Database size={16} className="text-blue-400" />
                      <span className="text-sm">Core Bancario</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <Server size={16} className="text-green-400" />
                      <span className="text-sm">Data Center</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <Shield size={16} className="text-red-400" />
                      <span className="text-sm">Firewall Cluster</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-slate-400 text-sm mb-1">Enlaces Activos</div>
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between items-center text-white">
                      <span className="text-sm">MPLS Claro</span>
                      {linkStatus.mpls_claro ? (
                        <CheckCircle size={16} className="text-green-400" />
                      ) : (
                        <XCircle size={16} className="text-red-400" />
                      )}
                    </div>
                    <div className="flex justify-between items-center text-white">
                      <span className="text-sm">MPLS Tigo</span>
                      {linkStatus.mpls_tigo ? (
                        <CheckCircle size={16} className="text-green-400" />
                      ) : (
                        <XCircle size={16} className="text-red-400" />
                      )}
                    </div>
                    <div className="flex justify-between items-center text-white">
                      <span className="text-sm">DIA Claro (512M)</span>
                      {linkStatus.dia_claro ? (
                        <CheckCircle size={16} className="text-green-400" />
                      ) : (
                        <XCircle size={16} className="text-red-400" />
                      )}
                    </div>
                    <div className="flex justify-between items-center text-white">
                      <span className="text-sm">DIA Tigo (512M)</span>
                      {linkStatus.dia_tigo ? (
                        <CheckCircle size={16} className="text-green-400" />
                      ) : (
                        <XCircle size={16} className="text-red-400" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-slate-400 text-sm mb-1">Seguridad</div>
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between items-center text-white">
                      <span className="text-sm">FortiGate HA</span>
                      <CheckCircle size={16} className="text-green-400" />
                    </div>
                    <div className="flex justify-between items-center text-white">
                      <span className="text-sm">IPS/IDS</span>
                      <CheckCircle size={16} className="text-green-400" />
                    </div>
                    <div className="flex justify-between items-center text-white">
                      <span className="text-sm">Web Filtering</span>
                      <CheckCircle size={16} className="text-green-400" />
                    </div>
                    <div className="flex justify-between items-center text-white">
                      <span className="text-sm">DMZ Activa</span>
                      <CheckCircle size={16} className="text-green-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopologiaRed;