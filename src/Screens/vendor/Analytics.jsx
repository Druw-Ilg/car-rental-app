import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const data = {
  labels: ['Dec \'21', 'Jan \'22', 'Feb \'22'],
  datasets: [
    {
      data: [20, 15, 18, 80, 19, 23,10, 25, 48, 80, 99, 43],
      strokeWidth: 2,
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 3, 
  barPercentage: 0.9,
  useShadowColorFromDataset: false,

  // Remove grid lines and Y-axis labels
  propsForBackgroundLines: {
    stroke: 'transparent', // hides grid lines
  },
  yLabelsOffset: 9999, 
  xLabelsOffset: -10, 
};

const Analytics = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>How you're doing</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Bookings</Text>
        <Text style={styles.value}>34</Text>
        <Text style={styles.subtext}>Last 3 months <Text style={styles.greenText}>+15%</Text></Text>
        <LineChart
          data={data}
          width={screenWidth + 4} 
          height={180}
          chartConfig={chartConfig}
          bezier
          withDots={false}  // This removes the dots on the line
          withVerticalLabels={false}  // This hides the Y-axis labels
          withHorizontalLabels={true} // This keeps the X-axis labels visible
          style={styles.chart}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Revenue</Text>
        <Text style={styles.value}>$5,000</Text>
        <Text style={styles.subtext}>Last 3 months <Text style={styles.greenText}>+20%</Text></Text>
        <LineChart
          data={data}
          width={screenWidth + 4}
          height={200}
          chartConfig={chartConfig}
          bezier
          withDots={false}  // This removes the dots on the line
          withVerticalLabels={false}  // This hides the Y-axis labels
          withHorizontalLabels={true} // This keeps the X-axis labels visible
          style={styles.chart}
        />
       <View style={styles.cardContainer}>
         <View style={styles.cardRow}>
         <View style={styles.card}>
        <Text style={styles.labelCards}>Cars listed</Text>
        <Text style={styles.valueCards}>25</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.labelCards}>Most rented car type</Text>
        <Text style={styles.valueCards}>SUV</Text>
      </View>
         </View>
       <View style={styles.cardRow}>
       <View style={styles.card}>
        <Text style={styles.labelCards}>Average trip length</Text>
        <Text style={styles.valueCards}>3 days</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.labelCards}>Total Bookings</Text>
        <Text style={styles.valueCards}>45</Text>
      </View>
       </View>
       </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  greenText: {
    color: '#00BFA5',
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensure the cards are spaced evenly
    flex: 0.5,
  },
  card: {
    flex:1,
    padding: 20,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    borderRadius:18,
    borderColor:'gray',
    borderWidth:0.4,
  },
  labelCards: {
    fontSize: 16,
    color: '#6c757d',
  },
  valueCards: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
});

export default Analytics;
