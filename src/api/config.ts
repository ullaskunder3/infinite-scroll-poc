import { Platform } from 'react-native';

export const API_BASE_URL = Platform.select({
    android: 'http://localhost:3001'
});