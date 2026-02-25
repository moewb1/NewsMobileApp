import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {NewsArticle} from '../../types/news';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {formatPublishedAt} from '../../utils/date';
import {PrimaryButton} from '../common/PrimaryButton';

type ArticleCardProps = {
  article: NewsArticle;
  onOpen: (url: string) => void;
};

export function ArticleCard({article, onOpen}: ArticleCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      {article.image ? (
        <Image source={{uri: article.image}} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No image</Text>
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.meta}>
          {article.source?.name || 'Unknown source'} • {formatPublishedAt(article.publishedAt)}
        </Text>
        <Text style={styles.description}>
          {article.description || 'No description provided.'}
        </Text>
        <PrimaryButton
          label="Open Article"
          onPress={() => onOpen(article.url)}
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.md,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  image: {
    height: 180,
    width: '100%',
  },
  imagePlaceholder: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF1F7',
  },
  imagePlaceholderText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  body: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  meta: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.textSecondary,
  },
  description: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
});