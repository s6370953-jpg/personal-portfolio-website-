# Personal Portfolio Website Builder

An interactive web application for building, customizing, previewing, and downloading a professional single-page developer portfolio.

## Features

- **Live preview:** See updates as you edit personal details, skills, projects, and experience.
- **Profile photos:** Use an image URL or upload an image when running with the backend.
- **Theme customization:** Choose Electric Blue, Neon Purple, Emerald Green, or Rose Gold accents with glassmorphism styling.
- **HTML download:** Export your portfolio as a single HTML file.
- **Code export:** View and copy the generated portfolio HTML.
- **Optional Express backend:** Upload profile images and save portfolio state as JSON.

## Run the frontend standalone

Open `index.html` in a browser. The builder and live preview work without the backend. Image uploads and saving portfolio data require the backend server.

The page loads Tailwind CSS, Font Awesome, and Google Fonts from external CDNs, so an internet connection is needed for those assets.

## Run with the Express backend

Requires Node.js and npm.

1. Install dependencies:

   ```sh
   npm install
   ```

2. Start the server:

   ```sh
   npm start
   ```

3. Open [http://localhost:5000](http://localhost:5000).

For development with automatic server restarts, run:

```sh
npm run dev
```

The API stores uploaded images in `uploads/` and the most recently saved portfolio state in `portfolio_data.json` in the project directory.
