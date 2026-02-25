import React, {useCallback, useState} from 'react';
import {
  Alert,
  FlatList,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PrimaryButton} from '../components/common/PrimaryButton';
import {SearchField} from '../components/common/SearchField';
import {StatusMessage} from '../components/common/StatusMessage';
import {ArticleCard} from '../components/news/ArticleCard';
import {useNews} from '../hooks/useNews';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {NewsArticle} from '../types/news';

export function HomeScreen(): React.JSX.Element {
  const {
    query,
    setQuery,
    findQuery,
    setFindQuery,
    maxResults,
    setMaxResults,
    loading,
    error,
    loadedCount,
    articles,
    loadTopHeadlines,
    runBestSearch,
  } = useNews();

  const [hasLoaded, setHasLoaded] = useState(false);

  const handleTopHeadlines = async () => {
    await loadTopHeadlines();
    setHasLoaded(true);
  };

  const handleSearch = async () => {
    await runBestSearch();
    setHasLoaded(true);
  };

  const handleOpenArticle = useCallback(async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert('Invalid URL', 'Cannot open this article URL.');
      return;
    }
    await Linking.openURL(url);
  }, []);

  const renderItem = useCallback(
    ({item}: {item: NewsArticle}) => (
      <ArticleCard article={item} onOpen={handleOpenArticle} />
    ),
    [handleOpenArticle],
  );

  const emptyMessage = hasLoaded
    ? 'No articles found. Try a different keyword.'
    : 'Tap "Top Headlines" to load articles.';

  const hasKeyword = query.trim().length > 0;
  const hasTitleOrAuthor = findQuery.trim().length > 0;

  const primaryActionLabel = !hasKeyword && !hasTitleOrAuthor
    ? 'Top Headlines'
    : hasKeyword && hasTitleOrAuthor
      ? 'Search with Filters'
      : hasKeyword
        ? 'Search Keywords'
        : 'Find Title/Author';

  const modeHint = !hasKeyword && !hasTitleOrAuthor
    ? 'No input: fetch top headlines.'
    : hasKeyword && hasTitleOrAuthor
      ? 'Both inputs: keyword search first, then narrowed by title/author.'
      : hasKeyword
        ? 'Keyword mode: search by keyword.'
        : 'Title/author mode: find by title or author/source.';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle='dark-content' backgroundColor={colors.background} />
      <FlatList
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps='handled'
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.url}-${index}`}
        onRefresh={handleTopHeadlines}
        refreshing={loading}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>News Mobile App</Text>
            <Text style={styles.subtitle}>
              Fetch top headlines. Search by keyword and optionally narrow by title or
              author/source in one step.
            </Text>

            <View style={styles.searchCard}>
              <Text style={styles.searchCardTitle}>Search Controls</Text>
              <Text style={styles.searchCardHint}>{modeHint}</Text>

              <SearchField
                label='Number of articles (1-10)'
                placeholder='10'
                value={maxResults}
                onChangeText={setMaxResults}
                keyboardType='number-pad'
              />

              <SearchField
                label='Keyword (API)'
                placeholder='e.g. bitcoin, tesla, election'
                value={query}
                onChangeText={setQuery}
              />
              <SearchField
                label='Title or author/source (optional)'
                placeholder='e.g. Elon Musk or BBC News'
                value={findQuery}
                onChangeText={setFindQuery}
              />

              <View style={styles.actions}>
                <View style={styles.actionItem}>
                  <PrimaryButton
                    label={primaryActionLabel}
                    onPress={handleSearch}
                    disabled={loading}
                  />
                </View>
              </View>

              {(hasKeyword || hasTitleOrAuthor) && (
                <View style={styles.secondaryAction}>
                  <PrimaryButton
                    label='Top Headlines'
                    onPress={handleTopHeadlines}
                    disabled={loading}
                    variant='secondary'
                  />
                </View>
              )}
            </View>

            {error ? <StatusMessage tone='error' message={error} /> : null}
            <Text style={styles.countLabel}>
              Showing {articles.length} article(s) from {loadedCount} loaded
            </Text>
          </View>
        }
        ListEmptyComponent={!loading ? <StatusMessage message={emptyMessage} /> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  actions: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionItem: {
    flex: 1,
  },
  secondaryAction: {
    marginTop: spacing.sm,
  },
  countLabel: {
    marginTop: spacing.md,
    fontSize: 12,
    color: colors.textSecondary,
  },
  searchCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    shadowColor: '#102A43',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  searchCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  searchCardHint: {
    marginTop: spacing.xs,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
});