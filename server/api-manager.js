/*eslint-disable comma-spacing */
/*eslint-disable no-console*/

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
  *  @param ClientId
  *  @param Email
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
  *  @param ClassScheduleIds
  *  @param StartDate
  *  @param EndDate
  *  @param LocationIds
  *  @param ProgramIds
  *  @param SessionTypeIds
  *  @param StaffIds
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
  *  @param LocationId  
  * Optional:
  *  @param ContractIds 
  *  @param SoldOnline 
  *  @param ConsumerId 
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
  *  @param barcodeId  
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
  *  @param Ids  
  *  @param LocationId  
  *  @param SoldOnline  
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
  *  @param SellOnline  
  *  @param PackageIds  
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
  *  @param ProductIds   
  *  @param SearchText     
  *  @param CategoryIds      
  *  @param SubCategoryIds      
  *  @param SellOnline 
  *  @param LocationId    
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
  *  @param SaleId    
  *  @param StartSaleDateTime      
  *  @param EndSaleDateTime       
  *  @param PaymentMethodId        
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
  *  @param ProgramIds    
  *  @param SessionTypeIds      
  *  @param ServiceIds       
  *  @param ClassId        
  *  @param ClassScheduleId        
  *  @param SellOnline        
  *  @param LocationId        
  *  @param HideRelatedPrograms        
  *  @param StaffId        
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
  *  @param MembershipIds     
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
  *  @param ScheduleType
  *  @param OnlineOnly
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
  *  @param SessionTypeIds
  *  @param LocationId
  *  @param StartDateTime 
  *  @param EndDateTime 
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
  *  @param ProgramIds
  *  @param OnlineOnly
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
  *  @param SiteIds 
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
  *  @param SessionTypeId 
  * Optional:
  *  @param Filters  
  *  @param StaffIds  
  *  @param StartDateTime   
  *  @param LocationId  
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
  *  @param StaffId 
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



  //@TODO implement caching based on hashes of url's here
  decorateAndMake(request) {
    request.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return request.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }


  //may be changed later
  atLimit() {
    const MAX_QUERIES = 800;
    if (this.requestNum >= MAX_QUERIES) {
      return true;
    }
    return false;
  }
}

const MindbodyAccess = new MindbodyQueries();
export default MindbodyAccess;

/*example code
var client = new mindbodyQueries();
client.getAuth()
  .getClients()
  .then((value) => {
    console.log(value);
  })
  .catch((m) => {
    console.log(m);
  });
  */



