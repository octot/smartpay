export function transformData(secondFilteredData) {
  try {
    // // console.log("transformData input ", secondFilteredData);
    const outputOfTransformData = secondFilteredData.slice(1).map((item) => ({
      tutorID: item[3],
      submitTime: item[1],
      paymentToParentPerHr: item[11],
      parentPhoneNumber: item[8],
    }));
    // // console.log("transformData output ", outputOfTransformData);
    return outputOfTransformData;
  } catch (error) {
    console.error("Error in transformData:", error);
    throw error;
  }
}

export function filterRecords(filteredBasedOnIsRequired, transformedData) {
  // // console.log("filteredBasedOnIsRequired input ", filteredBasedOnIsRequired);

  try {
    const filteredTutorJsonData = {};
    const filteredTransformedData = [];
    if (filteredBasedOnIsRequired) {
      Object.keys(filteredBasedOnIsRequired).forEach((tutorID) => {
        transformedData.forEach((record) => {
          let numberPart = tutorID.split(":")[0].trim();
          if (record.tutorID == numberPart) {
            filteredTutorJsonData[tutorID] = filteredBasedOnIsRequired[tutorID];
            // // console.log(
            // // "filterRecords filteredTutorJsonData ",
            // // filteredTutorJsonData
            // // );
          }
        });
      });
      for (const tutorID in filteredTutorJsonData) {
        if (
          Object.prototype.hasOwnProperty.call(filteredTutorJsonData, tutorID)
        ) {
          transformedData.forEach((record) => {
            let numberPartFilteredTutorJsonData = tutorID.split(":")[0].trim();
            let recordTutorIDString =
              typeof record.tutorID === "string"
                ? record.tutorID
                : String(record.tutorID);
            if (recordTutorIDString === numberPartFilteredTutorJsonData) {
              filteredTransformedData.push(record);
            }
          });
        }
      }
    }
    return { filteredTutorJsonData, filteredTransformedData };
  } catch (error) {
    console.error("Error in filterRecords:", error);
    throw error;
  }
}
export function sortAndRemoveDuplicates(
  filteredTransformedData,
  filteredTutorJsonData
) {
  try {
    // // console.log(
    // // `sortAndRemoveDuplicates input: filteredTransformedData: ${JSON.stringify(
    // // filteredTransformedData
    // // )}, filteredTutorJsonData: ${JSON.stringify(filteredTutorJsonData)} \n`);
    const sortedData = filteredTransformedData.sort(
      (a, b) => new Date(b.submitTime) - new Date(a.submitTime)
    );
    const uniqueData = sortedData.filter(
      (record, index, self) =>
        index === self.findIndex((r) => r.tutorID === record.tutorID)
    );
    const tutorTotalDuration = [];
    for (const key in filteredTutorJsonData) {
      if (Object.prototype.hasOwnProperty.call(filteredTutorJsonData, key)) {
        const tutorSessions = filteredTutorJsonData[key];
        let totalDuration = 0;
        tutorSessions.forEach((session) => {
          totalDuration +=
            parseFloat(session["Duration of Session taken"]) || 0;
        });
        tutorTotalDuration.push({
          [key]: [
            {
              classesAttended: filteredTutorJsonData[key],
              totalDurationOfSessionTaken: totalDuration,
            },
          ],
        });
      }
    }
    const combinedRecords = combineData(uniqueData, tutorTotalDuration);
    // // console.log(
    // // `sortAndRemoveDuplicates output: combinedRecords: ${JSON.stringify(
    // // combinedRecords
    // // )} \n`);
    return combinedRecords;
  } catch (error) {
    console.error("Error in sortAndRemoveDuplicates:", error);
    throw error;
  }
}
export function combineData(uniqueData, tutorTotalDuration) {
  try {
    // // console.log(`combineData input: tutorTotalDuration: ${JSON.stringify(tutorTotalDuration)},uniqueData: ${JSON.stringify(uniqueData)} \n`);
    const combinedData = [];
    uniqueData.forEach((record) => {
      const tutorID = record.tutorID;
      const tutorDurationObject = tutorTotalDuration.find(
        (obj) => Object.keys(obj)[0].split(" ")[0] == tutorID
      );
      let totalDurationOfSessionTaken = [];
      let classesAttended = [];
      let parentPhoneNumber = [];
      for (const [tutorName, tutorData] of Object.entries(
        tutorDurationObject
      )) {
        classesAttended = tutorData[0].classesAttended;
        totalDurationOfSessionTaken = tutorData[0].totalDurationOfSessionTaken;
        parentPhoneNumber = record.parentPhoneNumber;
      }
      if (tutorDurationObject) {
        const totalDurationObj = {
          [tutorID]: {
            classesAttended: classesAttended,
            totalDurationOfSessionTaken: totalDurationOfSessionTaken,
            finalAmountToParent:
              record.paymentToParentPerHr * totalDurationOfSessionTaken,
            parentPhoneNumber: parentPhoneNumber,
          },
        };
        combinedData.push(totalDurationObj);
      }
    });
    // // console.log("combineData output ", combinedData);
    return combinedData;
  } catch (error) {
    console.error("Error in combineData:", error);
    throw error;
  }
}
function sortByDateSessionRecords(sessions) {
  let newSessions = sessions.sort((a, b) => {
    const dateA = new Date(a["Session Date"]);
    const dateB = new Date(b["Session Date"]);
    return dateA - dateB;
  });
  // console.log("newSessions ", newSessions);
  return newSessions;
}
export function populateTutorJsonData(payRollFilteredData) {
  // // console.log(`payRollFilteredData input  ${payRollFilteredData} \n`);
  try {
    const tutorJsonDataRecord = {};
    for (let i = 1; i < payRollFilteredData.length; i++) {
      const entry = payRollFilteredData[i];
      const key = entry[2];
      if (!tutorJsonDataRecord[key]) {
        tutorJsonDataRecord[key] = {
          checked: true,
          sessions: [],
        };
      }
      let sessions = [];
      const obj = {
        "SL NO": entry[0],
        "Submit Date": entry[1],
        "Tution ID and Tuttion Name": entry[2],
        "Session Date": entry[3],
        "Session Start Time": entry[4],
        "Session End Time": entry[5],
        "Duration of Session taken": entry[6],
        "How do you rate your class Experience": entry[7],
        Remarks: entry[8],
        status: entry["status"],
        isRequired: true,
      };
      tutorJsonDataRecord[key].sessions.push(obj);
    }

    for (let [key, value] of Object.entries(tutorJsonDataRecord)) {
      if (value.sessions) {
        value.sessions = sortByDateSessionRecords(value.sessions);
      }
    }
    // console.log("payRollFilteredData output", tutorJsonDataRecord);
    return tutorJsonDataRecord;
  } catch (error) {
    console.error("Error in populateTutorJsonData:", error);
    throw error;
  }
}
export function populateFilteredBasedOnIsRequired(copyTutorJsonData) {
  // // console.log("populateFilteredBasedOnIsRequired input", copyTutorJsonData);
  const filteredData = {};
  try {
    // Filter the data where `isRequired` is true
    for (const key in copyTutorJsonData) {
      if (copyTutorJsonData.hasOwnProperty(key)) {
        const filteredItems = [];
        // // console.log("copyTutorJsonData[key]", copyTutorJsonData[key]);
        if (copyTutorJsonData[key].checked) {
          for (const item of copyTutorJsonData[key].sessions) {
            if (item.isRequired === true) {
              filteredItems.push(item);
            }
          }
          if (filteredItems.length > 0) {
            filteredData[key] = filteredItems;
          }
        }
      }
    }
    // // console.log("Filtered data based on isRequired", filteredData);
    return filteredData;
  } catch (error) {
    console.error("Error in populateFilteredBasedOnIsRequired", error);
    return {}; // Return an empty object in case of error
  }
}
