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
const URL_SALE = BASE + "sale";
const URL_STAFF = BASE + "staff";
const URL_ENROLLMENT = BASE + "enrollment";
const URL_APPOINTMENT = BASE + "appointment";
const APIKEY = "76af57a017f64fcd9fc16cc5032404a0";
const SITEID = "-99";

import MindbodyRequest from "./requests.js";
import QueryString from "query-string";
export default class MindbodyQueries {
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

  /**@returns Activation code. Requires mindbody to approve you for live customer data */
  getActivationCode() {
    var request = new MindbodyRequest(
      URL_SITE + "activationcode",
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
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
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clients" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
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
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_APPOINTMENT + "/activesessiontimes" + query,
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
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_APPOINTMENT + "/bookableitems" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
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
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_APPOINTMENT + "/scheduleitems" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
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
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_APPOINTMENT + "/staffappointments" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
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
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLASS + "/classes" + query,
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
  *  @param ClassDescriptionIds
  *  @param ProgramIds
  *  @param StartClassDateTime
  *  @param EndClassDateTime
  *  @param StaffId
  *  @param LocationId
  *//*eslint-enable */
  getClassDescriptions(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLASS + "/classdescriptions" + query,
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
  *  @param EndDate
  *  @param StartDate
  *  @param LocationIds
  *  @param ProgramIds
  *  @param SessionTypeIds
  *  @param StaffIds
  *//*eslint-enable */
  getClassSchedules(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLASS + "/classschedules" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param ClassID
  *  @param LastModifiedDate
  *//*eslint-enable */
  getClassVisits(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLASS + "/classvisits" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
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
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLASS + "/waitlistentries" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
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
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/activeclientmemberships" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
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
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientaccountbalances" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
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
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/contactlogs" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
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
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientcontracts" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param ClientId
  *//*eslint-enable */
  getClientDirectDebitInfo(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientdirectdebitinfo" + query,
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
  *  @param FirstName
  *  @param LastName
  *  @param Email
  *//*eslint-enable */
  getClientDuplicates(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientduplicates" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param ClientId
  *  @param AppointmentId
  *//*eslint-enable */
  getClientFormulaNotes(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientformulanotes" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param RequiredOnly
  *//*eslint-enable */
  getClientIndexes(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientindexes" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
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
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientpurchases" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
  }

  /* eslint-disable *//**
  * Required:
  *  @param IncludeInactive
  *//*eslint-enable */
  getClientReferralTypes(parameters) {
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientreferraltypes" + query,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    return this.decorateAndMake(request);
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
    var query = QueryString.stringify(parameters);
    var request = new MindbodyRequest(
      URL_CLIENTS + "/clientservices" + query,
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
      URL_CLIENTS + "/clientvisits" + query,
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
      URL_CLIENTS + "/crossregionalclientassociations" + query,
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
      URL_CLIENTS + "/customclientfields" + query,
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
      URL_CLIENTS + "/requiredclientfields" + query,
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
      URL_ENROLLMENT + "/enrollments" + query,
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
      URL_SALE + "acceptedcardtypes",
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
      URL_SALE + "contracts" + query,
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
      URL_SALE + "custompaymentmethods",
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
      URL_SALE + "giftcardbalance" + query,
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
      URL_SALE + "giftcards" + query,
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
      URL_SALE + "packages" + query,
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
      URL_SALE + "products" + query,
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
      URL_SALE + "sales" + query,
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
      URL_SALE + "services" + query,
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
      URL_SITE + "genders",
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
      URL_SITE + "locations",
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
      URL_SITE + "memberships" + query,
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
      URL_SITE + "programs" + query,
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
      URL_SITE + "resources" + query,
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
      URL_SITE + "sessiontypes" + query,
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
      URL_SITE + "sites" + query,
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
      URL_STAFF + "staff" + query,
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
      URL_STAFF + "staffpermissions" + query,
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



