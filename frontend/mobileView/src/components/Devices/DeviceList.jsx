import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colours, fonts } from '../../../assets/Theme.jsx';

// ── Mock data ─────────────────────────────────────────────────────────────────
const DEFAULT_DEVICES = [
  {
    id: '1',
    name: 'Sentinel Hub Alpha',
    type: 'CORE GATEWAY',
    icon: 'router-wireless',
    status: 'online',
  },
  {
    id: '2',
    name: 'Living Room OLED',
    type: 'MEDIA STREAMER',
    icon: 'television-play',
    status: 'online',
  },
  {
    id: '3',
    name: 'Workstation-Pro',
    type: 'DEVELOPMENT',
    icon: 'laptop',
    status: 'online',
  },
  {
    id: '4',
    name: 'Guest iPhone 15',
    type: 'MOBILE DEVICE',
    icon: 'cellphone',
    status: 'offline',
  },
];

//  Device Row
function DeviceRow({ device, showDivider }) {
  const isOnline = device.status === 'ONLINE';

  return (
    <>
      {/* Icon */}
      <View style={styles.row}>
        <View style={[styles.iconWrap, !isOnline && styles.iconWrapOffline]}>
          <MaterialCommunityIcons
            name={device.icon}
            size={22}
            color={isOnline ? colours.primary : colours.inactive}
          />
        </View>

        {/* Name + type */}
        <View style={styles.info}>
          <Text style={styles.deviceName}>{device.name}</Text>
          <Text style={styles.deviceType}>{device.type}</Text>
        </View>

        {/* Status */}
        <View style={styles.statusWrap}>
          <View
            style={[
              styles.dot,
              isOnline ? styles.dotOnline : styles.dotOffline,
            ]}
          />
          <Text
            style={[
              styles.statusText,
              isOnline ? styles.textOnline : styles.textOffline,
            ]}
          >
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
        </View>

        {showDivider && <View style={styles.divider} />}
      </View>
    </>
  );
}

// ── DeviceList ────────────────────────────────────────────────────────────────
export default function DeviceList({ devices }) {
  devices = devices.filter(d => !d.id.includes('10.'));
  return (
    <View>
      {/* Section header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DEVICE LIST</Text>
      </View>

      {/* Rows */}
      <View style={styles.list}>
        {devices.map((device, index) => (
          <DeviceRow
            key={device.id}
            device={device}
            showDivider={index < devices.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: fonts.headline,
    fontSize: 13,
    color: '#ffffff',
    letterSpacing: 1.5,
  },
  liveMonitor: {
    fontFamily: fonts.data,
    fontSize: 11,
    color: colours.primary,
    letterSpacing: 1.2,
  },

  // List
  list: {
    borderRadius: 14,
    overflow: 'hidden',
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 218, 243, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapOffline: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  deviceName: {
    fontFamily: fonts.headline,
    fontSize: 15,
    color: '#ffffff',
  },
  deviceType: {
    fontFamily: fonts.data,
    fontSize: 11,
    color: colours.inactive,
    letterSpacing: 0.8,
  },

  // Status
  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOnline: {
    backgroundColor: colours.success,
  },
  dotOffline: {
    backgroundColor: colours.alert,
  },
  statusText: {
    fontFamily: fonts.data,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  textOnline: {
    color: colours.success,
  },
  textOffline: {
    color: colours.alert,
  },

  divider: {
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});
