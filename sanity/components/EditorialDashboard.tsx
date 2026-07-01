import React, { useState, useEffect } from 'react';
import { useClient, useCurrentUser } from 'sanity';
import { Card, Stack, Heading, Text, Grid, Box, Button, Flex, Spinner } from '@sanity/ui';
import { 
  FileText, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  PlusCircle, 
  ExternalLink 
} from 'lucide-react';

interface SanityDoc {
  _id: string;
  _type: string;
  title: string;
  _updatedAt: string;
  publishedAt?: string;
  status?: string;
  authorName?: string;
}

export function EditorialDashboard() {
  const client = useClient({ apiVersion: '2023-01-01' });
  const currentUser = useCurrentUser();
  
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<SanityDoc[]>([]);
  const [myArticles, setMyArticles] = useState<SanityDoc[]>([]);
  const [scheduled, setScheduled] = useState<SanityDoc[]>([]);
  const [needsReview, setNeedsReview] = useState<SanityDoc[]>([]);
  const [publishedToday, setPublishedToday] = useState<SanityDoc[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const name = currentUser?.name || '';
        
        // Define today start time ISO string
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayStartISO = todayStart.toISOString();

        // 1. Recent Drafts
        const draftsQuery = `*[_type == "article" && _id in path("drafts.**")] | order(_updatedAt desc)[0..4]{
          _id, _type, title, _updatedAt, status, "authorName": author->name
        }`;
        
        // 2. My Articles
        const myQuery = `*[_type == "article" && author->name == $name] | order(_updatedAt desc)[0..4]{
          _id, _type, title, _updatedAt, status, "authorName": author->name
        }`;

        // 3. Scheduled Posts
        const scheduledQuery = `*[_type == "article" && (status == "scheduled" || publishedAt > now())] | order(publishedAt asc)[0..4]{
          _id, _type, title, _updatedAt, publishedAt, status, "authorName": author->name
        }`;

        // 4. Needs Review
        const reviewQuery = `*[_type == "article" && status == "inReview"] | order(_updatedAt desc)[0..4]{
          _id, _type, title, _updatedAt, status, "authorName": author->name
        }`;

        // 5. Published Today
        const publishedQuery = `*[_type == "article" && status == "published" && publishedAt >= $todayStart] | order(publishedAt desc)[0..4]{
          _id, _type, title, _updatedAt, publishedAt, status, "authorName": author->name
        }`;

        const [rDrafts, rMy, rScheduled, rReview, rPublished] = await Promise.all([
          client.fetch(draftsQuery),
          client.fetch(myQuery, { name }),
          client.fetch(scheduledQuery),
          client.fetch(reviewQuery),
          client.fetch(publishedQuery, { todayStart: todayStartISO })
        ]);

        setDrafts(rDrafts);
        setMyArticles(rMy);
        setScheduled(rScheduled);
        setNeedsReview(rReview);
        setPublishedToday(rPublished);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [client, currentUser]);

  const handleCreateArticle = () => {
    window.location.href = '/studio/intent/create/type=article';
  };

  const getCleanId = (id: string) => {
    return id.replace('drafts.', '');
  };

  const renderDocRow = (doc: SanityDoc) => (
    <Card 
      key={doc._id} 
      padding={3} 
      borderBottom 
      style={{ transition: 'background 0.2s' }}
    >
      <Flex align="center" justify="space-between">
        <Box flex={1} marginRight={3}>
          <Stack space={2}>
            <Text weight="semibold" size={1} style={{ wordBreak: 'break-word' }}>
              {doc.title || 'Untitled'}
            </Text>
            <Flex gap={2} align="center">
              <Text size={0} muted>
                Type: <span style={{ textTransform: 'capitalize' }}>{doc._type}</span>
              </Text>
              <Text size={0} muted>•</Text>
              <Text size={0} muted>
                By: {doc.authorName || 'Unknown'}
              </Text>
            </Flex>
          </Stack>
        </Box>
        <Button
          as="a"
          href={`/studio/intent/edit/id=${getCleanId(doc._id)};type=${doc._type}`}
          mode="ghost"
          size={1}
          icon={ExternalLink}
          text="Edit"
        />
      </Flex>
    </Card>
  );

  const renderSection = (title: string, icon: React.ComponentType<any>, docs: SanityDoc[], emptyMsg: string) => (
    <Card border radius={2} padding={3} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack space={3} style={{ flex: 1 }}>
        <Flex align="center" gap={2} style={{ borderBottom: '1px solid var(--card-border-color)', paddingBottom: '8px' }}>
          {React.createElement(icon, { size: 18, className: 'text-gray-500' })}
          <Heading size={1} style={{ fontWeight: 700 }}>{title}</Heading>
          <Box flex={1} />
          <Text size={0} muted weight="bold">({docs.length})</Text>
        </Flex>
        <Box style={{ overflowY: 'auto', flex: 1, maxHeight: '280px' }}>
          {docs.length === 0 ? (
            <Flex align="center" justify="center" style={{ height: '80px' }}>
              <Text size={1} muted style={{ fontStyle: 'italic' }}>{emptyMsg}</Text>
            </Flex>
          ) : (
            docs.map(renderDocRow)
          )}
        </Box>
      </Stack>
    </Card>
  );

  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ height: '100vh', width: '100%' }}>
        <Spinner size={3} />
        <Box marginLeft={3}>
          <Text size={2}>Loading Editorial Dashboard...</Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Card padding={4} height="fill" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Stack space={4}>
        {/* Dashboard Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={3} style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '16px' }}>
          <Stack space={2}>
            <Heading size={3} style={{ color: '#0f172a', fontWeight: 800 }}>
              Editorial Dashboard
            </Heading>
            <Text size={1} muted>
              Welcome back, <span style={{ fontWeight: 600 }}>{currentUser?.name || 'Editor'}</span>! Here is your workspace status.
            </Text>
          </Stack>
          <Button
            onClick={handleCreateArticle}
            tone="positive"
            icon={PlusCircle}
            text="Quick Create Article"
            style={{ fontWeight: 600 }}
          />
        </Flex>

        {/* Widgets Grid */}
        <Grid columns={[1, 1, 2, 3]} gap={3}>
          {renderSection('Recent Drafts', FileText, drafts, 'No current drafts found.')}
          {renderSection('My Articles', User, myArticles, 'No articles assigned to you.')}
          {renderSection('Scheduled Posts', Clock, scheduled, 'No scheduled posts.')}
          {renderSection('Needs Review', AlertCircle, needsReview, 'No articles in review.')}
          {renderSection('Published Today', CheckCircle2, publishedToday, 'No articles published today.')}
        </Grid>
      </Stack>
    </Card>
  );
}
