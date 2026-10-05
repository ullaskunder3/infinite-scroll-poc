import React from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChapterSummary } from '../../../api';
import { colors } from '../../../theme';

export interface ChapterDrawerModalProps {
  visible: boolean;
  onClose: () => void;
  chapters: ChapterSummary[];
  currentChapterId: string;
  onSelectChapter: (chapterId: string, chapterNum: number) => void;
}

export const ChapterDrawerModal: React.FC<ChapterDrawerModalProps> = ({
  visible,
  onClose,
  chapters,
  currentChapterId,
  onSelectChapter,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheetContainer}>
          <View style={styles.sheetHeader}>
            <View style={styles.dragHandle} />
            <View style={styles.headerRow}>
              <Text style={styles.sheetTitle}>Chapters ({chapters.length})</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={chapters}
            keyExtractor={(item) => item.chapterId}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isActive = item.chapterId === currentChapterId;
              return (
                <TouchableOpacity
                  style={[styles.itemCard, isActive && styles.itemCardActive]}
                  activeOpacity={0.75}
                  onPress={() => {
                    onSelectChapter(item.chapterId, item.chapterNum);
                    onClose();
                  }}
                >
                  <Image
                    source={{ uri: item.thumbnailUrl }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.itemInfo}>
                    <View style={styles.itemTopRow}>
                      <Text
                        style={[
                          styles.chapterNum,
                          isActive && styles.chapterNumActive,
                        ]}
                      >
                        Chapter {item.chapterNum}
                      </Text>
                      {isActive && (
                        <View style={styles.readingBadge}>
                          <Text style={styles.readingBadgeText}>Reading</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.itemDesc} numberOfLines={1}>
                      {item.description || `Chapter ${item.chapterNum}`}
                    </Text>
                    <Text style={styles.itemMeta}>
                      📄 {item.pageCount} pages • 👁 {item.views}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  backdrop: {
    ...(StyleSheet.absoluteFill as object),
  },
  sheetContainer: {
    height: '65%',
    backgroundColor: '#0E1612',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  sheetHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2A3C33',
    marginBottom: 8,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#192620',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    gap: 8,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131B17',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  itemCardActive: {
    borderColor: colors.primaryNeon,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#090D0B',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chapterNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chapterNumActive: {
    color: colors.primaryNeon,
  },
  readingBadge: {
    backgroundColor: colors.primaryNeon,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  readingBadgeText: {
    color: '#090D0B',
    fontSize: 9,
    fontWeight: '800',
  },
  itemDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  itemMeta: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
});
