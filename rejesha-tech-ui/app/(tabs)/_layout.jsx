import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets(); // This is the magic hook

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#ff0101ff", // Rejesha Red
          tabBarInactiveTintColor: "#444",
          headerStyle: { backgroundColor: "#899b9eff" },
          headerTitleAlign: "center",
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="profile"
          options={{
            title: "You and",
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" color={color} size={22} />,
          }}
        />
        <Tabs.Screen
          name="repairs"
          options={{
            title: "Fix Your",
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="wrench" color={color} size={22} />,
          }}
        />
        <Tabs.Screen
          name="products"
          options={{
            title: "Buy/Sell",
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="store" color={color} size={22} />,
          }}
        />
        <Tabs.Screen
          name="user_settings"
          options={{
            title: "Setting Rejesha",
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cog" color={color} size={22} />,
          }}
        />
      </Tabs>

      {/* We apply the bottom inset as padding here. 
          This ensures "TECH" sits perfectly above the home bar on iPhone 
          and the virtual buttons on Android.
      */}
      <View style={[
        styles.techFooter, 
        { paddingBottom: Math.max(insets.bottom, 15) } 
      ]}>
        <Text style={styles.footerText}>TECH</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    elevation: 0,
    height: 65, // Gives the bar some breathing room
      paddingBottom: 10, // Removes Android shadow for a flatter look
  },
  techFooter: {
    paddingTop: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 0,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 4,
    color: "#1D2A32",
  },
});