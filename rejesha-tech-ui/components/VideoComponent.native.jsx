import React,{useRef} from 'react';
import YoutubePlayer from "react-native-youtube-iframe";

export default function VideoComponent({ setShowVideo }) {
  const playerRef = useRef(null);
  return (
    <YoutubePlayer
      ref={playerRef}
      height={200}
      play={true}
      videoId={"fWJe7wppgPo"}
      initialPlayerParams={{
        startSeconds: 42,
        rel: false,      
        modestbranding: true,
      }}
      onReady={() => {
        playerRef.current?.seekTo(42, true); // Force skip to 42s once ready
      }}
      webViewProps={{
        androidLayerType: 'hardware',
        mediaPlaybackRequiresUserAction: false,
      }}
      onChangeState={(state) => {
        if (state === "ended") {
          setShowVideo(false);
        }
      }}
    />
  );
}