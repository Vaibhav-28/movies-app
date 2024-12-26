# React Movie App

This is a React application built with Vite for browsing movie information.

## Getting Started

These instructions will guide you through setting up and running the app on your local machine.

### Prerequisites

Make sure you have Node.js and npm (or yarn/pnpm) installed on your system. You can download Node.js from [nodejs.org](https://nodejs.org/).

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd <project_directory>
    ```

3.  **Install dependencies:**

    ```bash
    npm install  # or yarn install or pnpm install
    ```

### Configuration

This application requires an API key from The Movie Database (TMDB).

1.  **Obtain a TMDB API key:**

    - Go to [https://www.themoviedb.org/](https://www.themoviedb.org/) and create an account (if you don't have one).
    - Navigate to your account settings and then to the API section.
    - Request an API key (v3 auth). You'll specifically need a **Bearer Token (API Read Access Token)**.

2.  **Create a `.env` file:**

    - Copy the contents of `.env.example` to a new file named `.env`:

      ```bash
      cp .env.example .env
      ```

3.  **Set the API key:**

    - Open the `.env` file and replace the placeholder value with your actual TMDB Bearer Token:

      ```
      VITE_TMDB_BEARER_TOKEN=<your_tmdb_bearer_token>
      ```

### Running the App

Once you've completed the installation and configuration steps, you can start the development server:

```bash
npm run dev # or yarn dev or pnpm dev
```

This will start the development server. Open your browser and navigate to the address shown in the terminal (usually http://localhost:5173).

## **Design Decisions**

### **Dynamic Data Fetching**

The application heavily relies on TMDB’s API for movie data, ensuring access to an up-to-date and extensive dataset. Key decisions include:

- Dynamically fetching genres and movie details to avoid hardcoding and improve scalability.
- Using a query-based approach to handle search, filters, and pagination.
- **Debounce Search Queries**: Reduced the number of API calls by implementing debouncing.

### **Responsive and User-Friendly UI**

- The app is designed with responsiveness in mind to cater to both mobile and desktop users.
- A clean header layout with search, filters, and favorites functionality ensures easy navigation.
- Styled with Tailwind CSS for visual distinction and usability.

### **Centralized State Management**

Filters, search queries, and pagination states are centralized to:

- Simplify API integration.
- Ensure consistent behavior across components.
- Make the app easier to maintain and extend.

### **Favorites Feature**

- A "Favorites" section allows users to save their favorite movies for quick access.
- Used local storage for data persistance.

## **Features Implemented**

### **Search Functionality**

- Users can search for movies by title using a debounced input field.
- Search results are fetched dynamically from the TMDB API.

### **Filters**

- Filters include:
  - **Year Range**: Specify start and end years for movies.
  - **Rating Range**: Filter movies by minimum and maximum ratings (0 to 10).
  - **Genres**: Dynamically fetched genres allow multiple selections.
- A "Clear Filters" button resets all selected options.

### **Favorites Management**

- Favorites functionality is accessible via the header.
- Allows for quick viewing and interaction with favorite movies.

### **Infinite scrolling**

- Infinite scrolling of movies to improve performance and user experience.

### **Error Handling**

- API requests include robust error handling.

## **Possible Improvements**

### **UI/UX Enhancements**

- **Tooltips**: Add tooltips for filter options and icons.
- **Filter Tags**: Display selected filter options as tags for better visibility.
- **Favorites Preview**: Show a dropdown preview of favorite movies in the header.

### **Performance Optimization**

- **Caching**: Cache frequently fetched data (e.g., genre list, popular movies) to minimize API requests.
- **Lazy Loading**: Optimize loading of images and assets to improve performance.

### **Error Feedback to Users**

- Display user-friendly error messages for failed API requests (e.g., "Failed to load movies. Please try again.").

### **Backend Integration**

- Implement user authentication for personalized features like favorites and watchlists.
- Save user preferences (e.g., filters, favorites) to a backend for persistence across devices.

### **Enhanced Features**

- **Sorting Options**: Allow users to sort movies by popularity, rating, release date, etc.
- **Advanced Search**: Include options for searching by cast, crew, or keywords.
- **Watchlist**: Extend the favorites feature to include a separate watchlist.
