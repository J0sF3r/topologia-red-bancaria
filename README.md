# 🏦 Banco Cuscatlán - Visualización de Topología de Red - Seminario Privados Area: Administracion de TI

Aplicación web interactiva desarrollada en React para visualizar y monitorear la infraestructura de red del Banco Cuscatlán en Guatemala. Implementa una topología Hub-and-Spoke con 24 sucursales distribuidas geográficamente.

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 📋 Descripción del Proyecto

Sistema de visualización en tiempo real que simula y monitorea la infraestructura de red de una institución bancaria con:

- **Sede Central** (Hub) - Data Center principal
- **24 Sucursales** (Spokes) - Distribuidas en todos los departamentos de Guatemala
- **Redundancia Activa-Pasiva** con enlaces MPLS duales (Claro + Tigo)
- **Monitoreo en Tiempo Real** de tráfico, seguridad y salud de equipos
- **Simulador de Fallas** automático para pruebas de failover

---

## ✨ Características Principales

### 🗺️ Vista de Topología
- Mapa interactivo de Guatemala con geolocalización de sucursales
- Visualización de conexiones Hub-and-Spoke en tiempo real
- Animación de tráfico con partículas (simulación de paquetes)
- Panel de control de redundancia (MPLS Claro/Tigo, DIA Claro/Tigo)
- Simulador automático de fallas de red
- Log de eventos con timestamps

### 🔒 Vista de Seguridad
- Estado de Firewall FortiGate en Alta Disponibilidad (HA)
- Monitoreo de endpoints protegidos (ESET/Sophos)
- Visualización de 8 VLANs por nivel de criticidad:
  - **VLAN 1** - Gestión (Crítico)
  - **VLAN 20** - Core Bancario (Crítico)
  - **VLAN 40** - ATM (Alto)
  - **VLAN 30** - VoIP (Alto)
  - **VLAN 10** - Datos (Medio)
  - **VLAN 50** - Seguridad Física (Medio)
  - **VLAN 60** - Wi-Fi Corporativo (Bajo)
  - **VLAN 100** - Wi-Fi Invitados (Bajo)

### 📊 Vista de Monitoreo
- Gráfica SVG de tráfico en tiempo real con escala dinámica
- Dashboard de salud de equipos críticos:
  - Firewall Primary & Backup
  - Core Switch
  - Routers Claro y Tigo
- Métricas de temperatura y CPU con alertas automáticas
- Estados: 🟢 Healthy | 🟡 Warning | 🔴 Critical

---

## 🏗️ Arquitectura de Red

### Diseño Hub-and-Spoke

```
                    ┌─────────────────┐
                    │  Sede Central   │
                    │   (10.0.0.0/16) │
                    │                 │
                    │  • Data Center  │
                    │  • NOC          │
                    │  • Core Banking │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐         ┌────▼────┐        ┌────▼────┐
    │ MPLS    │         │ MPLS    │        │   DIA   │
    │ Claro   │         │  Tigo   │        │Claro+Tigo│
    │ 10 Mbps │         │ 10 Mbps │        │ 512 Mbps│
    └────┬────┘         └────┬────┘        └────┬────┘
         │                   │                   │
         └───────────┬───────┴─────────┬─────────┘
                     │                 │
        ┌────────────▼──────┐   ┌──────▼─────────┐
        │  Sucursales (x24) │   │ Internet + El  │
        │  10.X.0.0/16      │   │   Salvador     │
        └───────────────────┘   └────────────────┘
```

### Esquema de Direccionamiento IP

- **Bloque Clase A:** `10.0.0.0/8`
- **Sede Central:** `10.0.0.0/16`
- **Sucursales:** `10.X.0.0/16` donde X = ID del departamento

**Ejemplos:**
- Guatemala (Zona 1): `10.1.0.0/16`
- Guatemala (Zona 10): `10.101.0.0/16`
- Quetzaltenango: `10.9.0.0/16`
- Petén: `10.17.0.0/16`

### Enlaces de Telecomunicaciones

| Tipo | Proveedor | Capacidad | Cantidad | Propósito |
|------|-----------|-----------|----------|-----------|
| MPLS | Claro | 10 Mbps | 24 enlaces | WAN Principal |
| MPLS | Tigo | 10 Mbps | 24 enlaces | WAN Backup |
| DIA | Claro | 512 Mbps | 1 enlace | Internet + Replicación |
| DIA | Tigo | 512 Mbps | 1 enlace | Internet Backup |

---

## 🚀 Instalación y Uso

### Requisitos Previos

- Node.js 14.x o superior
- npm 6.x o superior

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/J0sF3r/topologia-red-bancaria
cd topologia-red-bancaria
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Tailwind CSS** (si no está configurado)
```bash
npm install -D tailwindcss postcss autoprefixer
```

4. **Iniciar el servidor de desarrollo**
```bash
npm start
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

6. **Verlo en produccion**
```
https://topologia-red.vercel.app/
```


### Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `build/`.

---

## 💻 Tecnologías Utilizadas

### Frontend
- **React 18.x** - Librería principal de UI
- **Tailwind CSS 3.x** - Framework de CSS utility-first
- **Lucide React** - Iconos SVG optimizados
- **SVG** - Gráficas y visualizaciones vectoriales

### Características Técnicas
- **Hooks de React**: useState, useEffect
- **Animaciones CSS**: animate-pulse, transitions
- **SVG animateMotion**: Para animación de tráfico
- **Responsive Design**: Adaptable a diferentes resoluciones
- **Real-time Updates**: Actualización cada 500ms-3s según componente

---

## 📂 Estructura del Proyecto

```
topologia-red/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── TopologiaRed.jsx      # Componente principal
│   ├── App.js                # Aplicación raíz
│   ├── index.js              # Punto de entrada
│   └── index.css             # Estilos globales + Tailwind
├── tailwind.config.js        # Configuración de Tailwind
├── postcss.config.js         # Configuración de PostCSS
├── package.json              # Dependencias del proyecto
├── .gitignore                # Archivos ignorados por Git
└── README.md                 # Este archivo
```

---

## 🎮 Uso de la Aplicación

### Controles Disponibles

1. **Iniciar/Detener Tráfico** - Activa la simulación de tráfico de red
2. **Fallas Auto: ON/OFF** - Activa el simulador automático de fallas (cada 8 segundos)
3. **Enlaces MPLS/DIA** - Click para activar/desactivar cada enlace manualmente
4. **Pestañas de Vista** - Cambia entre Topología, Seguridad y Monitoreo
5. **Click en Nodos** - Muestra información detallada de cada sucursal

### Comportamiento del Sistema

- **Failover Automático:** Si MPLS Claro falla, MPLS Tigo toma el control automáticamente
- **Alertas Visuales:** Alertas flotantes amarillas cuando se activa el backup
- **Log de Eventos:** Registro cronológico de todos los eventos del sistema
- **Gráfica Dinámica:** Se ajusta automáticamente al tráfico máximo para evitar recortes

---

## 📊 Datos de las Sucursales

| Región | Sucursales | Total Empleados |
|--------|------------|-----------------|
| Norte | Petén, Alta Verapaz, Baja Verapaz, El Quiché | 49 |
| Noroccidente | Huehuetenango, San Marcos, Totonicapán, Quetzaltenango | 69 |
| Central | Guatemala (3), Chimaltenango, Sacatepéquez, Sololá | 218 |
| Sur | Escuintla, Santa Rosa, Jutiapa | 52 |
| Oriente | El Progreso, Jalapa, Zacapa, Chiquimula, Izabal | 69 |

**Total:** 25 nodos (1 hub + 24 sucursales) | 457 empleados

---

## 🔐 Seguridad Implementada

### Firewall
- **Modelo:** FortiGate 400F
- **Configuración:** Clúster HA Activo-Pasivo
- **Throughput:** 22 Gbps
- **Licencias:** FortiCare + UTM Bundle

### Endpoint Protection
- **Soluciones:** ESET o Sophos
- **Arquitectura:** Cloud-managed
- **Cobertura:** 487/500 endpoints

### Certificados y Firma
- **SSL:** Extended Validation (EV) para banca en línea
- **Firma Legal:** Cámara de Comercio de Guatemala
- **Firma Transaccional:** 5B (proveedor especializado)

---

## 🎯 Casos de Uso

1. **Monitoreo NOC:** Supervisión en tiempo real del estado de la red
2. **Capacitación:** Entrenamiento de personal técnico en arquitectura de red
3. **Presentaciones:** Demos para stakeholders y ejecutivos
4. **Simulación de Desastres:** Pruebas de failover y continuidad del negocio
5. **Documentación:** Visualización de la infraestructura actual

---

## 🐛 Troubleshooting

### El diseño no se ve correctamente
```bash
# Reinstalar Tailwind CSS
npm uninstall tailwindcss
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

### El tráfico no se muestra
- Verificar que hayas hecho click en "▶️ Iniciar Tráfico"
- Esperar 2-3 segundos para que se generen conexiones iniciales
- Verificar que al menos un enlace MPLS esté activo

### Errores de compilación
```bash
# Limpiar caché y reinstalar
rm -rf node_modules
rm package-lock.json
npm install
npm start
```

---

Este proyecto simula una infraestructura real pero los datos y configuraciones son ficticios con propósitos educativos.

---

## 👨‍💻 Autor

**José Fernando Díaz Martínez**
- Universidad Mariano Gálvez de Guatemala
- Proyecto Examen Privado
- Area: Administración de TI
- Ingeniería en Sistemas

---
