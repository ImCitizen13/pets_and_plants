import { Entry } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'entries';

export async function saveEntry(entry: Entry) {
  const data = await getAllEntries();
  data.push(entry);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function getAllEntries(): Promise<Entry[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function updateEntry(entry: Entry) {
  const data = await getAllEntries();
  const updated = data.map((e) => (e.id === entry.id ? entry : e));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
