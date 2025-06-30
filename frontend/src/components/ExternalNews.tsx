import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardContent, CardMedia, Box, CircularProgress, Alert, Button } from '@mui/material';
import { motion } from 'framer-motion';

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
}

const API_KEY = 'YOUR_NEWSAPI_KEY'; // Replace with your NewsAPI.org key
const NEWS_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

const ExternalNews: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExternalNews();
  }, []);

  const fetchExternalNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(NEWS_URL);
      setArticles(res.data.articles);
    } catch (err) {
      setError('Failed to fetch external news.');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight={700}>External News</Typography>
        <Button href="/news" variant="outlined">Back to News Feed</Button>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        articles.map((article, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}>
            <Card sx={{ mb: 3, display: 'flex' }}>
              {article.urlToImage && (
                <CardMedia component="img" sx={{ width: 200 }} image={article.urlToImage} alt={article.title} />
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>{article.title}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>{article.source.name} • {new Date(article.publishedAt).toLocaleString()}</Typography>
                  <Typography variant="body1" mb={1}>{article.description}</Typography>
                  <Button href={article.url} target="_blank" rel="noopener" variant="contained" size="small">Read More</Button>
                </CardContent>
              </Box>
            </Card>
          </motion.div>
        ))
      )}
    </Container>
  );
};

export default ExternalNews; 