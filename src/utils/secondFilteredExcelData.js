const secondFilteredExcelData = (excelData2) => {
  // console.log("secondFilteredExcelData input ",excelData2)
  if (!excelData2) {
    return []; // Return an empty array if excelData2 is null or undefined
  }
  return excelData2.filter((row, index) => {
    // Include the first row
    if (index === 0) return true;
    // Extract the required columns and check if they are not undefined
    const tuitionIdAndTutorName = row[1];
    const sessionDate = row[2];
    const pay = row[10];
    // // console.log("data of values :",tuitionIdAndTutorName ,sessionDate, pay)
    return tuitionIdAndTutorName !== undefined && sessionDate !== undefined && pay !== undefined;
  });

};

module.exports = secondFilteredExcelData;
