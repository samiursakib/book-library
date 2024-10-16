# Book Library App

This is a front-end project implemented using vanilla JavaScript, CSS, and Tailwind CSS. The application fetches data from the [Gutenberg Books API](https://gutendex.com/books) and displays a list of books in a clean, user-friendly format. Users can search, filter, and manage a wishlist of books. The app is responsive and designed to work on both desktop and mobile devices.

## Getting Started

- Clone the repository into your local machine
- Open the root folder with vscode editor
- Start the development local server with **Live Server** extension.

## Technologies Used

- **JavaScript**: Used for handling the application logic, API requests, and dynamic updates.
- **CSS**: Used for styling the layout and ensuring responsiveness.
- **Tailwind CSS**: For streamlined, utility-first styling.

## Features

1. **Book List Display**:

   - Fetches data from the public API and displays the list of books.
   - Shows the title, author, cover image, genre, and ID for each book.

2. **Search and Filter**:

   - **Search Bar**: Real-time filtering of books by title.
   - **Dropdown Filter**: Filter books based on genre or topic.

3. **Wishlist Functionality**:

   - Users can add books to their wishlist by clicking a heart icon.
   - Wishlist is saved in `localStorage` for persistence.
   - Users can remove books from the wishlist by clicking the icon again.

4. **Pagination**:

   - Simple pagination (Next and Previous) for easy navigation through the list of books.

5. **User Interface**:

   - **Homepage**: Displays the list of books.
   - **Wishlist Page**: Shows books that the user has added to their wishlist.
   - **Book Details Page**: Provides more information about a specific book.

6. **Responsive Design**:
   - The application is fully responsive and works well on desktops, tablets, and mobile devices.
   - Styled using a combination of CSS and Tailwind CSS for a clean and modern look.
