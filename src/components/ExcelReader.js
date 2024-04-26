import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import filterExcelData from '../utils/filterExcelData';
import secondFilteredExcelData from '../utils/secondFilteredExcelData'
import WhatsAppSender from './WhatsappSender';
import './ExcelReader.css';
import { transformData, filterRecords, sortAndRemoveDuplicates, populateTutorJsonData } from '../functions/functionsForSecondExcel';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
function ExcelReader() {
    const [excelData, setExcelData] = useState(null);
    const [excelData2, setExcelData2] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileName2, setFileName2] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [payroll, setPayroll] = useState('');
    const onDrop = useCallback((acceptedFiles) => {
        const reader = new FileReader();
        const file = acceptedFiles[0];
        setFileName(file.name);
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            setExcelData(jsonData);
        };
        reader.readAsArrayBuffer(file);
    }, []);
    const { getRootProps, getInputProps } = useDropzone({
        accept: '.xlsx, .xls',
        onDrop,
    });
    const onDrop2 = useCallback((acceptedFiles) => {
        const reader = new FileReader();
        const file = acceptedFiles[0];
        setFileName2(file.name);
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            setExcelData2(jsonData);
        };
        reader.readAsArrayBuffer(file);
    }, []);

    const { getRootProps: getRootProps2, getInputProps: getInputProps2 } = useDropzone({
        accept: '.xlsx, .xls',
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
    const filteredExcelData = filterExcelData(excelData, fromDate, toDate, payroll, 'case1');
    const payRollFilteredExcelData = filterExcelData(excelData, fromDate, toDate, payroll, 'case2');
    const combinedArray = [...filteredExcelData, ...payRollFilteredExcelData];
    const payRollFilteredData = [...new Set(combinedArray)];
    const secondFilteredData = secondFilteredExcelData(excelData2);
    const transformedData = transformData(secondFilteredData);
    const tutorJsonData = populateTutorJsonData(payRollFilteredData);
    const { filteredTutorJsonData, filteredTransformedData } = filterRecords(tutorJsonData, transformedData);
    const combinedAndSortedData = sortAndRemoveDuplicates(filteredTransformedData, filteredTutorJsonData);
    console.log("combinedAndSortedData :", combinedAndSortedData);
    const dropzoneStyles = {
        border: '2px dashed #cccccc',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
    };
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
                                className: 'input',
                            }}
                            InputLabelProps={{
                                shrink: true,
                                style: { marginTop: '-8px' },
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
                                className: 'input',
                            }}
                            InputLabelProps={{
                                shrink: true,
                                style: { marginTop: '-8px' },
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
                                className: 'input',
                            }}
                            InputLabelProps={{
                                shrink: true,
                                style: { marginTop: '-8px' },
                            }}
                        />
                    </Grid>
                </Grid>
            </div>
            <div {...getRootProps()} style={dropzoneStyles}>
                <input {...getInputProps()} />
                {/* Display the uploaded file name */}
                <p>{fileName ? `Uploaded File: ${fileName}` : 'Drag and drop an Excel file here, or click to select files (Timesheet Entry.xlsx)'}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", justifyContent: "center" }}>
                {Object.keys(tutorJsonData).map(key => (
                    <div key={key} style={{ border: "1px solid black", padding: "10px" }}>
                        <h3>{key}</h3>
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                            {tutorJsonData[key].map((item, index) => (
                                <li key={`${key}-${index}`}>
                                    {item['Session Date']} {item['Duration of Session taken']}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div {...getRootProps2()} style={dropzoneStyles}>
                <input {...getInputProps2()} />
                {/* Display the uploaded file name */}
                <p>{fileName2 ? `Uploaded File: ${fileName2}` : 'Drag and drop an Excel file here, or click to select files (Tuitions started By HR.xlsx)'}</p>
            </div>
            <div>
                <h2>Tution Details</h2>
                <div className="tution-grid">
                    {combinedAndSortedData.map((item, index) => {
                        const key = Object.keys(item)[0];
                        const tutionData = item[key];
                        const classesAttended = tutionData.classesAttended;
                        const tutorName = classesAttended[0]["Tution ID and Tuttion Name"].split(" : ")[1];
                        const tutorId = classesAttended[0]["Tution ID and Tuttion Name"].split(" : ")[0];
                        const totalFees = tutionData.finalAmountToParent;
                        const totalDurationOfSessionTaken = tutionData.totalDurationOfSessionTaken;
                        const toNewDate = new Date(new Date('2024-04-24').setDate(new Date('2024-04-24').getDate() + 5)).toLocaleDateString('en-GB');
                        console.log("toDate ", toNewDate)
                        var stringBuilder = '';
                        stringBuilder += `SMARTPOINT E-PAY\n`;
                        stringBuilder += `Class hour updates\n`;
                        stringBuilder += `(${fromDate.split("-").reverse().join(".")} to ${toDate.split("-").reverse().join(".")})` + '\n\n';
                        stringBuilder += `Tuition ID: ${tutorId}\n`
                        stringBuilder += `Tutor: ${tutorName}\n\n`
                        classesAttended.map((cls, clsIndex) => {
                            stringBuilder += `${cls["Session Date"].split('-').reverse().join('-')}- ${cls["Duration of Session taken"]} hrs \n`;
                        });
                        stringBuilder += `--------------------------`
                        stringBuilder += `\nTotal class hours: ${totalDurationOfSessionTaken} hrs`;
                        stringBuilder += `\nTotal Fees: ${totalFees}/-\n`;
                        stringBuilder += `\nAccount No: 39891065373`;
                        stringBuilder += `\nIFSC CODE: SBIN0009485`;
                        stringBuilder += `\nAmount payable : ${totalFees}/-`;
                        stringBuilder += `\nG-pay No: +91 8848083747`;
                        stringBuilder += `\nPayment due date: ${toNewDate}\n`;
                        stringBuilder += `\nNote: Please confirm the payment by sharing a screenshot`;
                        const resultToWhatsapp = stringBuilder
                        console.log("resultToWhatsapp ", resultToWhatsapp)
                        return (
                            <div>
                                <div key={index} className="tution-box">
                                    <p>SMARTPOINT E-PAY</p>
                                    <p>Class hour updates</p>
                                    <p>({fromDate.split("-").reverse().join(".")}   {toDate.split("-").reverse().join(".")})</p>
                                    <p>Tutor Name: {tutorName}</p>
                                    <p>Tuition ID: {tutorId}</p>
                                    <p>Session Date and Duration of Session:</p>
                                    {classesAttended.map((cls, clsIndex) => (
                                        <div key={clsIndex} >
                                            <p>{`${cls["Session Date"].split('-').reverse().join('-')} ${cls["Duration of Session taken"]}`}</p>
                                        </div>
                                    ))}
                                    <p>Total class hours: {totalDurationOfSessionTaken}</p>
                                    <p>Total Fees: {totalFees}</p>
                                    <p>Account No: 39891065373</p>
                                    <p>IFSC CODE: SBIN0009485</p>
                                    <p>Amount payable : {totalFees}/-</p>
                                    <p>G-pay No: +91 8848083747</p>
                                    <p>Payment due date: {toNewDate}</p>
                                    <p>Note: Please confirm the payment by sharing a screenshot</p>
                                </div>
                                <WhatsAppSender resultToWhatsapp={resultToWhatsapp} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
export default ExcelReader;