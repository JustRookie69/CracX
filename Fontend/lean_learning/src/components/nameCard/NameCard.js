import React, { useState, useMemo } from 'react';
import './nameCard.css';
import { FaChrome } from 'react-icons/fa'; // Using react-icons for a logo

// --- Helper Functions ---

// Generates a realistic grid for a specific month and year
const generateDataForMonth = (year, month) => {
    const data = [];
    const date = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ...

    // 1. Add empty placeholder boxes for days before the 1st of the month
    for (let i = 0; i < startDayOfWeek; i++) {
        data.push({ type: 'placeholder' });
    }

    // 2. Add a box for each day of the month with dummy data
    for (let i = 1; i <= daysInMonth; i++) {
        data.push({
            type: 'day',
            day: i,
            count: Math.floor(Math.random() * 11) // Random questions (0-10)
        });
    }
    return data;
};

// Determines the color of the box based on the count
const getBoxColorLevel = (count) => {
    if (count === 0) return 'level-0';
    if (count >= 1 && count <= 2) return 'level-1';
    if (count >= 3 && count <= 5) return 'level-2';
    if (count >= 6 && count <= 8) return 'level-3';
    return 'level-4';
};


// --- Component ---

const NameCard = () => {
    // Defaulting to expanded view to match your screenshot
    const [isGraphExpanded, setIsGraphExpanded] = useState(false);
    // State to manage the selected date for the expanded view
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Dummy data for the user profile
    const userData = {
        name: 'Shivansh Yadav',
        title: 'Ace Master',
        rank: '#123',
        league: 'Chrome',
        institute: 'Google University',
        totalQuestions: 542,
        photoUrl: 'https://via.placeholder.com/100',
    };

    // --- Date and Dropdown Logic ---
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i).reverse();
    const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

    const handleMonthChange = (e) => {
        const newMonth = parseInt(e.target.value, 10);
        setSelectedDate(new Date(selectedDate.getFullYear(), newMonth, 1));
    };

    const handleYearChange = (e) => {
        const newYear = parseInt(e.target.value, 10);
        setSelectedDate(new Date(newYear, selectedDate.getMonth(), 1));
    };

    // useMemo ensures the graph data is only recalculated when the date changes
    const activityForMonth = useMemo(() =>
        generateDataForMonth(selectedDate.getFullYear(), selectedDate.getMonth()),
        [selectedDate]
    );

    // Data for the collapsed view (always shows the last 7 days)
    const activityForWeek = useMemo(() =>
        Array.from({ length: 7 }).map(() => ({ type: 'day', count: Math.floor(Math.random() * 11) })),
        []
    );

    return (
        <div className="name-card">
            <div className="card-main-content">
                {/* --- COLUMN 1: Profile Visuals (Photo, Rank) --- */}
                <div className="card-profile-visual">
                    <p className="user-title">{userData.title}</p>
                    <div className="user-photo">
                        <img src={userData.photoUrl} alt="User Profile" />
                    </div>
                    <div className="rank-info">
                        <div className="league-logo" title={userData.league}>
                            <FaChrome size="20" />
                        </div>
                        <span className="user-rank">{userData.rank}</span>
                    </div>
                </div>

                {/* --- COLUMN 2: User Details (Name, Institute) --- */}
                <div className="card-details">
                    <h2 className="user-name">{userData.name}</h2>
                    <p className="user-stat">{userData.totalQuestions} Questions Solved</p>
                    <p className="user-detail"><strong>Institute:</strong> {userData.institute}</p>
                </div>
            </div>

            {/* --- Bottom Section: Contribution Graph --- */}
            <div className="contribution-container">
                <div className="graph-header">
                    {isGraphExpanded ? (
                        <div className="date-selectors">
                            <select value={selectedDate.getMonth()} onChange={handleMonthChange}>
                                {months.map((month, index) => (
                                    <option key={month} value={index}>{month}</option>
                                ))}
                            </select>
                            <select value={selectedDate.getFullYear()} onChange={handleYearChange}>
                                {years.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                    ) : (
                        <p className="graph-date-info">
                            This Week: {months[new Date().getMonth()]} {new Date().getFullYear()}
                        </p>
                    )}
                </div>

                <div
                    className={`contribution-graph ${isGraphExpanded ? 'expanded' : 'collapsed'}`}
                    onClick={() => setIsGraphExpanded(!isGraphExpanded)}
                >
                    {(isGraphExpanded ? activityForMonth : activityForWeek).map((day, index) => {
                        if (day.type === 'placeholder') {
                            return <div key={`ph-${index}`} className="day-box placeholder"></div>;
                        }
                        return (
                            <div
                                key={index}
                                className={`day-box ${getBoxColorLevel(day.count)}`}
                                title={`${day.count} questions`}
                            ></div>
                        );
                    })}
                </div>
                 <p className="graph-toggle-hint">
                    Click graph to show {isGraphExpanded ? 'less' : 'more'}
                </p>
            </div>
        </div>
    );
};

export default NameCard;