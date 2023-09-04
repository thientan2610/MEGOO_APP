import moment from 'moment';

/**
 * Convert date from ISO format to DD/MM/YYYY
 * @param dateISO
 * @return date format DD/MM/YYYY
 */
export const dateFormat = (dateISO: string) => {
  const date = moment(dateISO).format('DD/MM/YYYY').toString();

  return date;
};

/**
 * Convert date from ISO format to DD/MM/YYYY HH:mm A
 * @param dateISO
 * @return date format DD/MM/YYYY HH:mm A
 */
export const dateFormatWithTime = (dateISO: string) => {
  const date = moment(dateISO).format('DD/MM/YYYY HH:mm A').toString();

  return date;
};

/**
 * Convert date from DD/MM/YYYY to ISO format
 * @param date
 * @return date format ISO
 */
export const dateISOFormat = (date: string) => {
  const dateISO = moment(date, 'DD/MM/YYYY').toISOString();

  return dateISO;
};

/**
 *
 * @param string
 * @returns the new string joined by a dot
 */
export const splitString = (input: string): string => {
  // Remove commas and periods
  let number = input.replace(/[,\.]/g, '');

  // Define the suffixes for thousands, millions, and billions
  const suffixes = [' nghìn', ' triệu', ' tỷ'];

  // Determine the number of suffixes needed
  const suffixIndex = Math.floor((number.length - 1) / 3);

  // Format the number by inserting periods every three digits
  for (let i = 0; i < suffixIndex; i++) {
    const insertPosition = number.length - (3 * (i + 1) + i);
    number =
      number.slice(0, insertPosition) + '.' + number.slice(insertPosition);
  }
  return number;
};

export const changePackageStatusToVietnamese = (status: string) => {
  if (status === 'Active') {
    return 'Đang kích hoạt';
  } else if (status === 'Not Activated') {
    return 'Chưa kích hoạt';
  } else if (status === 'Expired') {
    return 'Hết hạn';
  }
};

export const changeBillStatusToVietnamese = (status: string) => {
  if (status === 'PENDING') {
    return 'Chờ thanh toán';
  } else if (status === 'APPROVED') {
    return 'Đã xác nhận';
  } else if (status === 'CANCELED') {
    return 'Từ chối';
  }
};

export const convertDayNumberToDayText = (dayNumber: string): string => {
  let result = '';
  switch (dayNumber) {
    case '2':
      result = 'Mon';
      break;
    case '3':
      result = 'Tue';
      break;
    case '4':
      result = 'Wed';
      break;
    case '5':
      result = 'Thu';
      break;
    case '6':
      result = 'Fri';
      break;
    case '7':
      result = 'Sat';
      break;
    case 'CN':
      result = 'Sun';
      break;
    default:
      result = '';
      break;
  }
  return result;
};

export const convertDayTextToDayNumber = (dayText: string): string => {
  let result = '';
  switch (dayText) {
    case 'Mon':
      result = '2';
      break;
    case 'Tue':
      result = '3';
      break;
    case 'Wed':
      result = '4';
      break;
    case 'Thu':
      result = '5';
      break;
    case 'Fri':
      result = '6';
      break;
    case 'Sat':
      result = '7';
      break;
    case 'Sun':
      result = 'CN';
      break;
    default:
      result = '';
      break;
  }
  return result;
};
