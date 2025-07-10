import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

interface StatusCardProps {
  title: string;
  statusColor: string;
  statusText: string;
  children?: React.ReactNode;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  statusColor,
  statusText,
  children,
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: statusColor },
          ]}
        />
        <Text style={styles.statusText}>
          {statusText}
        </Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 25,
    padding: 15,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#2c3e50',
    backgroundColor: '#3498db',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 0,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#ecf0f1',
  },
});