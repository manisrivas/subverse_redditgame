# Sliding Puzzle Game - Subverse

Welcome to **Subverse**, a sliding puzzle game where users can play, challenge others, and track their best times. The game offers three difficulty levels: Easy (3x3 grid), Medium (4x4 grid), and Hard (5x5 grid). Players can solve puzzles, challenge others to beat their moves, and view their leaderboard scores.

## Features

- **Difficulty Levels:** Choose between Easy, Medium, and Hard levels, each with a different grid size.
- **Puzzle Solving:** Shuffle tiles randomly and solve the puzzle by sliding adjacent tiles.
- **Move Tracking:** The number of moves is tracked for each puzzle, and players are rewarded with a success message when solved.
- **Leaderboard:** Players can see their scores for each difficulty level.
- **Challenge Feature:** Players can challenge others to beat their best score by posting their completed puzzle with a challenge to the community.
  
## Setup Instructions

1. **Clone the repository:**
    ```bash
    git clone https://github.com/manisrivas/subverse_redditgame
    ```

2. **Install dependencies:**
    Navigate to the project folder and run:
    ```bash
    npm install
    ```

3. **Configure Devvit CLI:**
    Ensure you have Devvit CLI installed and configured. For more information on Devvit, visit the [official Devvit documentation](https://devvit.com/docs/).

4. **Run the application:**
    Start the app using Devvit CLI:
    ```bash
    devvit dev
    ```

5. **Play the Game:**
    Open the app and interact with the game through its interface. Choose a difficulty, solve the puzzle, and challenge others to beat your moves!

## Key Code Components

### 1. **Puzzle Logic:**
   - `shuffleArray`: Randomizes the tiles while ensuring the puzzle is solvable.
   - `isSolvable`: Checks if a shuffled puzzle is solvable based on the number of inversions.
   - `moveTile`: Handles tile movement when adjacent tiles are clicked.
   - `isSolved`: Checks if the puzzle is solved.

### 2. **Game State Management:**
   - `currentPage`: Controls navigation between game states such as menu, game play, and leaderboard.
   - `level`: Stores the selected difficulty level.
   - `tiles`: Array representing the puzzle tiles, including the empty space (0).
   - `moveCount`: Tracks the number of moves made by the player.
   - `scores`: Stores the best scores for each difficulty.

### 3. **User Interface (UI):**
   - The game utilizes a custom pixel font ('Press Start 2P') to give it a retro feel.
   - Multiple pages are rendered for different game actions: Menu, Difficulty Selection, Puzzle Play, and Scores.

### 4. **Post Challenge Feature:**
   - Once the puzzle is solved, users are prompted to post a challenge to Reddit, encouraging others to beat their score.
   - The challenge is posted to the `subversetesting` subreddit using the Devvit Reddit API integration.

## Contributing

Feel free to fork the repository and submit pull requests. If you encounter any bugs or issues, please open an issue in the GitHub repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Thanks to [Devvit](https://devvit.com/) for providing the platform to create Reddit-integrated applications.
- The pixel font 'Press Start 2P' is used for a retro aesthetic. It is available via [Google Fonts](https://fonts.google.com/specimen/Press+Start+2P).

---

Enjoy playing **Subverse**, and happy puzzling!
