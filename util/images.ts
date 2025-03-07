export function getImageUrl(imageKey: string) {
  return `${process.env.EXPO_PUBLIC_FILE_HOST_BASE_URL}/${imageKey}`;
}
