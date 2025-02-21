import { BodyScrollView } from "@/components/ui/BodyScrollView";
import { StyleSheet, Text, View } from "react-native";

import * as AC from "@bacons/apple-colors";
import { FadeIn } from "@/components/ui/FadeIn";
import { useState } from "react";
import TouchableBounce from "@/components/ui/TouchableBounce";
import Skeleton from "@/components/ui/Skeleton";
import { IconSymbol } from "@/components/ui/IconSymbol";
export default function Page() {
  return (
    <BodyScrollView>
      <View style={styles.container}>
        <View style={styles.main}>
          <Text style={styles.title}>Hello World</Text>
          <Text style={styles.subtitle}>
            This is the first page of your app.
          </Text>

          <FadeInTest />

          <TouchableBounce>
            <Text>TouchableBounce</Text>
          </TouchableBounce>

          <Skeleton />

          <Skeleton dark />

          <IconSymbol name="star.bubble.fill" color={AC.systemCyan} />
        </View>
      </View>
    </BodyScrollView>
  );
}

function FadeInTest() {
  const [show, setShow] = useState(false);
  return (
    <>
      <Text onPress={() => setShow(!show)}>Toggle</Text>
      {show && (
        <FadeIn>
          <Text>FadeIn</Text>
        </FadeIn>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
    color: AC.label,
  },
  subtitle: {
    fontSize: 36,
    color: AC.secondaryLabel,
  },
});
