import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, Avatar, TextField, Button, CircularProgress, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';

interface Comment {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
}

interface CommentListProps {
  postId: number;
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ postId, comments }) => {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>(comments || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post(`/api/news/${postId}/comment`, { content: comment }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setLocalComments([...localComments, res.data]);
      setComment('');
    } catch {}
    setSubmitting(false);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <TextField
          label="Add a comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          fullWidth
          required
          sx={{ mb: 1 }}
        />
        <Button type="submit" variant="contained" disabled={submitting || !comment}>
          {submitting ? <CircularProgress size={20} /> : 'Comment'}
        </Button>
      </form>
      <List>
        {localComments.map(c => (
          <ListItem alignItems="flex-start" key={c.id}>
            <ListItemAvatar>
              <Avatar>{c.authorName[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography fontWeight={600}>{c.authorName}</Typography>}
              secondary={<>
                <Typography variant="body2" color="text.secondary">{new Date(c.createdAt).toLocaleString()}</Typography>
                <Typography variant="body1">{c.content}</Typography>
              </>}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CommentList; 