# Z-PiggyBank — Requirements Document 🐷💸

# 1. Project Overview

## Project Name

Z-PiggyBank

## Project Type

Gamified Savings & Financial Goal Tracking Platform for Gen Z

## Vision

Z-PiggyBank transforms saving money into an interactive progression experience where users build streaks, gain XP, unlock levels, and visually grow 3D financial worlds while achieving real-life goals.

Instead of traditional budgeting apps, the platform focuses on:

* motivation
* progression
* visual growth
* consistency
* gamification psychology

---

# 2. Problem Statement

Most finance apps:

* feel overwhelming
* are too corporate
* focus heavily on expense tracking
* fail to motivate consistent saving habits

Gen Z users need:

* engaging interfaces
* rewarding progression
* simple savings systems
* visually satisfying experiences

Z-PiggyBank solves this by turning financial growth into a game-like journey.

---

# 3. Objectives

The platform should:

* encourage consistent saving habits
* help users complete financial goals
* provide visual motivation
* create addictive progression systems
* simplify beginner finance concepts
* make saving feel rewarding

---

# 4. Core Features

# 4.1 Goal-Based Savings System

Users can:

* create goals
* set target amounts
* arrange goals in order
* track completion progress

Example goals:

* Laptop
* Travel
* Emergency Fund
* Gaming Setup

Each goal acts as a progression level.

---

# 4.2 Savings Plans

Users can create:

* daily savings plans
* weekly savings plans
* monthly savings plans

Example:

* Save ₹100 daily
* Save ₹500 weekly

Features:

* reminder notifications
* progress tracking
* consistency rewards

---

# 4.3 Proof Submission (Optional)

Users may optionally upload:

* screenshots
* wallet transfers
* piggy bank photos

Purpose:

* accountability
* motivation
* habit building

---

# 4.4 Gamification System

## XP System

Users earn XP for:

* saving money
* maintaining streaks
* completing goals

## Level System

Example:

* Level 1 → Beginner Saver
* Level 5 → Smart Planner
* Level 10 → Wealth Builder

## Badges & Achievements

Examples:

* 7-Day Saving Streak
* Goal Completed
* First ₹10,000 Saved

---

# 4.5 Streak System

Users maintain streaks by:

* saving consistently
* completing plans on time

Missing savings may:

* reduce streaks
* affect XP progression

---

# 4.6 3D Savings World (Main Feature)

The platform visualizes financial progress using:

* Three.js
* React Three Fiber

Savings progression visually transforms a virtual world.

Examples:

* islands grow
* buildings unlock
* bridges appear
* environments evolve
* visual effects improve

Each completed goal unlocks a new themed environment.

---

# 4.7 Beginner Investment Learning

Educational-only section.

Provides:

* SIP explanations
* mutual fund basics
* beginner investing concepts
* safe educational resources

The platform does NOT:

* provide trading
* handle investments
* give financial advice

---

# 5. Functional Requirements

# User Authentication

The system shall allow:

* signup
* login
* Google authentication
* protected sessions

---

# Goal Management

The system shall allow users to:

* create goals
* edit goals
* delete goals
* reorder goals
* mark goals completed

---

# Savings Tracking

The system shall:

* store savings progress
* update percentages
* calculate completion progress
* maintain streaks

---

# Notifications

The system shall:

* send saving reminders
* support daily/weekly/monthly plans
* notify users of streak achievements

---

# Gamification

The system shall:

* calculate XP
* assign levels
* unlock achievements
* update streaks

---

# 3D World System

The system shall:

* display progression visually
* update environments based on savings
* unlock new worlds after goal completion

---

# 6. Non-Functional Requirements

## Performance

* smooth animations
* responsive UI
* optimized rendering

---

## Scalability

The architecture should support:

* additional worlds
* future social systems
* more gamification features

---

## Security

The system should:

* protect user data
* implement secure authentication
* restrict user-specific data access

---

## Usability

The UI should:

* feel playful
* remain intuitive
* work on mobile devices
* maintain accessibility

---

# 7. Tech Stack

# Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* ShadCN UI
* Framer Motion
* Three.js
* React Three Fiber

---

# Backend

* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Storage

---

# Notifications

* OneSignal
  OR
* Firebase Cloud Messaging

---

# 8. Database Requirements

The database should store:

* user profiles
* goals
* savings progress
* streaks
* XP levels
* achievements
* uploaded proofs
* 3D world states

---

# 9. MVP Scope

# Included in MVP

✅ Landing page
✅ Goal system
✅ Savings plans
✅ XP + streak system
✅ Basic 3D progression
✅ Authentication

---

# Excluded from MVP

❌ Expense tracker
❌ Direct investment handling
❌ Social leaderboards
❌ AI assistant
❌ Banking integrations

---

# 10. Future Scope

Potential future features:

* social challenges
* friend streaks
* AI savings assistant
* advanced 3D worlds
* finance analytics
* achievement marketplace

---

# 11. Success Criteria

The project is successful if users:

* save consistently
* complete goals
* remain engaged through gamification
* enjoy the visual progression system

---

# 12. Current Development Priority

1. Landing page UI
2. Goal system
3. Savings tracking
4. XP/streak logic
5. Three.js progression
6. Supabase integration

---

# 13. Target Audience

Primary Audience:

* Gen Z students
* young professionals
* beginner savers
* users new to finance

Secondary Audience:

* anyone wanting motivational saving systems

---

# 14. Key Differentiator

Unlike traditional finance apps, Z-PiggyBank focuses on:

* emotional motivation
* visual progression
* game mechanics
* immersive financial journeys

The core innovation is:

> turning savings goals into evolving virtual worlds.
