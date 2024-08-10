
function changeDateFormat(date) {
  const [day, month, year] = date.split('-');
  const correctedDateFormat = `${year}-${month}-${day}`
  return (new Date(correctedDateFormat))
}

const filterExcelData = (excelData, fromDate, toDate, payroll, filterCase) => {
  if (!excelData) return [];
  if (filterCase === 'case1') {
    return excelData.filter((row, index) => {
      if (index === 0) return true;
      const tutor = row[2];
      const classDateData = row[3];
      const classDate = classDateData ? new Date(classDateData) : null;
      const fromDateObj = fromDate ? new Date(fromDate) : null;
      const toDateObj = toDate ? new Date(toDate) : null;
      const payrollDateObj = payroll ? new Date(payroll) : null;
      if (fromDateObj != null && toDateObj != null && payrollDateObj != null) {
        const isWithinDateRange = (!fromDateObj || classDate >= fromDateObj)
          && (!toDateObj || classDate <= toDateObj);
        const isAfterPayroll = !payrollDateObj || classDate >= payrollDateObj;
        return isWithinDateRange && isAfterPayroll;
      }
      return null;
    });
  } else if (filterCase === 'case2') {
    return excelData.filter((row, index) => {
      if (index === 0) return true; // Keep header row
      const hasContent = row.some((element) => element !== null && element !== undefined && element !== '');
      if (!hasContent) return false; // Skip empty rows
      const submittedTimeDate = row[1];
      const convertToDateSubmittedTimeDate = submittedTimeDate.split(' ')[0];
      const submittedTime = changeDateFormat(convertToDateSubmittedTimeDate) ? changeDateFormat(convertToDateSubmittedTimeDate) : null;
      const classDateData = row[3];
      const classDate = classDateData ? new Date(classDateData) : null;
      const fromDateObj = fromDate ? new Date(fromDate) : null;
      const toDateObj = toDate ? new Date(toDate) : null;
      const payrollDateObj = new Date(payroll);
      if (fromDateObj != null && toDateObj != null && payrollDateObj != null) {
        const IsOldData = classDate <= payrollDateObj;
        const isAfterPayroll = fromDateObj <= submittedTime && toDateObj >= submittedTime;
        const result = IsOldData && isAfterPayroll;
        return result;
      }
    });
  } else {
    return [];
  }
};

export default filterExcelData;