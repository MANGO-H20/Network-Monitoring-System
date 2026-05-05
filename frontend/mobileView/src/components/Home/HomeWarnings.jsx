import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SEVERITY_COLOUR = {
  HIGH: '#ef4444',
  MEDIUM: '#f59e0b',
  LOW: '#94a3b8',
};
//  Full warnings screen — used on the warnings tab
export default function WarningsScreen({ warnings }) {
  console.debug(warnings[0]);
  const insets = useSafeAreaInsets();
  if (!warnings.length) {
    return (
      <View style={styles.card}>
        <Text style={{ color: '#94a3b8' }}>No warnings</Text>
      </View>
    );
  }
  return (
    <View
      contentContainerStyle={[{ paddingBottom: insets.bottom, paddingTop: 80 }]}
      showsVerticalScrollIndicator={false}
    >
      {warnings.map((warning, index) => {
        const accent = SEVERITY_COLOUR[warning.severity];

        return (
          <View
            key={warning.id ?? index}
            style={[styles.card, { borderLeftColor: accent }]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>WARNINGS</Text>
              <MaterialCommunityIcons name="alert" size={18} color={accent} />
            </View>
            <Text style={[styles.warningCount, { color: accent }]}>
              {String(
                warnings.filter(w => w.severity === warning.severity).length,
              ).padStart(2, '0')}
            </Text>
            <Text style={styles.cardMessage}>{warning.type}</Text>
            <Text style={styles.timestamp}>{warning.timestamp}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1f24',
    borderRadius: 14,
    padding: 18,
    borderLeftWidth: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1.5,
  },
  warningCount: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 52,
    marginBottom: 8,
  },
  cardMessage: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 11,
    color: '#4a5568',
    marginTop: 10,
  },
});
