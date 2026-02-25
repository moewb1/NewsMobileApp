import React, {useCallback, useState} from 'react';
import {
  Alert,
  FlatList,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
    finder,
    setFinder,
    maxResults,
    setMaxResults,
    loading,
    error,
    loadedCount,
    visibleArticles,
    loadTopHeadlines,
    searchByKeyword,
  } = useNews();

  const [hasLoaded, setHasLoaded] = useState(false);

  const handleTopHeadlines = async () => {
    await loadTopHeadlines();
    setHasLoaded(true);
  };

  const handleSearch = async () => {
    await searchByKeyword();
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <FlatList
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        data={visibleArticles}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.url}-${index}`}
        onRefresh={handleTopHeadlines}
        refreshing={loading}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>News Mobile App</Text>
            <Text style={styles.subtitle}>
              Fetch top headlines, search by keyword, and find by title/author.
            </Text>

            <SearchField
              label="Number of articles (1-50)"
              placeholder="10"
              value={maxResults}
              onChangeText={setMaxResults}
              keyboardType="number-pad"
            />

            <SearchField
              label="Search by keyword (API)"
              placeholder="e.g. bitcoin OR tesla"
              value={query}
              onChangeText={setQuery}
            />

            <View style={styles.actions}>
              <View style={styles.actionItem}>
                <PrimaryButton
                  label="Top Headlines"
                  onPress={handleTopHeadlines}
                  disabled={loading}
                />
              </View>
              <View style={styles.actionSpacer} />
              <View style={styles.actionItem}>
                <PrimaryButton
                  label="Search Keywords"
                  onPress={handleSearch}
                  disabled={loading}
                />
              </View>
            </View>

            <SearchField
              label="Find by title or author/source (local)"
              placeholder="Type title or source"
              value={finder}
              onChangeText={setFinder}
            />

            {error ? <StatusMessage tone="error" message={error} /> : null}
            <Text style={styles.countLabel}>
              Showing {visibleArticles.length} article(s) from {loadedCount} loaded
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
  actionSpacer: {
    width: spacing.sm,
  },
  countLabel: {
    marginTop: spacing.md,
    fontSize: 12,
    color: colors.textSecondary,
  },
});