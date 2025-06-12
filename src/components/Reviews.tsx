import React from 'react';

const Reviews = ({ reviews, onLeaveReview }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <button onClick={onLeaveReview}>Оставить отзыв</button>
      </div>
    );
  }

  return (
    <div>
      {reviews.map((review) => (
        <div key={review.id}>
          <h3>{review.author}</h3>
          <p>{review.content}</p>
        </div>
      ))}
      <button onClick={onLeaveReview}>Оставить отзыв</button>
    </div>
  );
};

export default Reviews;