import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
  onPress: () => void;
};

export default function GoogleButton({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={require('@/assets/images/googleImage.png')}
        style={styles.icon}
        />
      <Text style={styles.text}>Sign in with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
});
