function formatDate(date = new Date()) {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Month with leading zero
  const day = String(d.getDate()).padStart(2, "0"); // Day with leading zero

  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0"); // Minutes with leading zero
  const ampm = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12; // Convert to 12-hour format

  return `${year}-${month}-${day} ${hours12}:${minutes} ${ampm}`;
}

function isFirstWeek() {
  const today = new Date(); // Get the current date
  const dayOfMonth = today.getDate(); // Get the current day of the month

  // Check if today's date is between 1 and 7
  if (dayOfMonth >= 1 && dayOfMonth <= 7) {
    return true;
  } else {
    return false;
  }
}

const randomInt = (min, max) =>
  max === undefined
    ? Math.floor(Math.random() * min)
    : min + Math.floor(Math.random() * (max - min + 1));

const SYSTEM_URL = "http://38.180.105.203:8010/";
// const SYSTEM_URL = "http://localhost:8000/";
// const SYSTEM_URL = "http://18.158.82.59:8010/";

export { formatDate, SYSTEM_URL, randomInt, isFirstWeek };
