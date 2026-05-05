import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { common } from '../../../assets/Theme.jsx';

//  Active Devices Card
export function ActiveDevicesCard({ devices }) {
  const number_of_active_devices = devices.length;

  return (
    <View style={common.card}>
      <View style={styles.countRow}>
        <Text style={styles.countValue}>{number_of_active_devices}</Text>
        <Text style={styles.statLabel}>DEVICES ONLINE</Text>
      </View>
    </View>
  );
}

//  New Devices Card
export function NewDevicesCard({ new_devices }) {
  new_devices = new_devices.filter(d => !d.id.includes('10.'));
  return (
    <View style={common.card}>
      <View style={styles.cardHeader}>
        <Text style={common.headline}>NEW DEVICES</Text>
        <View style={styles.activeDot} />
      </View>

      {new_devices.map((device, index) => (
        <View
          key={device.id}
          style={[
            styles.deviceRow,
            index < new_devices.length - 1 && styles.deviceRowBorder,
          ]}
        >
          <View style={styles.deviceIconWrap}>
            <MaterialCommunityIcons
              name={device.icon}
              size={18}
              color="#00daf3"
            />
          </View>
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <Text style={styles.deviceJoined}>
              Last Seen : {device.joinedAgo}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Shared
  card: {
    backgroundcolor: '#1a1f24',
    borderradius: 14,
    padding: 20,
    marginbottom: 12,
    gap: 12,
  },

  // Active Devices
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  countValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 52,
  },
  countLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1.5,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1.2,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  statTrend: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
  },
  barTrack: {
    height: 4,
    backgroundColor: '#2a2f35',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  scanBtn: {
    backgroundColor: '#00daf3',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  scanBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#101418',
    letterSpacing: 1.2,
  },

  // New Devices
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1.5,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  deviceRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  deviceIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 218, 243, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  deviceJoined: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
});
