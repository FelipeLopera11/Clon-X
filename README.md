# Clon de X

A React single-page application that recreates selected X social network screens for a class project.

## Milestone 1

This milestone focuses on the interface and navigation. It uses mock data for users, tweets, followers, and following lists.

Authentication, tweet publishing, and follow actions are presentational and are not saved yet.

## Technologies

- React
- Vite
- React Router
- Bootstrap 5.3.8
- Firebase integration is planned for a later milestone.

## Features

- Registration and login screens.
- Home screen with follower and following counters.
- Tweet composition screen.
- Chronological feed with pagination.
- User profile with tweets and counters.
- Alphabetically sorted followers and following lists.
- Pagination with a maximum of 10 items per page.

## Routes

| Route | Page |
| --- | --- |
| `/login` | Login |
| `/register` | Registration |
| `/home` | Home |
| `/compose` | Compose a tweet |
| `/feed` | Feed |
| `/following` | Following list |
| `/followers` | Followers list |
| `/users/:username` | User profile and tweets |

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

## Project Structure

```text
src/
├── components/  # Reusable tweet, user, and pagination components
├── data/        # Mock data for users, tweets, followers, and following
├── pages/       # Application screens
├── App.jsx      # Routes and shared application layout
└── main.jsx     # Application entry point
```

## Team Contributions

- **Felipe:** Follower and following lists, alphabetical sorting, pagination, and related interface functionality.
- **Stidh:** Tweet and user cards, feed, user profile, and related interface functionality.

## Current Limitations

- The application uses mock data.
- Authentication is not connected to a backend.
- Tweet publishing and follow actions are not persisted.
- Firebase integration is planned for a later milestone.
