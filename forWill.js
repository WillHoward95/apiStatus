//api
const rawData = [
  { activity: "intentStatus", status: "complete", activityDate: "21/01/2023" },
  {
    activity: "aipMortgageNeedsStatus",
    status: "complete",
    activityDate: "21/01/2023",
  },
  { activity: "aipResults", status: "in_progress", activityDate: "21/01/2023" },
  {
    activity: "aipYourDetails",
    status: "complete",
    activityDate: "21/01/2023",
  },
  { activity: "calculatorStatus", status: "", activityDate: "21/01/2023" },
  { activity: "epcStatus", status: "complete", activityDate: "21/01/2023" },
  {
    activity: "applyOnlineStatus",
    status: "complete",
    activityDate: "21/01/2023",
  },
  {
    activity: "randomActivity2",
    status: "in_progress",
    activityDate: "21/01/2023",
  },
  {
    activity: "gettingReadyStatus",
    status: "in_progress",
    activityDate: "21/01/2023",
  },
  {
    activity: "appointmentCheckoutStatus",
    status: "in_progress",
    activityDate: "21/01/2023",
  },
  {
    activity: "protectingHomeFutureStatus",
    status: "complete",
    activityDate: "21/01/2023",
  },
  {
    activity: "randomActivity",
    status: "complete",
    activityDate: "21/01/2023",
  },
];

const lastAction = "epcStatus";

// const expectedResponse = {
// intent: "string", (complete)
// calculator: "string", ("")
// aip: "string", (in_progress)
// checkout: "string", (in_progress)
// applyOnline: "string", (complete)
// property: "string",
// preparation: "string", (in_progress)
// insurance: "string", (complete)
// illustration: "string", ("")
// summaryDate: "string",
// };

// response should be either "", "in_progress", "complete" for each field
//aip is completed if aipResults has been completed. It is in progress if any aip activities are in progress, there are 9 possible aip activities. The first one is aipMortgageNeedsStatus
//property is derived from propertyStatus and epcStatus (if either are in progress then all in progress, etc)
//summary date is activityDate of the supplied lastAction

//initiate the response object
const response = {};
const propertyObj = {};

//loop over the array
function buildResponseObject(data) {
  for (element of data) {
    //destructure the activity and the status
    const { activity, status, activityDate } = element;

    //call the checkAPI func to get the key for the response obj
    const key = checkAPIName(activity);

    //add the key and value to the response object if the key is truthy
    if (key) {
      response[key] = status;
    }

    //get the summary date
    if (activity == lastAction) {
      response.summaryDate = activityDate;
    }

    //handling property status
    if (activity == "epcStatus" || activity == "propertyStatus") {
      propertyObj[activity] = status;
    }
  }
}

//check the name of the API and return the key we want to use for it
function checkAPIName(activity) {
  switch (activity) {
    case "intentStatus":
      return "intent";
    case "calculatorStatus":
      return "calculator";
    case "appointmentCheckoutStatus":
      return "checkout";
    case "applyOnlineStatus":
      return "applyOnline";
    case "gettingReadyStatus":
      return "preparation";
    case "protectingHomeFutureStatus":
      return "insurance";
    case "illustrationStatus":
      return "illustration";
    case "aipResults":
      return "aip";
    default:
      return null;
  }
}

//add anything that is not included that should be
function missing(response) {
  //check response keys against the needed list of keys and add any that are missing
  const keys = Object.keys(response);
  const apis = [
    "intent",
    "calculator",
    "aip",
    "checkout",
    "applyOnline",
    "property",
    "preparation",
    "insurance",
    "illustration",
  ];

  for (let i = 0; i < apis.length; i++) {
    if (!keys.includes(apis[i])) {
      response[apis[i]] = "";
    }
  }
}

//run the functions
buildResponseObject(rawData);
missing(response);

//propertyStatus
if (
  propertyObj.epcStatus == "in_progress" ||
  propertyObj.propertyStatus == "in_progress"
) {
  response.property = "in_progress";
} else if (
  propertyObj.epcStatus == "complete" &&
  propertyObj.propertyStatus == "complete"
) {
  response.property = "complete";
} else {
  response.property = "";
}

console.log(response);
