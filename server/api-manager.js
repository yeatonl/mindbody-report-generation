/*eslint-disable comma-spacing */
/*eslint-disable no-console*/

import {appSettings} from "./config/config.js";

const USERNAME = "Siteowner";
const PASSWORD = "apitest1234";

//see commit 52f3c1d0c984db4582830a4ce08b31491cbf4f8e for old code

const BASE = "https://api.mindbodyonline.com/public/v6/";
const URL_AUTH = BASE + "usertoken/issue";
const URL_CLIENTS = BASE + "client";
const URL_CLASS = BASE + "class";
const URL_SITE = BASE + "site";
const URL_SALE = BASE + "sale";
const URL_STAFF = BASE + "staff";
const URL_ENROLLMENT = BASE + "enrollment";
const URL_APPOINTMENT = BASE + "appointment";
//const APIKEY = "76af57a017f64fcd9fc16cc5032404a0";
const APIKEY = "7db287c206374b2f911ddc918879983d"; //dan's API key. Use it if you really need it
const SITEID = "-99";

import MindbodyRequest from "./requests.js";
import QueryString from "query-string";
class MindbodyQueries {
  constructor() {
    this.requestNum = 0;
    this.authToken = null;
    this.loadConfig();
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
      let requestPromise = request.makeRequest();
      requestPromise.then((authResponse) => {
        this.authToken = authResponse.AccessToken;
        return Promise.resolve();
      });
      return requestPromise;
    }
    return Promise.reject(Error("Request limit reached"));
  }

  /**@returns Activation code. Requires mindbody to approve you for live customer data */
  getActivationCode() {
    var request = new MindbodyRequest(
      URL_SITE + "/activationcode",
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Optional:
  *  @param {string[]} ClientIds Filters results to clients with these IDs.
  *  @param {string} SearchText Text to use in the search. Can include FirstName, LastName, and Email. Note that user credentials must be provided.
  *  @param {number[]} UniqueIds Filters results to clients with these UniqueIDs. This parameter can not be used with ClientIDs or SearchText.
  *  @param {boolean} IsProspect When true, filters the results to include only those clients marked as prospects for the business. When false, indicates indicates that only those clients who are not marked prospects should be returned.
  *  @param {string} LastModifiedDate Filters the results to include only the clients that have been modified on or after this date.
  *//*eslint-enable */
  getClients(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clients?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  //takes parameters as ?<>=<>&<>=<> etc. Either SessionTypeIds or ScheduleType must be provided.
  /* eslint-disable *//**
  * Optional:
  * @param {string} SessionTypeIds Filters on the provided session type IDs. Either SessionTypeIds or ScheduleType must be provided.
  * @param {numbers[]} ScheduleType Filters on the provided the schedule type. Either SessionTypeIds or ScheduleType must be provided.
  * @param {string} StartTime Filters results to times that start on or after this time on the current date. Any date provided is ignored.
  * @param {string} EndTime Filters results to times that end on or before this time on the current date. Any date provided is ignored.
  *//*eslint-enable */
  getActiveSessionTimes(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_APPOINTMENT + "/activesessiontimes?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
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
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  *  Required:
  *  @param {numbers[]} SessionTypeIds A list of the requested session type IDs.
  *
  *  Optional:
  *  @param {numbers[]} LocationIds A list of the requested location IDs.
  *  @param {numbers[]} StaffIds A list of the requested staff IDs.
  *  @param {string} StartDate The start date of the requested date range.
  *  @param {string} EndDate The end date of the requested date range.
  *  @param {number} AppointmentId If provided, filters out the appointment with this ID.
  *  @param {boolean} IgnoreDefaultSessionLength When true, availabilities that are nondefault return, for example, a 30-minute availability with a 60-minute default session length. When false, only availabilities that have the default session length return.
  *//*eslint-enable */
  getBookableItems(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_APPOINTMENT + "/bookableitems?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Optional:
  *  @param {numbers[]} LocationIds A list of the requested location IDs.
  *  @param {numbers[]} StaffIds A list of the requested staff IDs.
  *  @param {string} StartDate The start date of the requested date range.
  *  @param {string} EndDate The end date of the requested date range.
  *  @param {boolean} IgnorePrepFinishTimes When true, appointment preparation and finish unavailabilities are not returned.
  *//*eslint-enable */
  getScheduleItems(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_APPOINTMENT + "/scheduleitems?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Optional:
  *  @param {numbers[]} AppointmentIds A list of the requested appointment IDs.
  *  @param {numbers[]} LocationIds A list of the requested location IDs.
  *  @param {numbers[]} StaffIds A list of the requested staff IDs.
  *  @param {string} StartDate The start date of the requested date range.
  *  @param {string} EndDate The end date of the requested date range.
  *  @param {string} ClientId The client ID to be returned.
  *//*eslint-enable */
  getStaffAppointments(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_APPOINTMENT + "/staffappointments?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Optional:
  *  @param {numbers[]} ClassDescriptionIds The requested class description IDs.
  *  @param {numbers[]} ClassIds The requested class IDs.
  *  @param {numbers[]} StaffIds The requested IDs of the teaching staff members.
  *  @param {string} StartDateTime The requested start date for filtering.
  *  @param {string} EndDateTime The requested end date for filtering.
  *  @param {string} ClientId The client ID of the client who is viewing this class list. Based on identity, the client may be able to see additional information, such as membership specials.
  *  @param {numbers[]} ProgramIds A list of program IDs on which to base the search.
  *  @param {numbers[]} SessionTypeIds A list of session type IDs on which to base the search.
  *  @param {numbers[]} LocationIds A list of location IDs on which to base the search.
  *  @param {numbers[]} SemesterIds A list of semester IDs on which to base the search.
  *  @param {boolean} HideCanceledClasses When true, canceled classes are removed from the response. When false, canceled classes are included in the response.
  *  @param {boolean} SchedulingWindow When true, classes outside scheduling window are removed from the response. When false, classes are included in the response, regardless of the scheduling window.
  *  @param {string} LastModifiedDate When included in the request, only records modified on or after the LastModifiedDate specified are included in the response.
  *//*eslint-enable */
  getClasses(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLASS + "/classes?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * No differentiation is made in mindbody between required and optional for this endpoint.
  *
  * Required:
  *  @param {number} ClassDescriptionIds The ID of the requested client.
  *  @param {number[]} ProgramIds A list of requested program IDs.
  *  @param {string} StartClassDateTime The date and time that the class starts.
  *  @param {string} EndClassDateTime The date and time that the class ends.
  *  @param {number} StaffId The ID of the requested staff member.
  *  @param {number} LocationId The ID of the requested location.
  *//*eslint-enable */
  getClassDescriptions(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLASS + "/classdescriptions?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Optional:
  *  @param {number[]} ClassScheduleIds The class schedule IDs.
  *  @param {string} EndDate The end date of the range. Return any active enrollments that occur on or before this day.
  *  @param {string} StartDate The start date of the range. Return any active enrollments that occur on or after this day.
  *  @param {number[]} LocationIds The location IDs.
  *  @param {number[]} ProgramIds The program IDs.
  *  @param {number[]} SessionTypeIds The session type IDs.
  *  @param {number[]} StaffIds The staff IDs.
  *//*eslint-enable */
  getClassSchedules(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLASS + "/classschedules?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param {number} ClassID The class ID.
  *  @param {string} LastModifiedDate When included in the request, only records modified on or after the LastModifiedDate specified are included in the response.
  *//*eslint-enable */
  getClassVisits(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLASS + "/classvisits?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Either ClassScheduleIds, ClientIds, WaitlistEntryIds, or ClassIds is required; the others become optional.
  *
  * Optional:
  *  @param {number[]} ClassIds The requested class IDs. If a class ID is present, the request automatically disregards any class schedule IDs in the request.
  *  @param {number[]} ClassScheduleIds The requested class schedule IDs. If a class ID is present, the request automatically disregards any class schedule IDs in the request.
  *  @param {string[]} ClientIds The requested client IDs.
  *  @param {boolean} HidePastEntries When true, indicates that past waiting list entries are hidden from clients. When false, indicates that past entries are not hidden from clients.
  *  @param {number[]} WaitlistEntryIds The requested waiting list entry IDs. Either ClassScheduleIds, ClientIds, WaitlistEntryIds, or ClassIds is required; the others become optional.
  *//*eslint-enable */
  getWaitlistEntries(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLASS + "/waitlistentries?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param {string} ClientId The ID of the client for whom memberships are returned.
  *
  * Optional:
  *  @param {number} LocationId Filters results to memberships that can be used to pay for scheduled services at that location. This parameter can not be passed when CrossRegionalLookup is true.
  *  @param {boolean} CrossRegionalLookup Used to retrieve a client’s memberships from multiple sites within an organization. When included and set to true, it searches a maximum of ten sites with which this client is associated. When a client is associated with more than ten sites, use ClientAssociatedSitesOffset as many times as needed to search the additional sites with which the client is associated. You can use the CrossRegionalClientAssociations value from GET CrossRegionalClientAssociations to determine how many sites the client is associated with.
  *  @param {number} ClientAssociatedSitesOffset Used to retrieve a client’s memberships from multiple sites within an organization when the client is associated with more than ten sites. To change which ten sites are searched, change this offset value. A value of 0 means that no sites are skipped and the first ten sites are returned. You can use the CrossRegionalClientAssociations value from GET CrossRegionalClientAssociations to determine how many sites the client is associated with. Note that you must always have CrossRegionalLookup set to true to use this parameter.
  *//*eslint-enable */
  getActiveClientMemberships(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/activeclientmemberships?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param {string[]} ClientIds The list of clients IDs for which you want account balances.
  *
  * Optional:
  *  @param {string} BalanceDate The date you want a balance relative to.
  *  @param {number} ClassId The class ID of the event for which you want a balance.
  *//*eslint-enable */
  getClientAccountBalances(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientaccountbalances?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param {string} ClientId The ID of the client whose contact logs are being requested.
  *
  * Optional:
  *  @param {string} StartDate Filters the results to contact logs created on or after this date.
  *  @param {string} EndDate Filters the results to contact logs created before this date.
  *  @param {number[]} StaffIds Filters the results to return contact logs assigned to one or more staff IDs.
  *  @param {boolean} ShowSystemGenerated When true, system-generated contact logs are returned in the results.
  *  @param {number[]} TypeIds Filters the results to contact logs assigned one or more of these type IDs.
  *  @param {number[]} SubtypeIds Filters the results to contact logs assigned one or more of these subtype IDs.
  *//*eslint-enable */
  getContactLogs(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/contactlogs?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param {string} ClientId The ID of the client.
  *
  * Optional:
  *  @param {boolean} CrossRegionalLookup When true, indicates that the requesting client’s cross regional contracts are returned, if any. When false, indicates that cross regional contracts are not returned.
  *  @param {number} ClientAssociatedSitesOffset 	Determines how many sites are skipped over when retrieving a client’s cross regional contracts. Used when a client ID is linked to more than ten sites in an organization. Only a maximum of ten site databases are queried when this call is made and CrossRegionalLookup is set to true. To change which sites are queried, change this offset value.
  *//*eslint-enable */
  getClientContracts(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientcontracts?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param {string} ClientId The ID of the client.
  *//*eslint-enable */
  getClientDirectDebitInfo(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientdirectdebitinfo?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * This endpoint is case sensitive
  *
  * Required:
  *  @param {string} FirstName The client’s first name.
  *  @param {string} LastName The client’s last name.
  *  @param {string} Email The client’s email address.
  *//*eslint-enable */
  getClientDuplicates(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientduplicates?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param {string} ClientId The client ID of the client whose formula notes are being requested.
  *  @param {number} AppointmentId The appointment ID of the appointment that the formula notes are related to.
  *//*eslint-enable */
  getClientFormulaNotes(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientformulanotes?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param {boolean} RequiredOnly When true, filters the results to only indexes that are required on creation. When false or omitted, returns all of the client indexes.
  *//*eslint-enable */
  getClientIndexes(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientindexes?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param {string} ClientId The ID of the client you are querying for purchases.
  *
  * Optional:
  *  @param {string} StartDate Filters results to purchases made on or after this timestamp.
  *  @param {string} EndDate Filters results to purchases made before this timestamp.
  *  @param {number} SaleId Filters results to the single record associated with this ID.
  *//*eslint-enable */
  getClientPurchases(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientpurchases?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param {boolean} IncludeInactive When true, filters the results to include subtypes and inactive referral types. When false, includes no subtypes and only active types.
  *//*eslint-enable */
  getClientReferralTypes(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientreferraltypes?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param {string} ClientId The ID of the client to query. The results are a list of pricing options that the client has purchased. Note that “service” and “pricing option” are synonymous in this section of the documentation.
  *
  * Optional:
  *  @param {number} ClassId Filters results to only those pricing options that can be used to pay for this class.
  *  @param {number[]} ProgramIds Filters results to pricing options that belong to one of the given program IDs.
  *  @param {number[]} LocationIds Filters results to pricing options that can be used at the listed location IDs.
  *  @param {number} VisitCount A filter on the minimum number of visits a service can pay for.
  *  @param {string} StartDate Filters results to pricing options that were purchased on or after this date.
  *  @param {string} EndDate Filters results to pricing options that were purchased on or before this date.
  *  @param {boolean} ShowActiveOnly When true, includes active services only.
  *  @param {boolean} CrossRegionalLookup Used to retrieve a client’s pricing options from multiple sites within an organization. When included and set to true, it searches a maximum of ten sites with which this client is associated. When a client is associated with more than ten sites, use ClientAssociatedSitesOffset as many times as needed to search the additional sites with which the client is associated. You can use the CrossRegionalClientAssociations value from GET CrossRegionalClientAssociations to determine how many sites the client is associated with. Note that a SiteID is returned and populated in the ClientServices response when CrossRegionalLookup is set to true.
  *  @param {boolean} ClientAssociatedSitesOffset Used to retrieve a client’s pricing options from multiple sites within an organization when the client is associated with more than ten sites. To change which ten sites are searched, change this offset value. A value of 0 means that no sites are skipped and the first ten sites are returned. You can use the CrossRegionalClientAssociations value from GET CrossRegionalClientAssociations to determine how many sites the client is associated with. Note that you must always have CrossRegionalLookup set to true to use this parameter.
  *  @param {number} SessionTypeId Filters results to pricing options that will pay for the given session type ID. Use this to find pricing options that will pay for a specific appointment type.
  *//*eslint-enable */
  getClientServices(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientservices?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * The endpoint for this is not actually listed in mindbody
  *
  * Required:
  *  @param {string} ClientId The ID of the requested client.
  *  @param {number} ClientAssociatedSitesOffset The number of sites to skip when returning the site associated with a client.
  *  @param {string} StartDate The date before which class visits are not returned.
  *  @param {string} EndDate The date past which class visits are not returned.
  *  @param {boolean} UnpaidsOnly When true, indicates that only visits that have not been paid for are returned. When false, indicates that all visits are returned, regardless of whether they have been paid for.
  *
  * Optional:
  *  @param {boolean} CrossRegionalLookup When true, indicates that past and scheduled client visits across all sites in the region are returned. When false, indicates that only visits at the current site are returned.
  *//*eslint-enable */
  getClientVisits(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientvisits?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Optional:
  *  @param {string} ClientId Looks up the cross regional associations by the client’s ID. Either ClientId or Email must be provided. If both are provided, the ClientId is used by default.
  *  @param {string} Email Looks up the cross regional associations by the client’s email address. Either ClientId or Email must be provided. If both are provided, the ClientId is used by default.
  *//*eslint-enable */
  getCrossRegionalClientAssociations(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/crossregionalclientassociations?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * This is probably what ecdysiast is using for custom stuff.
  *//*eslint-enable */
  getCustomClientFields(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/customclientfields?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Gets the list of fields that a new client has to fill out in business mode, specifically for the sign-up process. AddClient and UpdateClient validate against these fields.
  *//*eslint-enable */
  getRequiredClientFields(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/requiredclientfields?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Optional:
  *  @param {number[]} ClassScheduleIds A list of the requested class schedule IDs. If omitted, all class schedule IDs return.
  *  @param {string} StartDate The start of the date range. The response returns any active enrollments that occur on or after this day.
  *  @param {string} EndDate The end of the date range. The response returns any active enrollments that occur on or before this day.
  *  @param {number[]} LocationIds List of the IDs for the requested locations. If omitted, all location IDs return.
  *  @param {number[]} ProgramIds List of the IDs for the requested programs. If omitted, all program IDs return.
  *  @param {number[]} SessionTypeIds List of the IDs for the requested session types. If omitted, all session types IDs return.
  *  @param {number[]} StaffIds List of the IDs for the requested staff IDs. If omitted, all staff IDs return.
  *//*eslint-enable */
  getEnrollments(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_ENROLLMENT + "/enrollments?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * @returns     
  *  Visa,
  *  MasterCard,
  *  Discover,
  *  AMEX
  *//*eslint-enable */
  getAcceptedCardTypes() {
    var request = new MindbodyRequest(
      URL_SALE + "/acceptedcardtypes",
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param {number} LocationId The ID of the location that has the requested contracts and AutoPay options.
  * Optional:
  *  @param {number[]} ContractIds When included, the response only contains details about the specified contract IDs.
  *  @param {boolean} SoldOnline When true, the response only contains details about contracts and AutoPay options that can be sold online. When false, only contracts that are not intended to be sold online are returned.
  *  @param {number} ConsumerId The ID of the client.
  *//*eslint-enable */
  getContracts(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_SALE + "/contracts?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /**@returns Who knows, no docs*/
  getCustomPaymentMethods() {
    var request = new MindbodyRequest(
      URL_SALE + "/custompaymentmethods",
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param {string} barcodeId The barcode ID of the gift card for which you want to retrieve the balance.
  *//*eslint-enable */
  getGiftCardBalance(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_SALE + "/giftcardbalance?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Optional:
  *  @param {number[]} Ids Filters the results to the requested gift card IDs.
  *  @param {number} LocationId When included, returns gift cards that are sold at the provided location ID.
  *  @param {boolean} SoldOnline When true, only returns gift cards that are sold online.
  *//*eslint-enable */
  getGiftCards(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_SALE + "/giftcards?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Optional:
  *  @param {boolean} SellOnline When true, only return products that are sellable online. When false, all products are returned.
  *  @param {number[]} PackageIds A list of the packages IDs to filter by.
  *//*eslint-enable */
  getPackages(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_SALE + "/packages?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Optional:
  *  @param {string[]} ProductIds The barcode IDs to filter by.
  *  @param {string} SearchText A search filter, used for searching by term.
  *  @param {number[]} CategoryIds A list of category IDs to filter by.
  *  @param {number[]} SubCategoryIds A list of subcategory IDs to filter by.
  *  @param {boolean} SellOnline When true, only products that are sellable online are returned. When false, all products are returned.
  *  @param {number} LocationId The location ID to use to determine the tax for the products that this request returns.
  *//*eslint-enable */
  getProducts(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_SALE + "/products?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Optional:
  *  @param {number} SaleId Filters results to the requested sale ID.
  *  @param {string} StartSaleDateTime Filters results to sales that happened after this date and time.
  *  @param {string} EndSaleDateTime Filters results to sales that happened before this date and time.
  *  @param {number} PaymentMethodId Filters results to sales paid for by the given payment method ID.
  *//*eslint-enable */
  getSales(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_SALE + "/sales?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Optional:
  *  @param {number[]} ProgramIds Filters to pricing options with the specified program IDs.
  *  @param {number[]} SessionTypeIds Filters to the pricing options with the specified session types IDs.
  *  @param {string[]} ServiceIds Filters to the pricing options with the specified IDs. In this context, service and pricing option are used interchangeably. These are the PurchasedItems[].Id returned from GET Sales.
  *  @param {number} ClassId Filters to the pricing options for the specified class ID.
  *  @param {number} ClassScheduleId Filters to the pricing options for the specified class schedule ID.
  *  @param {boolean} SellOnline When true, filters to the pricing options that are sellable online.
  *  @param {number} LocationId When specified, for each returned pricing option, TaxRate and TaxIncluded are calculated according to the specified location. Note that this does not filter results to only services provided at the given location, and for locations where Value-Added Tax (VAT) rules apply, the TaxRate is set to zero.
  *  @param {boolean} HideRelatedPrograms When true, indicates that pricing options of related programs are omitted from the response.
  *  @param {number} StaffId Sets Price and OnlinePrice to the particular pricing of a specific staff member, if allowed by the business.
  *//*eslint-enable */
  getServices(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_SALE + "/services?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /**@returns custom gender options*/
  getGenders() {
    var request = new MindbodyRequest(
      URL_SITE + "/genders",
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /**@returns Locations, e.g stores*/
  getLocations() {
    var request = new MindbodyRequest(
      URL_SITE + "/locations",
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param {number[]} MembershipIds The requested membership IDs.
  *//*eslint-enable */
  getMemberships(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_SITE + "/memberships?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Optional:
  *  @param {string} ScheduleType A schedule type used to filter the returned results.
  *  @param {boolean} OnlineOnly If true, filters results to show only those programs that are shown online. If false, all programs are returned.
  *//*eslint-enable */
  getPrograms(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_SITE + "/programs?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Optional:
  *  @param {number[]} SessionTypeIds List of session type IDs.
  *  @param {number} LocationId The location of the resource. This parameter is ignored if EndDateTime or LocationID is not set.
  *  @param {string} StartDateTime The time the resource starts. This parameter is ignored if EndDateTime or LocationID is not set.
  *  @param {string} EndDateTime The time the resource ends. This parameter is ignored if EndDateTime or LocationID is not set.
  *//*eslint-enable */
  getResources(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_SITE + "/resources?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Optional:
  *  @param {number[]} ProgramIds Filters results to session types that belong to one of the given program IDs. If omitted, all program IDs return.
  *  @param {boolean} OnlineOnly When true, indicates that only the session types that can be booked online should be returned.
  *//*eslint-enable */
  getSessionTypes(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_SITE + "/sessiontypes?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Optional:
  *  @param {number[]} SiteIds List of the requested site IDs. When omitted, returns all sites that the source has access to.
  *//*eslint-enable */
  getSites(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_SITE + "/sites?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param {number} SessionTypeId Return only staff members that are available for the specified session type. You must supply a valid StartDateTime and LocationID to use this parameter.
  * Optional:
  *  @param {string[]} Filters Filters to apply to the search.
  *  @param {number[]} StaffIds A list of the requested staff IDs.
  *  @param {string} StartDateTime Return only staff members that are available at the specified date and time. You must supply a valid SessionTypeID and LocationID to use this parameter.
  *  @param {number} LocationId Return only staff members that are available at the specified location. You must supply a valid SessionTypeID and StartDateTime to use this parameter.
  *//*eslint-enable */
  getStaff(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_STAFF + "/staff?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param {number} StaffId The ID of the staff member whose permissions you want to return.
  *//*eslint-enable */
  getStaffPermissions(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_STAFF + "/staffpermissions?" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  //pOST request to add a client via the Mindbody API
  postClient(parameters) {
    var request = new MindbodyRequest(
      URL_CLIENTS + "/addclient",
      APIKEY,
      SITEID,
      "POST",
      parameters,
    );
    return this.decorateAndMake(request);
  }

  //post request to remove a client from a class
  postRemoveClientFromClass(parameters) {
    var request = new MindbodyRequest(
      URL_CLASS + "/removeclientfromclass",
      APIKEY,
      SITEID,
      "POST",
      parameters,
    );
    return this.decorateAndMake(request);
  }

  //pOST request to add a client via the Mindbody API
  postAddClientToClass(parameters) {
    var request = new MindbodyRequest(
      URL_CLASS + "/addclienttoclass",
      APIKEY,
      SITEID,
      "POST",
      parameters,
    );
    return this.decorateAndMake(request);
  }

  //pOST purchase
  postCheckoutShoppingCart(parameters) {
    var request = new MindbodyRequest(
      URL_SALE + "/checkoutshoppingcart",
      APIKEY,
      SITEID,
      "POST",
      parameters,
    );
    return this.decorateAndMake(request);
  }

  //@TODO implement caching based on hashes of url's here
  decorateAndMake(request) {
    request.addAuth(this.authToken);
    this.requestNum++;
    let allPagePromises = [];

    let makeRequest = () => {
      return request.makeRequest();
    };
    //backoff function, backs off a preset amount
    const backoff = (retries, fn, delay = this.initialDelay) => {
      return fn().catch((err) => {
        if (this.atLimit()) {
          return Promise.reject(Error("Mindbody request limit reached"));
        }
        if (retries > 1) {
          setTimeout(backoff(retries - 1, fn, delay * this.backoffMultiplier), delay);
        } else {
          return Promise.reject(err);
        }
      });
    };

    if (!this.atLimit()) {
      //return request.makeRequest();
      return backoff(this.maxRetries, makeRequest)
        .then((value) => {
          //console.log(Object.keys(value));
          if (!value.PaginationResponse) {
            return Promise.resolve(value);
          }
          let totalResults = value.PaginationResponse.TotalResults;
          let requestedLimit = value.PaginationResponse.RequestedLimit;
          let resultsSeenSoFar = requestedLimit;
          let url = request.url;
          while (resultsSeenSoFar < totalResults) {
            this.requestNum++;
            if (this.atLimit()) {
              return Promise.reject(Error("Mindbody request limit reached"));
            }
            const resultsPerPage = 200;
            request.url = url + "&limit=" + resultsPerPage + "&offset=" + resultsSeenSoFar;
            console.log(" - in decorateAndMake, we wanted " + totalResults + " records, so we made this extra multi-page request: " + request.url);
            resultsSeenSoFar += resultsPerPage;
            allPagePromises.push(backoff(this.maxRetries, makeRequest));
          }
          return Promise.all(allPagePromises)
            .then((responses) => {
              responses.unshift(value);
              let data = {};
              for (let i = 0; i < responses.length; ++i) {
                for (const [key, value2] of Object.entries(responses[i])){
                  if (key !== "PaginationResponse") {
                    if (responses.length > 1) {
                      console.log("In a multipage response, page #" + i + " had " + value2.length + " results: ");
                      console.log(JSON.stringify(value2));
                    }
                    if (data[key]) {
                      data[key] = [...data[key], ...value2];
                    } else {
                      data[key] = value2;
                    }
                  }
                }
              }
              return Promise.resolve(data);
            });
        });
    }
    return Promise.reject(Error("Mindbody request limit reached"));
  }

  //may be changed later
  atLimit() {
    const MAX_QUERIES = 800;
    if (this.requestNum >= MAX_QUERIES) {
      return true;
    }
    return false;
  }

  loadConfig() {
    try {
      this.backoffMultiplier = appSettings.backoffMultiplier;
      this.maxRetries = appSettings.maxRetries;
      this.initialDelay = appSettings.initialDelay;
    } catch (err) {
      console.log("Error:", err);
    }
  }
}

const MindbodyAccess = new MindbodyQueries();
export default MindbodyAccess;

/*example code
import MindbodyAccess from "../../api-manager.js";
//...
MindbodyAccess.getAuth()
  .then(() => {
    return MindbodyAccess.getClients();
  })
  .then((clientsList)) {
    console.log(clientsList);
  }
  .catch((error) => {
    console.log("Error occurred in [name the context]: " + error.toString());
  });
  */



