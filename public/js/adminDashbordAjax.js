function setTimeRange(timeRange) {
    const currentDate = new Date();
    const startDate = new Date();
    switch (timeRange) {
        case "previousWeek":
            startDate.setDate(startDate.getDate() - 7);
            break;
        case "previousMonth":
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        case "previousYear":
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        default:
            break;
    }
    document.getElementById("startDate").valueAsDate = startDate;
    document.getElementById("endDate").valueAsDate = currentDate;
}

function validateForm(input){
    var startDateValue = document.getElementById("startDate").value;
var endDateValue = document.getElementById("endDate").value;
var downloadFormatValue = document.getElementById("downloadFormat").value;
const currentDate = new Date();
const start = new Date(startDateValue);
const end = new Date(endDateValue);

if (
  startDateValue.trim() !== '' &&
  endDateValue.trim() !== '' &&
  downloadFormatValue.trim() !== '' &&
  start < end &&
  end < currentDate
) {
  $('#generateReportBtn').prop("disabled", false);
} else {
  $('#generateReportBtn').prop("disabled", true);
}


  }