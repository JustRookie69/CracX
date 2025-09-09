import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; // 1. Import NavLink instead of useState
import './header.css';

const Header = () => {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const getCurrentGreeting = () => {
            const hour = new Date().getHours();
            if (hour < 12) {
                setGreeting('Good Morning');
            } else if (hour < 18) {
                setGreeting('Good Afternoon');
            } else {
                setGreeting('Good Evening');
            }
        };
        getCurrentGreeting();
    }, []);

    const getRandomGreeting = () => {
        const randomGreetings = [
            'Hello there!',
            'Welcome back!',
            'Nice to see you!',
            'Have a great day!',
        ];
        const randomIndex = Math.floor(Math.random() * randomGreetings.length);
        setGreeting(randomGreetings[randomIndex]);
    };

    return (
        <header className="header">
            <div className="header-top">
                <div className="greeting" onClick={getRandomGreeting}>
                    {greeting}
                </div>
                <div className="profile"> {/* I've renamed My_Watch to profile for consistency */}
                    <button className="profile-button">
                        <img src="https://via.placeholder.com/40" alt="User Profile" />
                    </button>
                </div>
            </div>

            <nav className="header-nav">
                {/* 2. Replace buttons with NavLink. The 'active' class is now handled automatically! */}
                <NavLink to="/" className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}>
                    Home
                </NavLink>
                <NavLink to="/quest" className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}>
                    Quest
                </NavLink>
                <NavLink to="/my-watch" className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}>
                    My Watch
                </NavLink>
            </nav>
        </header>
    );
};

export default Header;