import { Utensil } from "./types";

/**
 * Sort utensils by their score, then win rate, then number of wins, then alphabetically.
 * @param {Utensil} a First utensil to compare.
 * @param {Utensil} b Second utensil to compare.
 * @returns {number} Negative num if a before b, positive num if a after b, 0 if equal.
 */
export function sortUtensils(a: Utensil, b: Utensil): number {
  // sort by SCORE, highest to lowest
  if (a.score !== b.score) {
    return b.score - a.score;
  }

  // sort by WIN RATE, highest to lowest
  if (b.wins / (b.wins + b.losses) !== a.wins / (a.wins + a.losses)) {
    return b.wins / (b.wins + b.losses) - a.wins / (a.wins + a.losses);
  }

  // sort by NUMBER OF WINS, highest to lowest
  if (a.wins !== b.wins) {
    return b.wins - a.wins;
  }

  // sort alphabetically
  return a.title.localeCompare(b.title);
}

/**
 * Sort utensils by their score, then win rate, then number of wins, then alphabetically.
 * @param {number} num Month number 1 to 12.
 * @returns {string} Name of corresponding month, empty if number out of range.
 */
export function monthName(num: number): string {
  if (num == 1) return "January";
  else if (num == 2) return "February";
  else if (num == 3) return "March";
  else if (num == 4) return "April";
  else if (num == 5) return "May";
  else if (num == 6) return "June";
  else if (num == 7) return "July";
  else if (num == 8) return "August";
  else if (num == 9) return "September";
  else if (num == 10) return "October";
  else if (num == 11) return "November";
  else if (num == 12) return "December";
  else return "";
}

/**
 * Get random element from array.
 * @param {Object[]} array Array to select random element from.
 * @returns {Object} Random element from the array.
 */
export function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Randomly shuffle elements in array.
 * @param {Object[]} array Array to shuffle.
 * @returns {Object[]} Shuffled array.
 */
// https://stackoverflow.com/a/2450976
export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

/**
 * Gets number of combinations of pairs for a given number of utensils.
 * @param {number} numUtensils Numer of utensils.
 * @returns {number} Number of combinations.
 */
export function getNumCombos(numUtensils: number): number {
  let sum = 0;
  for (let i = 1; i < numUtensils; i++) {
    sum += i;
  }
  return sum;
}
