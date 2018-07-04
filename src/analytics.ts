/* tslint:disable:no-any */
import {endOfMonth, format, startOfMonth} from 'date-fns';
import * as gapis from 'googleapis';
import {google} from 'googleapis';
import * as jsforce from 'jsforce';

const analytics = google.analytics('v3');

export class AnalyticsProcessor {
  jwtClient: any|null = null;
  sfClient: jsforce.Connection = new jsforce.Connection({});

  constructor(
      private gaAuthDetails: GAAuthDetails,
      private sfAuthDetails: SFAuthDetails) {}

  async setup(): Promise<void> {
    await this.gaAuthenticate();
    await this.sfAuthenticate();
  }

  private async sfAuthenticate(): Promise<void> {
    this.sfClient =
        new jsforce.Connection({loginUrl: this.sfAuthDetails.loginUrl});
    const loginResponse = await this.sfClient.login(
        this.sfAuthDetails.username, this.sfAuthDetails.password);
    console.log(
        'Logged in to Salesforce -> id:', loginResponse.id,
        '| organisationId:', loginResponse.organizationId,
        '| loginUrl:', loginResponse.url);
  }

  private async gaAuthenticate(): Promise<void> {
    const scope = ['https://www.googleapis.com/auth/analytics.readonly'];
    this.jwtClient = new google.auth.JWT(
        this.gaAuthDetails.clientEmail, undefined,
        this.gaAuthDetails.privateKey, scope, undefined);
    const credentials = await this.jwtClient.authorize();

    this.jwtClient.setCredentials(credentials);
    google.options({auth: this.jwtClient});
  }

  /*
   * Temporary specific method for handling legacy goodmoves vacancy analytics
   */
  async getGMHitEvents(startDate: Date = new Date()): Promise<ViewCount[]> {
    const today = new Date();
    startDate = startOfMonth(startDate);
    let endDate = endOfMonth(startDate);
    endDate = endDate > today ? today : endDate;

    const startDateString = format(startDate, 'YYYY-MM-DD');
    const endDateString = format(endDate, 'YYYY-MM-DD');

    const params = {
      'ids': 'ga:89145164',
      'start-date': startDateString,
      'end-date': endDateString,
      'metrics': 'ga:totalEvents',
      'dimensions': 'ga:eventLabel',
      'filters': 'ga:eventCategory==vacancy',
    };

    const options = {auth: this.jwtClient};

    const viewCounts: ViewCountCollection = {};
    const hitType = 'Page View';
    const res = await analytics.data.ga.get(params, options);

    if (!res.data.rows) return [];

    res.data.rows.forEach((row) => {
      const eventString = row[0];
      const count = Number(row[1]);
      let id = eventString.split(' ')[0];
      id = this.fixSalesforceId(id);

      if (id) {
        const viewCount = new ViewCount(
            'Vacancy__c', id, startDate, 'Page View', 'goodmoves.org.uk');

        if (!viewCounts.hasOwnProperty(viewCount.name)) {
          viewCounts[id] = viewCount;
        }

        viewCounts[id].addHits(count);
      }
    });

    const viewCountArray = Object.keys(viewCounts).map((key) => {
      return viewCounts[key];
    });

    return viewCountArray;
  }

  async getContentVersions(contentVersions: {[id: string]: number}):
      Promise<ContentVersionMapping[]> {
    console.log('Getting ContentVersions:');
    const contentVersionIds = Object.keys(contentVersions);
    const map: ContentVersionMapping[] = [];
    while (contentVersionIds.length > 0) {
      const page = contentVersionIds.splice(0, 50);
      const contentVersionIdsIn = '(\'' + page.join('\', \'') + '\')';
      const contentVersionSoql =
          'SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id IN ' +
          contentVersionIdsIn;

      const contentVersionResponse =
          await this.sfClient.query(contentVersionSoql);

      const contentVersionRecords =
          (contentVersionResponse.records as ContentVersionRecord[]);

      contentVersionRecords.forEach((record) => {
        map.push({
          contentVersionId: record.Id,
          contentDocumentId: record.ContentDocumentId,
          hits: contentVersions[record.Id]
        });
      });
    }
    return map;
  }

  async getContentDocumentLinks(contentDocumentIds: string[]):
      Promise<ContentDocumentLinkRecord[]> {
    console.log('Getting ContentDocumentLinks');
    const allRecords: ContentDocumentLinkRecord[] = [];
    while (contentDocumentIds.length > 0) {
      const page = contentDocumentIds.splice(0, 50);
      const contentDocumentIdsIn = '(\'' + page.join('\', \'') + '\')';
      const contentDocumentLinkSoql =
          'SELECT ContentDocumentId, LinkedEntityId FROM ContentDocumentLink WHERE ContentDocumentId IN ' +
          contentDocumentIdsIn;
      const contentDocumentLinkResponse =
          await this.sfClient.query(contentDocumentLinkSoql);
      const contentDocumentLinkRecords =
          (contentDocumentLinkResponse.records as ContentDocumentLinkRecord[]);
      allRecords.push(...contentDocumentLinkRecords);
    }
    return allRecords;
  }

  /*
   * Temporary specific method for handling legacy goodmoves file download
   * analytics
   */
  async getGMDownloadEvents(startDate: Date = new Date()):
      Promise<ViewCount[]> {
    const today = new Date();
    startDate = startOfMonth(startDate);
    let endDate = endOfMonth(startDate);
    endDate = endDate > today ? today : endDate;

    const startDateString = format(startDate, 'YYYY-MM-DD');
    const endDateString = format(endDate, 'YYYY-MM-DD');

    const params = {
      'ids': 'ga:89145164',
      'start-date': startDateString,
      'end-date': endDateString,
      'metrics': 'ga:uniqueEvents',
      'dimensions': 'ga:eventLabel',
      'filters': 'ga:eventLabel=@/goodmoves-files/',
    };

    const options = {auth: this.jwtClient};

    const viewCounts: ViewCountCollection = {};
    const hitType = 'Page View';
    const res = await analytics.data.ga.get(params, options);

    if (!res.data.rows) return [];

    const contentVersions: {[id: string]: number} = {};
    res.data.rows.forEach((row) => {
      const url: string = row[0];
      const hits: number = Number(row[1]);
      let id = url.split('/goodmoves-files/')[1].split('-')[0];
      id = this.fixSalesforceId(id);

      if (id) {
        if (!contentVersions.hasOwnProperty(id)) {
          contentVersions[id] = 0;
        }

        contentVersions[id] += hits;
      }
    });

    const map = await this.getContentVersions(contentVersions);

    const contentDocumentIds = map.map((item) => {
      return item.contentDocumentId;
    });

    const contentDocumentLinkRecords =
        await this.getContentDocumentLinks(contentDocumentIds);

    contentDocumentLinkRecords.forEach((record) => {
      map.forEach((item) => {
        if (item.contentDocumentId === record.ContentDocumentId) {
          const viewCount = new ViewCount(
              'Goodmoves_Files__c', record.LinkedEntityId, startDate,
              'Download', 'goodmoves.org.uk');
          if (!viewCounts.hasOwnProperty(record.LinkedEntityId)) {
            viewCounts[record.LinkedEntityId] = viewCount;
          }
          viewCounts[record.LinkedEntityId].addHits(item.hits);
        }
      });
    });

    const viewCountArray = Object.keys(viewCounts).map((key) => {
      return viewCounts[key];
    });

    return viewCountArray;
  }

  private fixSalesforceId(id: string): string {
    if (!id.match(/[a-z]/ig)) {
      return '';
    }

    id = id.split(/([^a-z0-9])/ig)[0];
    return id;
  }

  updateSalesforce(viewCounts: ViewCount[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const records: SObjectViewCount[] =
          viewCounts.map((viewCount: ViewCount) => {
            return viewCount.sObject;
          });
      // console.log(records);
      const bulkOptions = {
        extIdField: 'Name__c',
        concurrencyMode: ('Parallel' as 'Parallel' | 'Serial')
      };

      const job =
          this.sfClient.bulk.createJob('View_Count__c', 'upsert', bulkOptions);
      const batch = job.createBatch();

      batch.execute(records);
      batch.on('error', (batchInfo) => {
        console.error('Batch Error:', batchInfo);
      });
      batch.on('queue', (batchInfo) => {
        batch.poll(1000, 20000);
        console.log('Batch Queue:', batchInfo);
      });
      batch.on('response', (rets) => {
        const errors: any[] = [];
        const successes: any[] = [];
        rets.forEach((ret: any) => {
          if (!ret.success) {
            errors.push(ret);
          } else {
            successes.push(ret);
          }
        });
        console.log(
            'Batch completed.', successes.length, 'succeeded, and',
            errors.length, 'failed.');
        if (errors.length > 0) {
          console.error('Failed upserts:', errors);
        }
        resolve({successes, errors});
      });
    });
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export class ViewCountCollection { [name: string]: ViewCount; }

export class ViewCount {
  constructor(
      private entityType: string,
      private entityId: string,
      private month: Date,
      private hitType: string,
      private source: string,
      private hits = 0,
  ) {}

  get name(): string {
    return this.entityId + '-' + format(this.month, 'YYYY-MM-DD') + '-' +
        this.hitType;
  }

  get sObject(): SObjectViewCount {
    const sObject: SObjectViewCount = {
      Name: this.name,
      Name__c: this.name,
      Hits__c: this.hits,
      Month__c: format(this.month, 'YYYY-MM-DD'),
      Hit_Type__c: this.hitType,
      Source__c: this.source
    };
    sObject[this.entityType] = this.entityId;
    return sObject;
  }

  addHits(hits: number) {
    this.hits += hits;
  }
}

/* tslint:disable */
export interface SObjectViewCount {
  Name: string;
  Name__c: string;
  Hits__c: number;
  Month__c: string;
  Hit_Type__c: string;
  Source__c: string;
  [EntityId: string]: string|Date|number;
}
/* tslint:enable */

export interface GAAuthDetails {
  clientEmail: string;
  privateKey: string;
}

export interface SFAuthDetails {
  username: string;
  password: string;
  loginUrl: string;
}

export interface ContentVersionRecord {
  Id: string;
  ContentDocumentId: string;
}

export interface ContentDocumentLinkRecord {
  ContentDocumentId: string;
  LinkedEntityId: string;
}

export interface ContentVersionMapping {
  contentVersionId: string;
  contentDocumentId: string;
  relatedEntityId?: string;
  hits: number;
}
/* tslint:enable:no-any */
