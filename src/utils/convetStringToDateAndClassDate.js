export function convertStringToClassDate(dateString) {
    if (typeof dateString === 'number') {
      dateString = String(dateString);
    }
    if (typeof dateString !== 'string') {
      throw new Error('Input is not a string, the type is ' + typeof dateString);
    }
    const year = parseInt(dateString.substring(0, 4));
    const month = parseInt(dateString.substring(5, 7)) - 1; // Months are 0-based
    const day = parseInt(dateString.substring(8, 10));
    const dateObject = new Date(year, month, day);
    return dateObject;
  }
 export function convertStringToDate(dateString) {
    const day = parseInt(dateString.substring(0, 2));
    const month = parseInt(dateString.substring(3, 5)) - 1; // Months are 0-based
    const year = parseInt(dateString.substring(6, 10));
    const hour = parseInt(dateString.substring(11, 13));
    const minute = parseInt(dateString.substring(14, 16));
    const second = parseInt(dateString.substring(17, 19));
    const dateObject = new Date(year, month, day, hour, minute, second);
    return dateObject;
  }
  


