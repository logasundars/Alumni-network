import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box, IconButton, Avatar, Collapse, CircularProgress } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { motion } from 'framer-motion';
import CommentList from './CommentList';

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

interface NewsPostCardProps {
  post: NewsPost;
  onLike: () => void;
}

const NewsPostCard: React.FC<NewsPostCardProps> = ({ post, onLike }) => {
  const [expanded, setExpanded] = useState(false);
  const [liking, setLiking] = useState(false);
  const [liked, setLiked] = useState(false); // For demo, ideally get from backend

  const handleLike = async () => {
    setLiking(true);
    try {
      await axios.post(`/api/news/${post.id}/like`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setLiked(true);
      onLike();
    } catch {}
    setLiking(false);
  };

  const handleUnlike = async () => {
    setLiking(true);
    try {
      await axios.post(`/api/news/${post.id}/unlike`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setLiked(false);
      onLike();
    } catch {}
    setLiking(false);
  };

  return (
    <motion.div whileHover={{ scale: 1.01 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Avatar sx={{ mr: 2 }}>{post.authorName[0]}</Avatar>
            <Box>
              <Typography fontWeight={600}>{post.authorName}</Typography>
              <Typography variant="caption" color="text.secondary">{new Date(post.createdAt).toLocaleString()}</Typography>
            </Box>
          </Box>
          <Typography variant="h6" mb={1}>{post.title}</Typography>
          <Typography mb={2}>{post.content}</Typography>
          <Box display="flex" alignItems="center">
            <IconButton color={liked ? 'error' : 'default'} onClick={liked ? handleUnlike : handleLike} disabled={liking}>
              {liking ? <CircularProgress size={20} /> : liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2" mr={2}>{post.likeCount} Likes</Typography>
            <IconButton onClick={() => setExpanded(e => !e)}>
              <ChatBubbleOutlineIcon />
            </IconButton>
            <Typography variant="body2">{post.commentCount} Comments</Typography>
          </Box>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box mt={2}>
              <CommentList postId={post.id} comments={post.comments} />
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NewsPostCard; 