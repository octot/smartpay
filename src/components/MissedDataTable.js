import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableColumn } from '@mui/material';

const MissedDataTable = ({
    tutorDetailsFromFirstExcel,
    tutorDetailsFromSecondExcel,
    tutorDetailsFromCombinedExcel,
    missingTutorDetailsFromCombinedExcel,
    headings
}) => {
    console.log("typetutorDetailsFromFirstExcel", typeof (tutorDetailsFromFirstExcel))
    console.log("tutorDetailsFromFirstExcelData", Object.keys(tutorDetailsFromFirstExcel));
    const maxLength = Math.max(
        tutorDetailsFromFirstExcel.length,
        tutorDetailsFromSecondExcel.length,
        tutorDetailsFromCombinedExcel.length,
        missingTutorDetailsFromCombinedExcel.length
    );

    const combinedData = Array.from({ length: maxLength }, (_, index) => ({
        column1: tutorDetailsFromFirstExcel[index] || '',
        column2: tutorDetailsFromSecondExcel[index] || '',
        column3: tutorDetailsFromCombinedExcel[index] || '',
        column4: missingTutorDetailsFromCombinedExcel[index] || '',
    }));

    console.log(combinedData);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {headings.map((heading, index) => (
                            <TableCell key={index}>{heading}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {combinedData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            <TableCell>{row.column1}</TableCell>
                            <TableCell>{row.column2}</TableCell>
                            <TableCell>{row.column3}</TableCell>
                            <TableCell>{row.column4}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>


            </Table>
        </TableContainer>
    );
};

export default MissedDataTable;
