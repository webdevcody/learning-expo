import { useUser } from "@clerk/clerk-expo";

// Nickname e.g. beto@expo.io -> beto
export const useUserIdAndNickname = () => {
  const user = useUser().user;
  return [user.id, user.primaryEmailAddress.emailAddress.split("@")[0]];
};
