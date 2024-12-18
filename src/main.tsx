import { Devvit, useState } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

// Include custom pixel font
const pixelFontStyle = {
  fontFamily: "'Press Start 2P', sans-serif", // Use a pixel font here
  fontSize: '16px', // You can adjust the size as needed
};

// Utility functions (unchanged)

const countInversions = (array: number[]) => {
  let inversions = 0;
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] > array[j] && array[i] !== 0 && array[j] !== 0) {
        inversions++;
      }
    }
  }
  return inversions;
};

const isSolvable = (tiles: number[], gridSize: number, emptyIndex: number) => {
  const inversions = countInversions(tiles);
  if (gridSize % 2 !== 0) {
    return inversions % 2 === 0;
  } else {
    const emptyRowFromBottom = gridSize - Math.floor(emptyIndex / gridSize);
    if (emptyRowFromBottom % 2 === 0) {
      return inversions % 2 !== 0;
    } else {
      return inversions % 2 === 0;
    }
  }
};

const shuffleArray = (array: number[], gridSize: number) => {
  let shuffled = [...array];
  let emptyIndex = shuffled.indexOf(0);

  do {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    emptyIndex = shuffled.indexOf(0);
  } while (!isSolvable(shuffled, gridSize, emptyIndex)); // Ensure solvable shuffle

  return shuffled;
};

const isSolved = (tiles: number[], gridSize: number) => {
  return tiles.every((tile, index) => tile === (index + 1) % (gridSize * gridSize));
};

Devvit.addCustomPostType({
  name: 'Sliding Puzzle Game',
  height: 'tall',
  render: (context) => {
    const [currentPage, setCurrentPage] = useState('menu');
    const [level, setLevel] = useState<string | null>(null);
    const [tiles, setTiles] = useState<number[]>([]);
    const [emptyIndex, setEmptyIndex] = useState<number>(8);
    const [moveCount, setMoveCount] = useState(0);
    const [gridSize, setGridSize] = useState(3);
    const [scores, setScores] = useState({
      easy: null as number | null,
      medium: null as number | null,
      hard: null as number | null,
    });
    const [completedPuzzle, setCompletedPuzzle] = useState<string | null>(null);

    const navigateToPage = (page: string) => {
      setCurrentPage(page);
    };

    const handleLevelSelect = (selectedLevel: string) => {
      setLevel(selectedLevel);
      initializeLevel(selectedLevel);
      navigateToPage('levelSelected');
    };

    const initializeLevel = (level: string) => {
      let initialTiles: number[] = [];
      let newGridSize: number = 3;

      if (level === 'easy') {
        initialTiles = Array.from({ length: 9 }, (_, i) => i + 1);
        initialTiles[8] = 0;
        newGridSize = 3;
      } else if (level === 'medium') {
        initialTiles = Array.from({ length: 16 }, (_, i) => i + 1);
        initialTiles[15] = 0;
        newGridSize = 4;
      } else if (level === 'hard') {
        initialTiles = Array.from({ length: 25 }, (_, i) => i + 1);
        initialTiles[24] = 0;
        newGridSize = 5;
      }

      const shuffledTiles = shuffleArray(initialTiles, newGridSize);
      setTiles(shuffledTiles);
      setGridSize(newGridSize);
      setEmptyIndex(shuffledTiles.indexOf(0));
      setMoveCount(0);
    };

    const moveTile = (index: number) => {
      if (tiles[index] === 0) return;

      const emptyRow = Math.floor(emptyIndex / gridSize);
      const emptyCol = emptyIndex % gridSize;
      const tileRow = Math.floor(index / gridSize);
      const tileCol = index % gridSize;

      const isAdjacent =
        (Math.abs(emptyRow - tileRow) === 1 && emptyCol === tileCol) ||
        (Math.abs(emptyCol - tileCol) === 1 && emptyRow === tileRow);

      if (isAdjacent) {
        const newTiles = [...tiles];
        newTiles[emptyIndex] = newTiles[index];
        newTiles[index] = 0;

        setTiles(newTiles);
        setEmptyIndex(index);
        setMoveCount((prev) => prev + 1);

        if (isSolved(newTiles, gridSize)) {
          context.ui.showToast(`Congratulations! You solved the puzzle in ${moveCount + 1} moves!`);
          const updatedScores = { ...scores };
          if (!scores[level!] || moveCount + 1 < scores[level!]) {
            updatedScores[level!] = moveCount + 1;
          }
          setScores(updatedScores);
          setCompletedPuzzle(JSON.stringify(newTiles));  // Save completed puzzle as a string
          navigateToPage('postChallenge'); // Navigate to post challenge page
        }
      }
    };

    const triggerCongratulations = async () => {
      context.ui.showToast(`Congratulations! You solved the ${level} puzzle in ${moveCount + 1} moves!`);

      const postBody = `I just solved the ${level} level sliding puzzle in ${moveCount + 1} moves! Think you can do better? Share your solution and challenge others to beat it!`;

      try {
        const post = await reddit.submitPost({
          subredditName: 'subversetesting',
          title: `Challenge: Can You Solve the in lesser moves than me?`,
          richtext: new RichTextBuilder()
            .paragraph({}, (p) => {
              p.rawText(postBody);
            })
            .build(),
        });

        context.ui.showToast('Your challenge has been posted!');
      } catch (error) {
        console.error('Error submitting post:', error);
        context.ui.showToast('Failed to post challenge. Please try again.');
      }
    };
    return (
      <vstack height="100%" width="100%" gap="medium" alignment="center middle" enum={pixelFontStyle}>
        {currentPage === 'menu' ? (
          <>
            <text size="xxlarge" enum={{ weight: 'bold', fontFamily: 'Press Start 2P', textAlign: 'center', marginBottom: '20px' }}>
              SUBVERSE
            </text>
            <button appearance="primary" onPress={() => navigateToPage('play')}>Play</button>
            <button appearance="primary" onPress={() => navigateToPage('leaderboard')}>Leaderboard</button>
            <button appearance="primary" onPress={() => navigateToPage('scores')}>Your Scores</button>
          </>
        ) : currentPage === 'play' ? (
          <>
            <text size="large">Choose difficulty level:</text>
            <button appearance="primary" onPress={() => handleLevelSelect('easy')}>Easy</button>
            <button appearance="primary" onPress={() => handleLevelSelect('medium')}>Medium</button>
            <button appearance="primary" onPress={() => handleLevelSelect('hard')}>Hard</button>
            <button appearance="secondary" onPress={() => navigateToPage('menu')}>Back to Menu</button>
          </>
        ) : currentPage === 'scores' ? (
          <>
            <text size="large">Your Scores:</text>
            <text size="medium">{`Easy: ${scores.easy || 'N/A'} moves`}</text>
            <text size="medium">{`Medium: ${scores.medium || 'N/A'} moves`}</text>
            <text size="medium">{`Hard: ${scores.hard || 'N/A'} moves`}</text>
            <button appearance="secondary" onPress={() => navigateToPage('menu')}>Back to Menu</button>
          </>
        ) : currentPage === 'levelSelected' ? (
          <>
            <text size="large">{`${level} Level Puzzle`}</text>
            <vstack gap="small" alignment="center middle">
              <text size="medium">{`Moves: ${moveCount}`}</text>
              {Array(gridSize)
                .fill(null)
                .map((_, row) => (
                  <hstack key={`row-${row}`} gap="small" alignment="center middle">
                    {Array(gridSize)
                      .fill(null)
                      .map((_, col) => {
                        const index = row * gridSize + col;
                        return (
                          <vstack
                            key={`tile-${index}`}
                            onPress={() => moveTile(index)}
                            height="60px"
                            width="60px"
                            backgroundColor={tiles[index] === 0 ? 'transparent' : 'black'}
                            alignment="center middle"
                            padding="small"
                            cornerRadius="small"
                          >
                            {tiles[index] !== 0 && <text size="medium">{tiles[index]}</text>}
                          </vstack>
                        );
                      })}
                  </hstack>
                ))}
            </vstack>
            <hstack gap="medium" alignment="center middle">
              <button appearance="secondary" onPress={() => navigateToPage('menu')}>Back to Menu</button>
              <button appearance="primary" onPress={() => initializeLevel(level!)}>Reset</button>
            </hstack>
          </>
        ) : currentPage === 'triggerCongratulations' ? (
          <>
            <text size="large">Congratulations! You've solved the puzzle!</text>
            <text size="medium">Would you like to post and challenge others?</text>
            <button appearance="primary" onPress={triggerCongratulations}>Post Puzzle</button>
            <button appearance="secondary" onPress={() => navigateToPage('menu')}>Back to Menu</button>
          </>
        ) : null}
      </vstack>
    );
  },
});

export default Devvit;
