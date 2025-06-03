import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';

const ReviewPending = ({ review, onApprove, onReject }) => {
    return (
        <React.Fragment key={review.id}>
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                        Review ID: {review.id} - Item ID: {review.item_id} (Type: {review.item_type})
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                        <Rating value={review.rating} readOnly size="small" />
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {review.comment.substring(0, 100)}
                        {review.comment.length > 100 ? '...' : ''}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Submitted by: {review.user?.nickname || review.guest_name || 'Anonymous Guest'} on {new Date(review.created_at).toLocaleDateString()}
                    </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            color="success"
                            size="small"
                            onClick={() => onApprove(review.id)}
                        >
                            Approve
                        </Button>
                        <Button
                            color="error"
                            size="small"
                            onClick={() => onReject(review.id)}
                        >
                            Reject
                        </Button>
                    </Box>
                </CardActions>
            </Card>
        </React.Fragment>
    );
}

export default ReviewPending;
