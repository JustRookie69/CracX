import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './questionSection.css';
import { BsGridFill } from 'react-icons/bs';
import { IoSearch } from 'react-icons/io5';
import { VscFilter } from 'react-icons/vsc';
import { FaCalendarDay, FaCheck, FaRegStar } from 'react-icons/fa';
// Import the new data structures
import { topicInfo, questionOfTheDay, allConceptsList, topicsWithConcepts } from '../../data.js';

const QuestionSection = () => {
    const [activeTopic, setActiveTopic] = useState('All Topics');

    const getDifficultyClass = (difficulty) => {
        if (difficulty === 'Easy') return 'difficulty-easy';
        if (difficulty === 'Med.') return 'difficulty-medium';
        if (difficulty === 'Hard') return 'difficulty-hard';
        return '';
    };

    // --- THIS IS THE NEW FILTERING LOGIC ---
    // It decides which list of concepts to show based on the activeTopic state
    const conceptsToDisplay = activeTopic === 'All Topics'
        ? allConceptsList
        : topicsWithConcepts.find(t => t.name === activeTopic)?.concepts || [];

    return (
        <div className="question-section">
            <div className="topics-bar">
                <button
                    className={`topic-btn ${activeTopic === 'All Topics' ? 'active' : ''}`}
                    onClick={() => setActiveTopic('All Topics')}
                >
                    <BsGridFill /> All Topics
                </button>
                {topicInfo.map(topic => (
                    <button
                        key={topic.name}
                        className={`topic-btn ${activeTopic === topic.name ? 'active' : ''}`}
                        onClick={() => setActiveTopic(topic.name)}
                    >
                        {topic.icon} {topic.name}
                    </button>
                ))}
            </div>

            <div className="search-bar">
                <div className="search-input-container">
                    <IoSearch className="search-icon" />
                    <input type="text" placeholder="Search questions" />
                </div>
                <button className="icon-btn"><VscFilter /></button>
                <div className="solved-count">
                    <span>14/3671 Solved</span>
                </div>
            </div>

            <div className="questions-list">
                <div className="question-row qotd">
                    <div className="q-status"><FaCalendarDay style={{ color: '#59A5FF' }}/></div>
                    <div className="q-title">{questionOfTheDay.id}. {questionOfTheDay.title}</div>
                    <div className="q-acceptance">{questionOfTheDay.acceptance}</div>
                    <div className={`q-difficulty ${getDifficultyClass(questionOfTheDay.difficulty)}`}>{questionOfTheDay.difficulty}</div>
                    <div className="q-actions"><FaRegStar /></div>
                </div>

                {/* We now map over the DYNAMIC conceptsToDisplay array */}
                {conceptsToDisplay.map(concept => (
                     <Link
                        to={`/question/${concept.id}`}
                        className="question-row-link"
                        key={concept.id}
                    >
                         <div className="question-row">
                            <div className="q-status">
                                {concept.status === 'solved' && <FaCheck style={{ color: '#00B8A3' }}/>}
                            </div>
                            <div className="q-title">{concept.id}. {concept.title}</div>
                            <div className="q-acceptance">{concept.acceptance}</div>
                            <div className={`q-difficulty ${getDifficultyClass(concept.difficulty)}`}>
                                {concept.difficulty}
                            </div>
                            <div className="q-actions"><FaRegStar /></div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuestionSection;