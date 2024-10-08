import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import filterExcelData from "../utils/filterExcelData";
import secondFilteredExcelData from "../utils/secondFilteredExcelData";
import WhatsAppSender from "./WhatsappSender";
import "./ExcelReader.css";
import {
  populateFilteredBasedOnIsRequired,
  transformData,
  filterRecords,
  sortAndRemoveDuplicates,
  populateTutorJsonData,
} from "../functions/functionsForSecondExcel";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MissedData from "./MissedData";
import { Button } from "@mui/material";
const ExcelReader = () => {
  const [excelData, setExcelData] = useState(null);
  const [excelData2, setExcelData2] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileName2, setFileName2] = useState("");
  const [fromDate, setFromDate] = useState("2024-09-22");
  const [toDate, setToDate] = useState("2024-10-06");
  const [payroll, setPayroll] = useState("2024-10-06");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [grandparentChecked, setGrandparentChecked] = useState(true);
  const openPopup = () => {
    setIsPopupOpen(true);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
  };
  const dropzoneStyles = {
    border: "2px dashed #cccccc",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
  };
  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    const file = acceptedFiles[0];
    setFileName(file.name);
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setExcelData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    accept: ".xlsx, .xls",
    onDrop,
  });
  const onDrop2 = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    const file = acceptedFiles[0];
    setFileName2(file.name);
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setExcelData2(jsonData);
    };
    reader.readAsArrayBuffer(file);
  }, []);
  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } =
    useDropzone({
      accept: ".xlsx, .xls",
      onDrop: onDrop2,
    });
  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };
  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };
  const handlePayrollChange = (event) => {
    setPayroll(event.target.value);
  };
  function missedStudentRecords(combinedArray, fromDate) {
    // // console.log("missedRecords output", combinedArray);
    let fromDateObj = new Date(fromDate);
    let status = "(missed)";
    for (let i = 0; i < combinedArray.length; ++i) {
      let eachStudentRecord = combinedArray[i];
      // // console.log("eachStudentRecord", eachStudentRecord);
      let sessionDateRecords = new Date(eachStudentRecord[3]);
      // // console.log("sessionDateRecords", sessionDateRecords);
      if (sessionDateRecords < fromDateObj) {
        // // console.log("sessionDateRecords", true);
        eachStudentRecord["status"] = status;
      } else {
        eachStudentRecord["status"] = "";
      }
    }
    console.log("missedRecords output", combinedArray);
    return combinedArray;
  }
  const filteredExcelData = filterExcelData(
    excelData,
    fromDate,
    toDate,
    payroll,
    "case1"
  );
  const payRollFilteredExcelData = filterExcelData(
    excelData,
    fromDate,
    toDate,
    payroll,
    "case2"
  );
  // // console.log("data from filteredExcelData Excelreader", filteredExcelData);
  // // console.log(
  // // "data from payRollFilteredExcelData Excelreader",
  // // payRollFilteredExcelData
  // // );
  const combinedArray = [...filteredExcelData, ...payRollFilteredExcelData];
  const missedRecordsArray = missedStudentRecords(combinedArray, fromDate);
  // // console.log("data from missedRecordsArray Excelreader", missedRecordsArray);
  const payRollFilteredData = [...new Set(missedRecordsArray)];
  const tutorJsonData = populateTutorJsonData(payRollFilteredData);
  const [copyTutorJsonData, setCopyTutorJsonData] = useState({});
  const isManuallyUpdated = useRef(false);
  useEffect(() => {
    // // // console.log('tutorJsonData:', tutorJsonData);
    if (
      !isManuallyUpdated.current &&
      tutorJsonData &&
      JSON.stringify(tutorJsonData) !== JSON.stringify(copyTutorJsonData)
    ) {
      setCopyTutorJsonData({ ...tutorJsonData });
    }
    // // console.log("copyTutorJsonData after useEffect", copyTutorJsonData);
  }, [tutorJsonData]);
  // // console.log("data from tutorJsonData Excelreader", tutorJsonData);
  // // console.log("data from copyTutorJsonData Excelreader", copyTutorJsonData);
  const filteredBasedOnIsRequired =
    populateFilteredBasedOnIsRequired(copyTutorJsonData);
  const secondFilteredData = secondFilteredExcelData(excelData2);
  const transformedData = transformData(secondFilteredData);
  // // // console.log("data from transformedData Excelreader", transformedData)
  const { filteredTutorJsonData, filteredTransformedData } = filterRecords(
    filteredBasedOnIsRequired,
    transformedData
  );
  const combinedAndSortedData = sortAndRemoveDuplicates(
    filteredTransformedData,
    filteredTutorJsonData
  );
  const handleGrandparentCheckbox = () => {
    const newGrandparentChecked = !grandparentChecked;
    setGrandparentChecked(newGrandparentChecked);
    const updatedData = Object.keys(copyTutorJsonData).reduce(
      (acc, tutorKey) => {
        acc[tutorKey] = {
          ...copyTutorJsonData[tutorKey],
          checked: newGrandparentChecked,
          sessions: copyTutorJsonData[tutorKey].sessions.map((session) => ({
            ...session,
            isRequired: newGrandparentChecked,
          })),
        };
        return acc;
      },
      {}
    );
    console.log("updatedDataHandleGrandparentCheckbox", updatedData);
    setCopyTutorJsonData(updatedData);
  };
  const handleParentCheckbox = (tutorKey) => {
    const isChecked = !copyTutorJsonData[tutorKey].checked;
    // console.log("isChecked_handleParentCheckbox", isChecked);
    setCopyTutorJsonData((prevState) => ({
      ...prevState,
      [tutorKey]: {
        ...prevState[tutorKey],
        checked: isChecked,
        sessions: prevState[tutorKey].sessions.map((session) => ({
          ...session,
          isRequired: isChecked,
        })),
      },
    }));
    isManuallyUpdated.current = true;
  };
  const handleChildCheckbox = (tutorKey, index) => {
    const updatedSessions = copyTutorJsonData[tutorKey].sessions.map(
      (session, idx) =>
        idx === index
          ? { ...session, isRequired: !session.isRequired }
          : session
    );
    const allChecked = updatedSessions.every((session) => session.isRequired);
    const noneChecked = updatedSessions.every((session) => !session.isRequired);

    setCopyTutorJsonData((prevState) => ({
      ...prevState,
      [tutorKey]: {
        ...prevState[tutorKey],
        sessions: updatedSessions,
        checked: allChecked ? true : !noneChecked,
      },
    }));
    isManuallyUpdated.current = true;
    console.log("isChecked_handleChildCheckbox", allChecked);
  };

  console.log("copyTutorJsonData_AfterCheck", copyTutorJsonData);
  return (
    <div>
      <h2 class="heading">Smart Report</h2>
      <div className="container">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label={<label className="label">From Date</label>}
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              variant="outlined"
              fullWidth
              required
              InputProps={{
                className: "input",
              }}
              InputLabelProps={{
                shrink: true,
                style: { marginTop: "-8px" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label={<label className="label">To Date</label>}
              id="toDate"
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              variant="outlined"
              fullWidth
              required
              InputProps={{
                className: "input",
              }}
              InputLabelProps={{
                shrink: true,
                style: { marginTop: "-8px" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label={<label className="label">Payroll</label>}
              id="payroll"
              type="date"
              value={payroll}
              onChange={handlePayrollChange}
              variant="outlined"
              fullWidth
              InputProps={{
                className: "input",
              }}
              InputLabelProps={{
                shrink: true,
                style: { marginTop: "-8px" },
              }}
            />
          </Grid>
        </Grid>
      </div>
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        {/* Display the uploaded file name */}
        <p>
          {fileName
            ? `Uploaded File: ${fileName}`
            : "Drag and drop an Excel file here, or click to select files (Timesheet Entry.xlsx)"}
        </p>
      </div>
      <div>
        {copyTutorJsonData && (
          <label>
            <input
              type="checkbox"
              checked={grandparentChecked}
              onChange={handleGrandparentCheckbox}
            />
          </label>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {Object.keys(copyTutorJsonData).map((tutorKey, index) => (
            <div
              key={tutorKey}
              style={{ border: "1px solid black", padding: "10px" }}
            >
              <input
                type="checkbox"
                checked={copyTutorJsonData[tutorKey].checked}
                onChange={() => handleParentCheckbox(tutorKey)}
              />
              <h3>{tutorKey}</h3>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {copyTutorJsonData[tutorKey].sessions.map(
                  (session, itemIndex) => (
                    <li
                      key={`${tutorKey}-${itemIndex}`}
                      style={{ marginBottom: "10px", textAlign: "center" }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span>
                          <input
                            type="checkbox"
                            checked={session.isRequired}
                            onChange={() =>
                              handleChildCheckbox(tutorKey, itemIndex)
                            }
                          />
                          {session["Session Date"]}{" "}
                          {session["Duration of Session session"]}{" "}
                          {session["status"]}
                        </span>
                      </div>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div {...getRootProps2()} style={dropzoneStyles}>
        <input {...getInputProps2()} />
        {/* Display the uploaded file name */}
        <p>
          {fileName2
            ? `Uploaded File: ${fileName2}`
            : "Drag and drop an Excel file here, or click to select files (Tuitions started By HR.xlsx)"}
        </p>
      </div>
      <Button className="open-missed-data" onClick={openPopup}>
        View OverView details
      </Button>
      {isPopupOpen && (
        <div>
          <div className="overlay" onClick={closePopup}></div>
          <div className="popup">
            <div className="popup-content">
              <Button className="close-button" onClick={closePopup}>
                Close
              </Button>
              <MissedData
                tutorJsonData={tutorJsonData}
                transformedData={transformedData}
                combinedAndSortedData={combinedAndSortedData}
              />
            </div>
          </div>
        </div>
      )}
      <div>
        <h2>Tution Details</h2>
        <div className="tution-grid">
          {combinedAndSortedData.map((item, index) => {
            const tutorKey = Object.keys(item)[0];
            const tutionData = item[tutorKey];
            const classesAttended = tutionData.classesAttended;
            const tutorName =
              classesAttended[0]["Tution ID and Tuttion Name"].split(" : ")[1];
            const tutorId =
              classesAttended[0]["Tution ID and Tuttion Name"].split(" : ")[0];
            const totalFees = tutionData.finalAmountToParent;
            const totalDurationOfSessionTaken =
              tutionData.totalDurationOfSessionTaken;
            const toNewDate = new Date(
              new Date(toDate).setDate(new Date(toDate).getDate() + 5)
            ).toLocaleDateString("en-GB");
            // // console.log("toDate ", toNewDate);
            var stringBuilder = "";
            stringBuilder += `SMARTPOINT E-PAY\n`;
            stringBuilder += `Class hour updates\n`;
            stringBuilder +=
              `(${fromDate.split("-").reverse().join(".")} to ${toDate
                .split("-")
                .reverse()
                .join(".")})` + "\n\n";
            stringBuilder += `Tuition ID: ${tutorId}\n`;
            stringBuilder += `Tutor: ${tutorName}\n\n`;
            classesAttended.map((cls, clsIndex) => {
              stringBuilder += `${cls["Session Date"]
                .split("-")
                .reverse()
                .join("-")}- ${cls["Duration of Session taken"]} hrs \n`;
            });
            stringBuilder += `--------------------------`;
            stringBuilder += `\nTotal class hours: ${totalDurationOfSessionTaken} hrs`;
            stringBuilder += `\nTotal Fees: ${totalFees}/-\n`;
            stringBuilder += `\nAccount No: 39891065373`;
            stringBuilder += `\nIFSC CODE: SBIN0009485`;
            stringBuilder += `\nAmount payable : ${totalFees}/-`;
            stringBuilder += `\nG-pay No: +91 8848083747`;
            stringBuilder += `\nPayment due date: ${toNewDate}\n`;
            stringBuilder += `\nNote: Please confirm the payment by sharing a screenshot`;
            const resultToWhatsapp = stringBuilder;
            // // console.log("resultToWhatsapp ", resultToWhatsapp);
            return (
              <div>
                <div tutorKey={index} className="tution-box">
                  <p>SMARTPOINT E-PAY</p>
                  <p>Class hour updates</p>
                  <p>
                    ({fromDate.split("-").reverse().join(".")}{" "}
                    {toDate.split("-").reverse().join(".")})
                  </p>
                  <p>Tutor Name: {tutorName}</p>
                  <p>Tuition ID: {tutorId}</p>
                  <p>Session Date and Duration of Session:</p>
                  {classesAttended.map((cls, clsIndex) => (
                    <div tutorKey={clsIndex}>
                      <p>{`${cls["Session Date"]
                        .split("-")
                        .reverse()
                        .join("-")} ${cls["Duration of Session taken"]}`}</p>
                    </div>
                  ))}
                  <p>Total class hours: {totalDurationOfSessionTaken}</p>
                  <p>Total Fees: {totalFees}</p>
                  <p>Account No: 39891065373</p>
                  <p>IFSC CODE: SBIN0009485</p>
                  <p>Amount payable : {totalFees}/-</p>
                  <p>G-pay No: +91 8848083747</p>
                  <p>Payment due date: {toNewDate}</p>
                  <p>
                    Note: Please confirm the payment by sharing a screenshot
                  </p>
                </div>
                <WhatsAppSender resultToWhatsapp={resultToWhatsapp} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExcelReader;
