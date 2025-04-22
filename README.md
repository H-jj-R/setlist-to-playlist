# Setlist to Playlist

🌐 https://www.setlist-to-playlist.com

A webapp which allows users to create a playlist based on an artist/band's setlists. This webapp allows users to generate Spotify playlists based on setlists from live performances using Setlist\.fm data. Users can customise their playlists by excluding specific songs before exporting them to their Spotify account.

## Features

- **Search Setlists**: Search for setlists by artist or band name.
- **AI-Generated Setlists**: Use AI to predict future setlists based on past performances.
- **Export to Spotify**: Export selected setlists directly to your Spotify account.
- **User Authentication**: Secure Spotify login and authentication.
- **Save Playlists**: When signed in, exported playlists automatically save to your account.
- **Configurable Settings**: Configure custom setlist search and export settings.
- **Responsive Design**: Optimised for both desktop and mobile devices.

## Running Locally

To run Setlist to Playlist on your local machine, follow these steps:

### 1. Clone the Repository

```sh
git clone https://github.com/H-jj-R/setlist-to-playlist.git
cd setlist-to-playlist
```

### 2. Install Dependencies

Ensure you have [Node.js](https://nodejs.org/) v22.14.0 or higher installed, then run:

```sh
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```env
DB_HOST=your_database_host
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
ENCRYPTION_KEY=32_bit_encryption_key
JWT_SECRET=32_bit_jwt_secret
OPENAI_API_KEY=your_openai_api_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
RESEND_API_KEY=your_resend_api_key
SETLIST_FM_API_KEY=your_setlist_fm_api_key
SPOTIFY_API_C_ID=your_spotify_client_id
SPOTIFY_API_C_SECRET=your_spotify_client_secret
SPOTIFY_API_REDIRECT_URI=http://localhost:3000/api/spotify/callback
```

Make sure you replace the placeholder values with actual credentials and values.

### 4. Start the Application

For development mode with hot-reloading:

```sh
npm run dev
```

For production mode:

```sh
npm run build
npm start
```

### 5. Open in Browser

Once the server is running, navigate to:

```
http://localhost:3000
```

## Running Automated Tests Locally

To run tests locally, follow the setup steps above, then:

1. Start the test environment:

   ```sh
   npm run test-env
   ```

2. Run the tests:

   ```sh
   npm test
   ```

## Contributing

If you'd like to contribute, please follow these steps:

1. **Fork the Repository**: Click the 'Fork' button at the top of the repository to create your own copy.

2. **Clone Your Fork**: Clone your forked repository to your local machine:
   ```sh
   git clone https://github.com/your-username/setlist-to-playlist.git
   cd setlist-to-playlist
   ```
3. **Create a New Branch**: Create a new branch for your feature or bug fix:
   ```sh
   git checkout -b branch-name
   ```
4. **Make Your Changes**: Implement your feature or fix while following coding standards.
5. **Commit and Push**: Commit your changes and push them to your fork:
   ```sh
   git add .
   git commit -m "Your commit message"
   git push origin branch-name
   ```
6. **Open a Pull Request**: Go to the original repository, navigate to the 'Pull Requests' tab, and click 'New Pull Request'.

### Contribution Rules

- Follow the project's coding style.
- Write meaningful commit messages.
- Ensure your changes do not break existing functionality.
- If adding a new feature, provide appropriate documentation and tests.
- Be respectful and constructive in pull request discussions.

## License

This project is licensed under the [MIT License](LICENSE).

