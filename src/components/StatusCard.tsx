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
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
        {title}
      </Text>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: statusColor },
          ]}
        />
        <Text style={[styles.statusText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
  },
});