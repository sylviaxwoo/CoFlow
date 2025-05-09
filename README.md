# Official Project Repo for CS 546 Final Project: CoFlow

<<<<<<< HEAD

update test
=======
## Project Description
CoFlow aims to create a vibrant learning community where students can collaborate effectively. Users can:
- Browse groups by category or create their own with customized parameters.
- Connect via personalized profiles, direct messaging, and integrated calendars.
- Engage in a rewarding experience with ratings, badges, and achievements.

By leveraging PWA capabilities, CoFlow ensures accessibility and a native-like experience on mobile devices, making it easy for students to study together anytime, anywhere.


## Team Members
- **Tingting Luan**
- **Xuan Wu**
- **Deming Tracy**
- **Vaibhav Achuthananda**


## Features

### User Experience
- **User Accounts & Profiles**:
  - Personalized profiles with:
    - Name/Username
    - Academic interests and subjects
    - Profile picture and brief bio
    - Custom calendar view of schedules (Private/Public)
- **Progressive Web App (PWA)**:
  - Deployable as a standalone iOS/Android app for a native-like experience.

### Group Discovery & Management
- **Group Recommendations**:
  - Dashboard displaying available groups with clear indicators for:
    - Group availability
    - Capacity
    - Scheduling details
- **Group Management**:
  - Intuitive group creation wizard for organizers to:
    - Create, edit, and delete groups
    - Customize settings for group size, participant requirements, duration, and time preferences
  - Post-session rating system for constructive feedback

### Communication & Collaboration
- **Group Communication**:
  - Built-in chat feature for group members, tentatively powered by [Utterances](https://utteranc.es/) (a free/open-source tool built on GitHub Issues API).
- **Conflict Detection**:
  - Prevents users from joining groups with conflicting time slots, inspired by Workday’s course scheduling system.
- **Visual Indicators**:
  - Dynamic tags (e.g., `#one-on-one`, `#study-group`, `#gaming`, `#music-practice`) to indicate group type at a glance.
- **Email Notifications**:
  - Customizable reminders for events, sent via email at user-specified times.

### Search
- **Intricate Search Capabilities**:
  - Search for groups/events by study topics.
  - Filter by preferences such as course, time, and group size.
  - Display search results of users studying similar topics.

### Miscellaneous
- **Fun Badges**:
  - Awarded for consistent participation and helpfulness, based on ratings.
  - Optional public study achievements on user profiles.

### Admin Features
- **Platform Administration**:
  - Super user capabilities for moderation and community guideline enforcement.
  - Analytics dashboard for group organizers to track engagement and performance.

### Extra Features
- **Map Embedding**:
  - Integrated search bar for setting event locations using Google Maps.
  - Displays a basic map view during group creation and on group detail pages.
- **Chat Translate**:
  - Multi-language chat support with right-click translation for messages.
- **Business Integration**:
  - Support for business accounts to create study events (e.g., a coffee shop advertising study hours from 1-2 PM on Tuesdays).


## Team Members and Responsibilities

### Tingting Luan: User Profile, Login/Signup, Admin
- **User Login/Signup**:
  - Secure signup/login with email, username, password.
  - Password recovery and account verification.
- **User Profiles**:
  - Personalized profiles with name, academic interests, profile picture, bio.
  - Custom calendar view (Private/Public).
  - Public study achievements and badges.
- **Admin**:
  - Moderation tools for community guidelines.
  - Analytics dashboard for user engagement.

### Xuan Wu: Business Profile, Admin
- **Business Profiles**:
  - Business accounts with name, logo, location (Google Maps).
  - Study event creation (e.g., study sessions at coffee shops).
- **Admin**:
  - Approval and moderation of business accounts/events.
  - Analytics for business event engagement.

### Deming Tracy: Group Search, Group Creation
- **Group Search**:
  - Search groups by study topics, with filters for course, time, size.
  - Dashboard with group recommendations.
- **Group Creation**:
  - Group creation wizard for size, duration, topics, location (Google Maps).
  - Edit/delete groups and post-session ratings.
  - Conflict detection for scheduling.

### Vaibhav Achuthananda: Communication
- **Group Communication**:
  - Built-in chat using [Utterances](https://utteranc.es).
  - Real-time messaging and file sharing.
- **Chat Translate**:
  - Right-click message translation for multi-language support.
- **Email Notifications**:
  - Customizable event reminders via email.
- **Visual Indicators**:
  - Tags (e.g., `#study-group`, `#one-on-one`) for session types.



## Technical Notes
- **Frontend**: HTML, CSS, Express 
- **Integrations**: [Cloudinary](https://cloudinary.com) for image upload, [Google Maps API](https://developers.google.com/maps) for locations.
- **Backend**: Node.js, MongoDB.
>>>>>>> upstream/main
