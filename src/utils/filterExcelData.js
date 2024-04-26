import {convertStringToDate,convertStringToClassDate} from './convetStringToDateAndClassDate';
function parseDate(dateString) {
  const [day, month, year] = dateString.split('/');
  return new Date(year, month - 1, day);
}
const filterExcelData = (excelData, fromDate, toDate, payroll, filterCase) => {
  if (!excelData) return [];
  if (filterCase === 'case1') {
    return excelData.filter((row, index) => {
      if (index === 0) return true;
      const tutor = row[2];
      const classDateData = row[3];
      const classDate = parseDate(classDateData);
      const fromDateObj = fromDate ? new Date(fromDate) : null;
      const toDateObj = toDate ? new Date(toDate) : null;
      const payrollDateObj = payroll ? new Date(payroll) : null;
      if(fromDateObj!=null && toDateObj!=null && payrollDateObj!=null)
      {
        const isWithinDateRange = (!fromDateObj || classDate >= fromDateObj) 
        && (!toDateObj || classDate <= toDateObj);
        const isAfterPayroll = !payrollDateObj || classDate > payrollDateObj;
        return  isWithinDateRange && isAfterPayroll;
      }
      return null;
    });
  } else if (filterCase === 'case2') {
    return excelData.filter((row, index) => {
      if (index === 0) return true; // Keep header row
      const hasContent = row.some((element) => element !== null && element !== undefined && element !== '');
      if (!hasContent) return false; // Skip empty rows
      const submittedTimeDate = row[1];
      const submittedTime = convertStringToDate(submittedTimeDate);
      const classDateDate = row[3];
      const classDate = convertStringToClassDate(classDateDate);
      const fromDateObj = fromDate ? new Date(fromDate) : null;
      const toDateObj = toDate ? new Date(toDate) : null;
      const payrollDateObj = new Date(payroll);
      if(fromDateObj!=null && toDateObj!=null && payrollDateObj!=null)
      {
      const IsOldData = classDate < payrollDateObj;
      const isAfterPayroll = fromDateObj <= submittedTime && toDateObj >= submittedTime;
      const result =  IsOldData && isAfterPayroll;
      return result;
      }
    });
  } else {
    return [];
  }
};

export default filterExcelData;