import React from 'react';
import { useParams } from 'react-router-dom';
import { questionDetailsData } from '../../data';
// Ensure this path matches your file structure and that the file is named "SubTopicAccordion.js"
import SubTopicAccordion from '../../components/subTopicAccordion/SubTopicAccordion';
import { FaRegStar, FaRegBookmark } from 'react-icons/fa';
import './questionDetailPage.css';

const QuestionDetailPage = () => {
    const { questionId } = useParams();
    const questionData = questionDetailsData[questionId];

    if (!questionData) {
        return <div className="detail-page"><h2>Concept Not Found</h2></div>;
    }

    return (
        <div className="detail-page">
            <header className="detail-header">
                <h1>{questionData.title}</h1>
                <div className="detail-actions">
                    <button className="action-btn"><FaRegStar /> Star Topic</button>
                </div>
            </header>
            <div className="subtopic-list">
                {questionData.subTopics.map(subTopic => (
                    <SubTopicAccordion key={subTopic.name} subTopic={subTopic} />
                ))}
            </div>
        </div>
    );
};

export default QuestionDetailPage;