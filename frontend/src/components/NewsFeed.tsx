import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Button, TextField, Card, CardContent, Avatar, CircularProgress, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import NewsPostCard from './NewsPostCard';
import { Link } from 'react-router-dom';

interface NewsPost {
  id: number;
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  authorName: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  comments: any[];
}

const NewsFeed: React.FC = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/news', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setPosts(res.data);
    } catch (err) {
      setError('Failed to load news feed.');
    }
    setLoading(false);
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    try {
      await axios.post('/api/news', newPost, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setNewPost({ title: '', content: '' });
      setOpenSnackbar(true);
      fetchPosts();
    } catch (err) {
      setError('Failed to post news.');
    }
    setPosting(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight={700}>News Feed</Typography>
        <Button component={Link} to="/news/external" variant="outlined">External News</Button>
      </Box>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <form onSubmit={handlePost}>
              <Typography variant="h6" mb={1}>Share something with the network</Typography>
              <TextField
                label="Title"
                value={newPost.title}
                onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Content"
                value={newPost.content}
                onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                fullWidth
                multiline
                minRows={3}
                required
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" disabled={posting}>
                {posting ? <CircularProgress size={24} /> : 'Post'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        posts.map(post => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * post.id }}>
            <NewsPostCard post={post} onLike={fetchPosts} />
          </motion.div>
        ))
      )}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          News posted successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewsFeed; 