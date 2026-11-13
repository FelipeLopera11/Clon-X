# Clon-X

A React single-page application inspired by the X social network, developed as a class project. The application allows users to register, log in, publish tweets, interact with posts, and connect with other users.

## Technologies

- React 19
- Vite
- React Router
- Bootstrap 5.3.8
- Firebase Authentication
- Cloud Firestore
- JavaScript
- Git and GitHub

## Project Milestones

### Milestone 1 – User Interface and Navigation

This milestone focused on building the initial application structure, user interface, and navigation using React.

**Features:**
- Registration and login screens.
- Home screen with follower and following counters.
- Tweet composition interface.
- Chronological feed with pagination.
- User profile displaying tweets and counters.
- Followers and following lists.
- Alphabetical sorting of users by full name.
- Pagination with a maximum of 10 items per page.
- Shared navigation header with username and logout option.

### Milestone 2 – Firebase Integration and Social Features

This milestone focused on connecting the application to Firebase and implementing the main user and tweet operations.

**Features:**
- User registration with full name, username, email, and password.
- Username uniqueness validation.
- Login using username and password.
- Google authentication.
- Firebase Authentication integration.
- Cloud Firestore integration for storing user and tweet data.
- Tweet creation with a maximum length of 280 characters.
- Feed displaying tweets from the current user and followed accounts.
- Follow users by username.
- Follow and unfollow functionality.
- Follower and following counters.

### Milestone 3 – User Connections and Tweet Interactions

This milestone expanded the social features and improved navigation between user profiles and their connections.

**Features:**
- Paginated following lists.
- Paginated followers lists.
- Ability to follow users directly from the followers list.
- Follower and following counters on user profile pages.
- Follow and unfollow users from their profile pages.
- View another user's followers and following lists.
- Alphabetical sorting and pagination for user connection lists.
- Like and unlike tweets.
- Share and repost existing tweets.
- Improved tweet cards and social interaction interface.

## Routes

| Route | Page |
| --- | --- |
| `/login` | Login |
| `/register` | Registration |
| `/home` | Home |
| `/compose` | Compose a tweet |
| `/feed` | Feed |
| `/following` | Current user's following list |
| `/followers` | Current user's followers list |
| `/users/:username` | User profile and tweets |
| `/users/:username/:type` | User's followers or following list |

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

Clone the repository and navigate to the project folder:

```bash
git clone https://github.com/FelipeLopera11/Clon-X.git
cd Clon-X
```

Install dependencies:

**Windows PowerShell:**

```powershell
npm.cmd install
npm.cmd run dev
```

**Other terminals:**

```bash
npm install
npm run dev
```

Open the local URL displayed in the terminal.

## Firebase Configuration

To run the application with your own Firebase project:

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable Email/Password and Google sign-in providers in Firebase Authentication.
3. Create a Cloud Firestore database.
4. Configure the Firebase credentials in `src/firebase.js`.
5. Configure the required Firestore security rules.

## Project Structure

```text
src/
├── components/    # Reusable UI components
├── pages/         # Application pages
├── firebase.js    # Firebase configuration
├── auth.js        # Authentication functions
├── social.js      # Social features and Firestore operations
├── App.jsx        # Routes and shared application layout
├── App.css        # Application styles
├── index.css      # Global styles
└── main.jsx       # Application entry point
```

## Team Contributions

- **Felipe:** Follower and following lists, alphabetical sorting, pagination, and related interface functionality.
- **Stidh:** Tweet and user cards, feed, user profile, and related interface functionality.

## Current Limitations

- The application requires a valid Firebase project configuration to use its backend features.
- Firebase Authentication providers and Firestore security rules must be configured before running the application with a different Firebase project.

## Project Goal

The goal of Clon-X is to recreate the main features of a social networking platform while practicing React development, Firebase integration, database operations, authentication, Git workflows, and collaborative software development.