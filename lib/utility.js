import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

export const convertDayOfWeek = (day) => {
  if (day === 0) return 6
  else return day - 1;
}