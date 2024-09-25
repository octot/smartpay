import MissedDataTable from './MissedDataTable'
const MissedData = ({ tutorJsonData, transformedData, combinedAndSortedData }) => {
    let tutorDetailsFromFirstExcel = [];
    let tutorDetailsFromSecondExcel = [];
    let tutorDetailsFromCombinedExcel = [];
    let missingTutorDetailsFromCombinedExcel = [];
    let headings = [];
    console.log('MissedData tutorJsonData ,combinedAndSortedData ,transformedData', tutorJsonData, combinedAndSortedData, transformedData)
    if (tutorJsonData && transformedData && combinedAndSortedData) {
        console.log('MissedData tutorJsonData ', tutorJsonData);

        // Ensure tutorDetailsFromFirstExcel is an array
        tutorDetailsFromFirstExcel = Object.keys(tutorJsonData).map(key => key.split(':')[0].trim());
        console.log('tutorDetailsFromFirstExcel ', tutorDetailsFromFirstExcel);
        console.log('Type of tutorDetailsFromFirstExcel: ', Array.isArray(tutorDetailsFromFirstExcel) ? 'Array' : typeof tutorDetailsFromFirstExcel);

        // Ensure tutorDetailsFromSecondExcel is an array
        tutorDetailsFromSecondExcel = transformedData.map(item => item.tutorID);
        console.log('tutorDetailsFromSecondExcel ', tutorDetailsFromSecondExcel);
        console.log('Type of tutorDetailsFromSecondExcel: ', Array.isArray(tutorDetailsFromSecondExcel) ? 'Array' : typeof tutorDetailsFromSecondExcel);

        // Ensure tutorDetailsFromCombinedExcel is an array
        tutorDetailsFromCombinedExcel = combinedAndSortedData.map(obj => Object.keys(obj)[0]);
        console.log('tutorDetailsFromCombinedExcel ', tutorDetailsFromCombinedExcel);
        console.log('Type of tutorDetailsFromCombinedExcel: ', Array.isArray(tutorDetailsFromCombinedExcel) ? 'Array' : typeof tutorDetailsFromCombinedExcel);

        // Ensure missingTutorDetailsFromCombinedExcel is an array
        missingTutorDetailsFromCombinedExcel = [...new Set([...tutorDetailsFromFirstExcel])].filter(item => !tutorDetailsFromCombinedExcel.includes(item));
        console.log('missingTutorDetailsFromCombinedExcel ', missingTutorDetailsFromCombinedExcel);
        console.log('Type of missingTutorDetailsFromCombinedExcel: ', Array.isArray(missingTutorDetailsFromCombinedExcel) ? 'Array' : typeof missingTutorDetailsFromCombinedExcel);

        // Log headings
        headings = ['tutorDetailsFromFirstExcel', 'tutorDetailsFromSecondExcel', 'tutorDetailsFromCombinedExcel', 'missingTutorDetailsFromCombinedExcel'];
        console.log('headings ', headings);
        console.log('Type of headings: ', Array.isArray(headings) ? 'Array' : typeof headings);

    }
    else {
        // console.error('Data not found tutorJsonData ', tutorJsonData)
        console.error('Data not found [tutorJsonData , transformedData , combinedAndSortedData]', tutorJsonData, transformedData, combinedAndSortedData)
    }
    return (
        <div>
            {tutorDetailsFromFirstExcel && tutorDetailsFromSecondExcel
                && missingTutorDetailsFromCombinedExcel && (
                    <MissedDataTable
                        tutorDetailsFromFirstExcel={tutorDetailsFromFirstExcel}
                        tutorDetailsFromSecondExcel={tutorDetailsFromSecondExcel}
                        tutorDetailsFromCombinedExcel={tutorDetailsFromCombinedExcel}
                        missingTutorDetailsFromCombinedExcel={missingTutorDetailsFromCombinedExcel}
                        headings={headings}
                    />
                )}

        </div>
    )
}

export default MissedData