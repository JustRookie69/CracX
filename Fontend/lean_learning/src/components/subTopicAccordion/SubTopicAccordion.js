import React, { useState } from 'react';
import { FaChevronRight, FaCheck, FaRegStar, FaStar, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import './subTopicAccordion.css';

const SubTopicAccordion = ({ subTopic }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isStarred, setIsStarred] = useState(false);
    // Use a Set for efficient adding/checking/deleting of bookmarked question IDs
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());

    const toggleBookmark = (questionId) => {
        setBookmarkedQuestions(prevBookmarked => {
            const newBookmarked = new Set(prevBookmarked);
            if (newBookmarked.has(questionId)) {
                newBookmarked.delete(questionId);
            } else {
                newBookmarked.add(questionId);
            }
            return newBookmarked;
        });
    };

    const getDifficultyClass = (difficulty) => {
        if (difficulty === 'Easy') return 'difficulty-easy';
        if (difficulty === 'Med.') return 'difficulty-medium';
        if (difficulty === 'Hard') return 'difficulty-hard';
        return '';
    };

    return (
        <div className="accordion-item">
            <div className="accordion-header">
                <button className="accordion-toggle" onClick={() => setIsOpen(!isOpen)}>
                    <FaChevronRight className={`chevron-icon ${isOpen ? 'open' : ''}`} />
                    <span className="accordion-title">{subTopic.name}</span>
                </button>
                <button
                    className="star-btn"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent accordion from toggling
                        setIsStarred(!isStarred);
                    }}
                >
                    {isStarred ? <FaStar className="star-filled" /> : <FaRegStar />}
                </button>
            </div>
            {isOpen && (
                <div className="accordion-content">
                    {subTopic.questions.map(q => (
                        <div className="question-row" key={q.id}>
                            <div className="q-status">{q.status === 'solved' && <FaCheck style={{ color: '#00B8A3' }}/>}</div>
                            <div className="q-title">{q.id}. {q.title}</div>
                            <div className="q-acceptance">{q.acceptance}</div>
                            <div className={`q-difficulty ${getDifficultyClass(q.difficulty)}`}>{q.difficulty}</div>
                            <div className="q-actions">
                                <button
                                    className="bookmark-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleBookmark(q.id);
                                    }}
                                >
                                    {bookmarkedQuestions.has(q.id) ? <FaBookmark /> : <FaRegBookmark />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubTopicAccordion;