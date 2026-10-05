import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ComicPage } from '../../../api';
import { colors } from '../../../theme';
import { BookPageView } from './BookPageView';
import { ComicSvgLoader } from './ComicSvgLoader';
import { PinchZoomWrapper } from './PinchZoomWrapper';
import { SinglePageView } from './SinglePageView';

export interface ReaderContentProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isBookView: boolean;
  pages: ComicPage[];
  screenWidth: number;
  screenHeight: number;
  onTap: () => void;
}

export const ReaderContent: React.FC<ReaderContentProps> = ({
  isLoading,
  isError,
  error,
  refetch,
  isBookView,
  pages,
  screenWidth,
  screenHeight,
  onTap,
}) => {
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ComicSvgLoader size={64} color={colors.primaryNeon} />
        <Text style={styles.statusText}>Loading chapter...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Failed to load chapter</Text>
        <Text style={styles.errorMessage}>{error?.message}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <PinchZoomWrapper onTap={onTap}>
      {isBookView ? (
        <BookPageView
          pages={pages}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          onTap={onTap}
        />
      ) : (
        <SinglePageView
          pages={pages}
          screenWidth={screenWidth}
          onTap={onTap}
        />
      )}
    </PinchZoomWrapper>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  statusText: {
    marginTop: 10,
    color: colors.textSecondaryDark,
    fontSize: 13,
  },
  errorTitle: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '700',
  },
  errorMessage: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: colors.primaryNeon,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 14,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
