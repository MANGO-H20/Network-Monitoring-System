import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { common, colours, fonts } from '../../../assets/Theme.jsx';
import Carousel from 'react-native-reanimated-carousel';
import { useNetwork } from '../../NetworkContext.jsx';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 40 - 36;

// ── Chart slides ──────────────────────────────────────────────────────────────
function ThroughputChartSlide() {
  const { throughput } = useNetwork();
  {
    /*
     *
     * throughput = [
     * {
     * value: Total amount of MegaBytes for the system  ,
     *
     * label : timestamp
     *
     * }]
     * */
  }
  const maxValue = throughput.length
    ? Math.max(...throughput.map(d => d.value)) * 1.2
    : 1;
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Data Rate</Text>
      <Text style={styles.cardSub}>Rolling 60s throughput</Text>
      <LineChart
        data={throughput}
        width={CHART_WIDTH}
        height={150}
        color={colours.primary}
        thickness={2}
        curved
        hideDataPoints
        xAxisColor="transparent"
        yAxisColor="transparent"
        xAxisLabelTextStyle={styles.axisText}
        yAxisTextStyle={styles.axisText}
        rulesColor="rgba(255,255,255,0.05)"
        rulesType="solid"
        yAxisLabelSuffix="B/S"
        noOfSections={4}
        maxValue={maxValue}
        backgroundColor="transparent"
        initialSpacing={5}
        scrollToEnd
      />
    </View>
  );
}

function RPSChartSlide() {
  const { rps } = useNetwork();

  {
    /*
     * rps = [
     * {
     * value: RPS for that device,
     *
     * label : device name
     *
     * }]
     * */
  }

  const barChartData = rps
    .filter(r => !r.label.includes('10.'))
    .map(r => ({ ...r, frontColor: colours.primary }));
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>RPS / Device</Text>
      <Text style={styles.cardSub}>Requests Per Second for each device</Text>
      <BarChart
        data={barChartData}
        width={CHART_WIDTH}
        height={150}
        barWidth={24}
        barBorderRadius={4}
        frontColor={colours.primary}
        xAxisColor="transparent"
        yAxisColor="transparent"
        yAxisTextStyle={styles.axisText}
        xAxisLabelTextStyle={styles.axisText}
        rulesColor="rgba(255,255,255,0.05)"
        noOfSections={4}
        maxValue={80}
        backgroundColor="transparent"
        initialSpacing={10}
        spacing={14}
      />
    </View>
  );
}

const SLIDES = [ThroughputChartSlide, RPSChartSlide];

//  Screen
export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <ScrollView
      style={[common.screen, { paddingTop: insets.top + 30 }]}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 80,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Traffic Analysis</Text>

      {/* Carousel */}
      <Carousel
        width={width - 40}
        height={310}
        data={SLIDES}
        onSnapToItem={setActiveIndex}
        renderItem={({ item: Slide }) => <Slide />}
        style={{ marginTop: 16 }}
        panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
      />

      {/* Pagination dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.pageDot, activeIndex === i && styles.pageDotActive]}
          />
        ))}
      </View>
    </ScrollView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  liveLabel: {
    fontFamily: fonts.data,
    fontSize: 11,
    color: colours.primary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 6,
  },
  pageTitle: {
    fontFamily: fonts.headline,
    fontSize: 26,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#1a1f24',
    borderRadius: 16,
    padding: 18,
    flex: 1,
  },
  cardTitle: {
    fontFamily: fonts.headline,
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 2,
  },
  cardSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colours.inactive,
    marginBottom: 14,
  },
  inboundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  inboundDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colours.primary,
  },
  inboundLabel: {
    fontFamily: fonts.data,
    fontSize: 11,
    color: colours.inactive,
    letterSpacing: 1,
  },
  inboundValue: {
    fontFamily: fonts.headline,
    fontSize: 22,
    color: colours.primary,
    marginLeft: 8,
  },
  axisText: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colours.inactive,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    marginBottom: 20,
  },
  pageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  pageDotActive: {
    backgroundColor: colours.primary,
    width: 18,
    borderRadius: 3,
  },
});
