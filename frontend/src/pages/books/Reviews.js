import React from 'react';
import { useOutletContext } from 'react-router';
import ReviewsSection from '../../components/Reviews/ReviewsSection';

const BookReviewsPage = () => {
    const { book, reviewFormOpen, preselectedRating, setReviewFormOpen, onCloseSubmitForm } = useOutletContext();

    return (
        <ReviewsSection 
            itemId={book.id} 
            itemName={book.name} 
            preselectedRating={preselectedRating}
            reviewFormOpen={reviewFormOpen}
            setReviewFormOpen={setReviewFormOpen}
            onCloseSubmitForm={onCloseSubmitForm}
        />
    );
};

export default BookReviewsPage;
