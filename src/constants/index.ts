interface GameData {
  MAX_ROWS: number;
  MAX_COLS: number;
  NUM_OF_BOMBS: number;
}

const settingsMap: { [key: string]: GameData } = {
  Easy: { MAX_ROWS: 9, MAX_COLS: 9, NUM_OF_BOMBS: 10 },
  Hard: { MAX_ROWS: 16, MAX_COLS: 16, NUM_OF_BOMBS: 49 },
  Expert: { MAX_ROWS: 16, MAX_COLS: 30, NUM_OF_BOMBS: 99 },
};

export const getGameSettings = (level: string): GameData => {
  return settingsMap[level];
};
