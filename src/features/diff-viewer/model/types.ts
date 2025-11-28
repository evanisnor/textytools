export interface SearchMatch {
  lineIndex: number; // The line number where this match occurs
  matchIndex: number; // Global index of this match pair
  inputMatches: number[]; // Column positions of matches in input/left pane
  outputMatches: number[]; // Column positions of matches in output/right pane
}
