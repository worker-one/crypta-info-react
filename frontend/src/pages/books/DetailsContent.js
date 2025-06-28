import React from 'react';
import { useOutletContext } from 'react-router';
import BookDetails from '../../components/Books/Details';
import ReviewsSection from '../../components/Reviews/ReviewsSection';

const BookDetailsContent = () => {
    const { book, onRatingClick } = useOutletContext();

    return (
        <>
            <BookDetails book={book} onRatingSelect={onRatingClick} />
            <ReviewsSection itemId={book.id} itemName={book.name} />
        </>
    );
};

export default BookDetailsContent;
