import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { common, fonts, colours } from '../../../assets/Theme.jsx';

export default function NetworkHealth({ devices }) {
  const onlineDevices = [];
  devices.forEach(device => {
    if (device.status == 'ONLINE') {
      onlineDevices.push(device);
    }
  });
  const totalDevices = devices.length;
  const totalOnlineDevices = onlineDevices.length;

  const percent = Math.round((totalOnlineDevices / totalDevices) * 100);
  const status =
    percent >= 90 ? 'OPTIMAL' : percent >= 60 ? 'DEGRADED' : 'CRITICAL';
  const statusColor =
    percent >= 90 ? colours.success : percent >= 60 ? '#f59e0b' : colours.alert;

  return (
    <View style={common.card}>
      <View>
        <Text style={common.headline}>NETWORK HEALTH</Text>
        <View style={styles.valueRow}>
          <Text style={[styles.value, { color: statusColor }]}>{percent}%</Text>
          <Text style={[styles.status, { color: statusColor }]}>{status}</Text>
        </View>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              { width: `${percent}%`, backgroundColor: statusColor },
            ]}
          />
        </View>
        <View style={styles.barLabels}>
          <Text style={styles.barLabelText}>{totalOnlineDevices} online</Text>
          <Text style={styles.barLabelText}>
            {totalDevices - totalOnlineDevices} offline
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  label: {
    fontFamily: fonts.data,
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },
  value: {
    fontFamily: fonts.headline,
    fontSize: 36,
    fontWeight: '800',
  },
  status: {
    fontFamily: fonts.data,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  barTrack: {
    width: 180,
    height: 4,
    backgroundColor: '#2a2f35',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 180,
    marginTop: 5,
  },
  barLabelText: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colours.inactive,
  },
  nodesCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  nodesCount: {
    fontFamily: fonts.headline,
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 24,
  },
  nodesLabel: {
    fontFamily: fonts.data,
    fontSize: 8,
    letterSpacing: 1,
  },
});
