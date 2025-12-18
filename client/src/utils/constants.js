export const COLORS = {
  cream: '#EFECE3',
  lightBlue: '#8FABD4',
  blue: '#4A70A9',
  dark: '#000000',
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const isEventPast = (date) => {
  return new Date(date) < new Date();
};

export const getAvailableSpots = (capacity, currentAttendees) => {
  return capacity - currentAttendees;
};