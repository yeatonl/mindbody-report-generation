/*eslint-disable comma-spacing */
/*eslint-disable no-console*/

const USERNAME = "";
const PASSWORD = "";

//see commit 52f3c1d0c984db4582830a4ce08b31491cbf4f8e for old code

const BASE = "https://api.mindbodyonline.com/public/v6/";
const URL_AUTH = BASE + "usertoken/issue";
const URL_CLIENTS = BASE + "client";
const URL_CLASS = BASE + "class";
const URL_SITE = BASE + "site";
const URL_ENROLLMENT = BASE + "enrollment";
const URL_APPOINTMENT = BASE + "appointment";
const APIKEY = "76af57a017f64fcd9fc16cc5032404a0";
const SITEID = "-99";

import MindbodyRequest from "./requests.js";
class MindbodyQueries {
  constructor() {
    this.requestNum = 0;
    this.authToken = null;
  }

  //gets authentication
  //returns a promise that will eventually resolve
  getAuth() {
    var request = new MindbodyRequest(
      URL_AUTH,
      APIKEY,
      SITEID,
      "POST",
      { "Username": USERNAME,
        "Password": PASSWORD }
    );
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Optional:
  *  @param ClientIds
  *  @param SearchText
  *  @param UniqueIds
  *  @param IsProspect
  *  @param LastModifiedDate
  *//*eslint-enable */
  getClients(parameters) {
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clients" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  //takes parameters as ?<>=<>&<>=<> etc. Either SessionTypeIds or ScheduleType must be provided.
  /* eslint-disable *//**
  * Required:
  * @param SessionTypeIds
  * @param ScheduleType .
  *
  * Optional:
  * @param Arrival
  * @param StartTime
  * @param EndTime
  *//*eslint-enable */
  getActiveSessionTimes(parameters) {
    var request = new MindbodyRequest(
      URL_APPOINTMENT + "/activesessiontimes" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  //gets AppointmentOptions, takes no parameters
  getAppointmentOptions() {
    var request = new MindbodyRequest(
      URL_APPOINTMENT + "/appointmentoptions",
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  *  Required:
  *  @param SessionTypeIds .
  *
  *  Optional:
  *  @param LocationIds
  *  @param StaffIds
  *  @param StartDate
  *  @param EndDate
  *  @param AppointmentId
  *  @param IgnoreDefaultSessionLength
  *//*eslint-enable */
  getBookableItems(parameters) {
    var request = new MindbodyRequest(
      URL_APPOINTMENT + "/bookableitems" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Optional:
  *  @param   LocationIds
  *  @param   StaffIds
  *  @param   StartDate
  *  @param   EndDate
  *  @param   IgnorePrepFinishTimes
  *//*eslint-enable */
  getScheduleItems(parameters) {
    var request = new MindbodyRequest(
      URL_APPOINTMENT + "/scheduleitems" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Optional:
  *  @param AppointmentIds
  *  @param LocationIds
  *  @param StaffIds
  *  @param StartDate
  *  @param EndDate
  *  @param ClientId
  *//*eslint-enable */
  getStaffAppointments(parameters) {
    var request = new MindbodyRequest(
      URL_APPOINTMENT + "/staffappointments" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Optional:
  *  @param ClassDescriptionIds
  *  @param ClassIds
  *  @param StaffIds
  *  @param StartDateTime
  *  @param EndDateTime
  *  @param ClientId
  *  @param ProgramIds
  *  @param SessionTypeIds
  *  @param LocationIds
  *  @param SemesterIds
  *  @param HideCanceledClasses
  *  @param SchedulingWindow
  *  @param LastModifiedDate
  *//*eslint-enable */
  getClasses(parameters) {
    var request = new MindbodyRequest(
      URL_CLASS + "/classes" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * No differentiation is made in mindbody between required and optional for this endpoint.
  *
  * Required:
  *  @param ClassDescriptionIds
  *  @param ProgramIds
  *  @param StartClassDateTime
  *  @param EndClassDateTime
  *  @param StaffId
  *  @param LocationId
  *//*eslint-enable */
  getClassDescriptions(parameters) {
    var request = new MindbodyRequest(
      URL_CLASS + "/classdescriptions" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Optional:
  *  @param ClassScheduleIds
  *  @param EndDate
  *  @param StartDate
  *  @param LocationIds
  *  @param ProgramIds
  *  @param SessionTypeIds
  *  @param StaffIds
  *//*eslint-enable */
  getClassSchedules(parameters) {
    var request = new MindbodyRequest(
      URL_CLASS + "/classschedules" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Required:
  *  @param ClassID
  *  @param LastModifiedDate
  *//*eslint-enable */
  getClassVisits(parameters) {
    var request = new MindbodyRequest(
      URL_CLASS + "/classvisits" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Optional:
  *  @param ClassIds
  *  @param ClassScheduleIds
  *  @param ClientIds
  *  @param HidePastEntries
  *  @param WaitlistEntryIds
  *//*eslint-enable */
  getWaitlistEntries(parameters) {
    var request = new MindbodyRequest(
      URL_CLASS + "/waitlistentries" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Required:
  *  @param ClientId .
  *
  * Optional:
  *  @param LocationId
  *  @param CrossRegionalLookup
  *  @param ClientAssociatedSitesOffset
  *//*eslint-enable */
  getActiveClientMemberships(parameters) {
    var request = new MindbodyRequest(
      URL_CLIENTS + "/activeclientmemberships" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Required:
  *  @param ClientIds .
  *
  * Optional:
  *  @param BalanceDate
  *  @param ClassId
  *//*eslint-enable */
  getClientAccountBalances(parameters) {
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientaccountbalances" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Required:
  *  @param ClientId .
  *
  * Optional:
  *  @param StartDate
  *  @param EndDate
  *  @param StaffIds
  *  @param ShowSystemGenerated
  *  @param TypeIds
  *  @param SubtypeIds
  *//*eslint-enable */
  getContactLogs(parameters) {
    var request = new MindbodyRequest(
      URL_CLIENTS + "/contactlogs" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Required:
  *  @param ClientId .
  *
  * Optional:
  *  @param CrossRegionalLookup
  *  @param ClientAssociatedSitesOffset
  *//*eslint-enable */
  getClientContracts(parameters) {
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientcontracts" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Required:
  *  @param ClientId
  *//*eslint-enable */
  getClientDirectDebitInfo(parameters) {
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientdirectdebitinfo" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * This endpoint is case sensitive
  *
  * Required:
  *  @param FirstName
  *  @param LastName
  *  @param Email
  *//*eslint-enable */
  getClientDuplicates(parameters) {
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientduplicates" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Required:
  *  @param ClientId
  *  @param AppointmentId
  *//*eslint-enable */
  getClientFormulaNotes(parameters) {
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientformulanotes" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Required:
  *  @param RequiredOnly
  *//*eslint-enable */
  getClientIndexes(parameters) {
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientindexes" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Required:
  *  @param ClientId .
  *
  * Optional:
  *  @param StartDate
  *  @param EndDate
  *  @param SaleId
  *//*eslint-enable */
  getClientPurchases(parameters) {
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientpurchases" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Required:
  *  @param IncludeInactive
  *//*eslint-enable */
  getClientReferralTypes(parameters) {
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientreferraltypes" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Required:
  *  @param ClientId .
  *
  * Optional:
  *  @param ClassId
  *  @param ProgramIds
  *  @param LocationIds
  *  @param VisitCount
  *  @param StartDate
  *  @param EndDate
  *  @param ShowActiveOnly
  *  @param CrossRegionalLookup
  *  @param ClientAssociatedSitesOffset
  *  @param SessionTypeId
  *//*eslint-enable */
  getClientServices(parameters) {
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientservices" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * The endpoint for this is not actually listed in mindbody
  *
  * Required:
  *  @param ClientId
  *  @param ClientAssociatedSitesOffset
  *  @param StartDate
  *  @param EndDate
  *  @param UnpaidsOnly .
  *
  * Optional:
  *  @param CrossRegionalLookup
  *//*eslint-enable */
  getClientVisits(parameters) {
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientvisits" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Optional:
  *  @param ClientId
  *  @param Email
  *//*eslint-enable */
  getCrossRegionalClientAssociations(parameters) {
    var request = new MindbodyRequest(
      URL_CLIENTS + "/crossregionalclientassociations" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * This is probably what ecdysiast is using for custom stuff.
  *//*eslint-enable */
  getCustomClientFields(parameters) {
    var request = new MindbodyRequest(
      URL_CLIENTS + "/customclientfields" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Gets the list of fields that a new client has to fill out in business mode, specifically for the sign-up process. AddClient and UpdateClient validate against these fields.
  *//*eslint-enable */
  getRequiredClientFields(parameters) {
    var request = new MindbodyRequest(
      URL_CLIENTS + "/requiredclientfields" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /* eslint-disable *//**
  * Optional:
  *  @param ClassScheduleIds
  *  @param StartDate
  *  @param EndDate
  *  @param LocationIds
  *  @param ProgramIds
  *  @param SessionTypeIds
  *  @param StaffIds
  *//*eslint-enable */
  getEnrollments(parameters) {
    var request = new MindbodyRequest(
      URL_ENROLLMENT + "/enrollments" + parameters,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }


  //may be changed later
  atLimit() {
    /*eslint-disable no-magic-numbers */
    if (this.requestNum >= 800) {
    /*eslint-enable no-magic-numbers */
      return true;
    }
    return false;
  }
}

/*example code
var client = new mindbodyQueries();
client.getAuth()
  .then((value) => {
    client.AUTH_TOKEN = value.AccessToken;
    return client.getClients();
  })
  .then((value) => {
    console.log(value);
  })
  .catch((m) => {
    console.log(m);
  });
  */



