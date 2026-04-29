import React from 'react';
import { View } from 'react-native';

export default function VideoComponent({ setShowVideo }) {
  return (
    <View style={{ height: 200, width: '100%' }}>
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/fWJe7wppgPo?start=42&autoplay=1"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        onEnded={() => setShowVideo(false)}
      ></iframe>
    </View>
  );
}