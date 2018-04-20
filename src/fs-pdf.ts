/* tslint:disable */
import * as moment from 'moment';
import * as path from 'path';
const pdfPrinter: any = require('pdfmake');
import * as request from 'request';
import * as stream from 'stream';
import * as S from 'string';
import * as util from 'util';

function mp(relFontPath: any) {
  return path.resolve(__dirname, relFontPath)
}

const fonts = {
  Roboto: {
    normal: mp('../fonts/Roboto-Regular.ttf'),
    bold: mp('../fonts/Roboto-Medium.ttf'),
    italics: mp('../fonts/Roboto-Italic.ttf'),
    bolditalics: mp('../fonts/Roboto-MediumItalic.ttf')
  }
};

const printer = new pdfPrinter(fonts);

export function fsPdf(
    ids: string[], subdomain: string, title: string = 'Funding Scotland',
    subtitle: string | null = null): Promise<stream.PassThrough> {
  return new Promise<stream.PassThrough>((resolve, reject) => {
    getImage(subdomain)
        .then((image) => {
          getFunds(ids)
              .then((fund) => {
                generatePdf(image, fund, title, subtitle)
                    .then((s: any) => {
                      resolve(s);
                    })
                    .catch((err: any) => {
                      reject(err);
                    });
              })
              .catch((err) => {
                reject(err);
              });
        })
        .catch((err) => {
          reject(err);
        });
  });
}

function generatePdf(
    image: any, funds: any, title: string = 'Funding Scotland', subtitle: string | null = null) {
  return new Promise((resolve, reject) => {
    try {
      subtitle = subtitle ?
          'List: ' + subtitle :
          funds.length === 1 ? 'Fund: ' + funds[0].name :
                               'Multiple Funds (' + funds.length + ')';

      var front =
          [
            {
              height: 150,
              width: 150,
              fit: [150, 150],
              image: image,
              alignment: 'center',
              margin: [0, 15]
            },
            {
              text: title,
              fontSize: 26,
              bold: true,
              alignment: 'center',
              margin: [0, 15]
            },
            {
              text: subtitle,
              fontSize: 18,
              bold: true,
              alignment: 'center',
              pageBreak: 'after',
              margin: [0, 15]
            }
          ]

          var docDefinition = {
            pageSize: 'A4',
            pageMargins: [30, 120, 30, 200],
            header: (currentPage: any, pageCount: any) => {
              if (currentPage === 1) return [];
              return [
                {
                  columns: [
                    {
                      width: '*',
                      text: [
                        {text: title + '\n', fontSize: 20, bold: true},
                        {text: subtitle, fontSize: 16}
                      ]
                    },
                    {
                      width: 100,
                      height: 100,
                      fit: [65, 65],
                      image: image,
                      alignment: 'right'
                    }
                  ],
                  margin: [30, 30, 30, 5]
                },
                {
                  canvas: [{
                    type: 'line',
                    x1: -15,
                    y1: 5,
                    x2: 550,
                    y2: 5,
                    lineWidth: 1
                  }],
                  margin: [30, 5]
                },
              ];
            },
            footer: (currentPage: any, pageCount: any) => {
              if (currentPage === 1) return [];
              return [
                {
                  canvas: [{
                    type: 'line',
                    x1: -15,
                    y1: 5,
                    x2: 550,
                    y2: 5,
                    lineWidth: 1
                  }],
                  margin: [30, 5]
                },
                {
                  columns: [
                    {
                      width: 200,
                      text: [
                        {text: 'Contact Us\n', fontSize: 14, bold: true}, {
                          text: 'fundingscotland@scvo.org.uk\n',
                          link: 'mailto:fundingscotland@scvo.org.uk',
                          fontSize: 10
                        },
                        {
                          text: '0800 169 0022\n',
                          link: 'tel:08001690022',
                          fontSize: 10
                        },
                        {
                          text: '@fundingscotland',
                          link: 'https://twitter.com/fundingscotland',
                          fontSize: 10
                        }
                      ]
                    },
                    {
                      width: '*',
                      text: [
                        {text: 'About Us\n', fontSize: 14, bold: true}, {
                          text:
                              'Funding Scotland lists funders with a track record of supporting projects in Scotland. It includes grants, loans, prizes and other support. It is a valuable resource for charities, community groups, social enterprises and voluntary organisations of all shapes and sizes. It does not include funding opportunities for individuals or businesses.\n',
                          fontSize: 10
                        },
                        {
                          text:
                              'This website is owned and maintained by the Scottish Council for Voluntary Organisations the umbrella body for Scotland\'s third sector.\n',
                          fontSize: 10
                        }
                      ]
                    }
                  ],
                  margin: [30, 5]
                },
                {
                  text:
                      '© 2017 The Scottish Council for Voluntary Organisations (SCVO) is a Scottish Charitable Incorporated Organisation. Registration number SC003558.',
                  fontSize: 10,
                  margin: [30, 5]
                },
                {
                  columns: [
                    {
                      width: '*',
                      text: 'Page: ' + currentPage + ' of ' + pageCount,
                      fontSize: 10
                    },
                    {
                      width: '*',
                      text: 'Generated: ' + moment().format('LLL'),
                      fontSize: 10,
                      alignment: 'right'
                    }
                  ],
                  margin: [30, 5]
                }
              ];
            },
            content: [].concat.apply(front, funds.map(fundCode)),
            styles: {
              title: {fontSize: 20, bold: true},
              subtitle: {fontSize: 16},
              h1: {fontSize: 18, bold: true, margin: [0, 10, 0, 5]},
              h2: {fontSize: 16, bold: true, margin: [0, 10, 0, 5]},
              h3: {fontSize: 14, bold: true}
            }
          };

      var s = new stream.PassThrough();
      var pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(s);
      pdfDoc.end();

      var filenameParts = [
        S(title).slugify().s, S(subtitle).slugify().s,
        moment().format('YYYYMMDD-HHmmss')
      ];
      var filename = `${filenameParts.join('-')}.pdf`;

      resolve({s: s, filename: filename});
    } catch (err) {
      console.error('Failed to render PDF', err);
      reject(err);
    }
  });
}

function fundCode(fund: any) {
  return [
    {style: 'h1', text: fund.name}, {style: 'h2', text: 'Summary'},
    {text: fund.fundSummary}, {
      stack: [
        {style: 'h2', text: 'Fund Details'},
        {
          text: [
            {text: 'Status: ', bold: true},
            {text: fund.fundStatus || 'No status'}
          ]
        },
        {
          text: [
            {text: 'Type: ', bold: true},
            {text: fund.typeOfFunding || 'No type provided'}
          ]
        },
        {
          text: [
            {text: 'Source: ', bold: true},
            {text: fund.sourceofFunding || 'No source provided'}
          ]
        },
        {
          text: [
            {text: 'When to apply: ', bold: true},
            {text: fund.whenToApply || 'No application date'}
          ]
        },
        {
          text: [
            {text: 'Next deadline: ', bold: true},
            {text: fund.nextDeadline || 'No deadline date'}
          ]
        },
        {
          text: [
            {text: 'Charities only: ', bold: true},
            {text: fund.charitiesOnly ? 'Yes' : 'No'}
          ]
        },
        {
          text: [
            {text: 'Website: ', bold: true}, {
              text: fund.fundWeblink || 'No fund specific website',
              link: fund.fundWeblink ? uriFix(fund.fundWeblink) : null
            }
          ]
        },
        {
          text: [
            {text: 'Email: ', bold: true}, {
              text: fund.fundEmailAddress || 'No fund specific email',
              link: fund.fundEmailAddress ? 'mailto:' + fund.fundEmailAddress :
                                            null
            }
          ]
        },
        {
          text: [
            {text: 'Phone: ', bold: true}, {
              text: fund.fundTelephone || 'No fund specific phone number',
              link: fund.fundTelephone ? 'tel:' + fund.fundTelephone : null
            }
          ]
        },
        {
          text: [
            {text: 'How to apply: ', bold: true},
            {text: fund.howToApply || 'No application information provided'}
          ]
        },
        {
          text: [
            {text: 'Exclusions: ', bold: true},
            {text: fund.fundExclusion || 'No exclusions given'}
          ]
        },
        {style: 'h2', text: 'Funding Award Sizes'},
        {
          text: [
            {text: 'Minimum: ', bold: true}, {
              text: fund.minimumAwardSize ?
                  fund.minimumAwardSize.toLocaleString(
                      'en-GB',
                      {style: 'currency', currency: fund.currencyCode}) :
                  'No minimum provided'
            }
          ]
        },
        {
          text: [
            {text: 'Maximum: ', bold: true}, {
              text: fund.maximumAwardSize ?
                  fund.maximumAwardSize.toLocaleString(
                      'en-GB',
                      {style: 'currency', currency: fund.currencyCode}) :
                  'No maximum provided'
            }
          ]
        },
        {
          text: [
            {text: 'Average: ', bold: true}, {
              text: fund.averageAwardSize ?
                  fund.averageAwardSize.toLocaleString(
                      'en-GB',
                      {style: 'currency', currency: fund.currencyCode}) :
                  'No average award size provided'
            }
          ]
        },
        {
          text: [
            {text: 'Anuallly awarded: ', bold: true}, {
              text: fund.annualTotal ?
                  fund.annualTotal.toLocaleString(
                      'en-GB',
                      {style: 'currency', currency: fund.currencyCode}) :
                  'No annual total provided'
            }
          ]
        },
        {
          text: [
            {text: 'Notes on award amounts: ', bold: true},
            {text: fund.notesOnAwardAmounts || 'No notes on award amounts'}
          ]
        },

      ]
    },
    {
      stack: [
        {style: 'h2', text: 'Organisation Details'},
        {text: [{text: 'Name: ', bold: true}, {text: fund.organisationName}]},
        {
          text: [
            {text: 'Charity No: ', bold: true},
            {text: fund.funderCharityNo || 'No charity number'}
          ]
        },
        {
          text: [
            {text: 'Website: ', bold: true}, {
              text: uriFix(fund.funderWebsite) || 'No funder website',
              link: uriFix(fund.funderWebsite) || null
            }
          ]
        },
        {
          text: [
            {text: 'Telephone: ', bold: true}, {
              text: fund.funderTelephone || 'No funder phone number',
              link: fund.funderTelephone ? 'tel:' + fund.funderTelephone : null
            }
          ]
        },
        {
          text: [
            {text: 'Email: ', bold: true}, {
              text: fund.funderEmail || 'No funder email',
              link: fund.funderEmail ? 'mailto:' + fund.funderEmail : null

            }
          ]
        },
        {
          text: [
            {text: 'Address: ', bold: true},
            {text: fund.funderAddress || 'No funder address'}
          ]
        },
      ]
    },
    {
      columns: [
        {
          stack: [
            {style: 'h2', text: 'Geographical Areas'},
            {ul: fund.geographicalAreasFunded}
          ]
        },
        {stack: [{style: 'h2', text: 'Activities'}, {ul: fund.activities}]}, {
          stack: [
            {style: 'h2', text: 'Beneficiaries'}, {ul: fund.beneficiaries}
          ]
        }
      ]
    }
  ];
}

function uriFix(uri: any, defaultProtocol = 'https') {
  if (!uri) return null;
  if (uri.indexOf('http') === -1) {
    uri = defaultProtocol + '://' + uri;
  }
  return uri;
}

function getFunds(ids: any) {
  return new Promise((resolve, reject) => {
    var esIndex = 'web-content-production';
    var esType = 'funding-scotland-fund';
    var esHost = '2e6b5fd9344d4f8565e7d015d861b240.europe-west3.gcp.cloud.es.io';
    var esUser = 'readonly';
    var esPass = 'onlyread';
    var esProt = 'https';
    var query = `_search?q=Id:(${ids.join('+or+')})`;

    var url = `${esProt}://${esUser}:${esPass}@${esHost}/${esIndex}/${esType}/${
        query}`;

    var getOptions = {url: url, json: true};

    request.get(getOptions, (err, resp, body) => {
      if (err) return reject(err);
      if (!body.hits || body.hits.total === 0 || !body.hits.hits)
        return reject(body);
      var funds = body.hits.hits.map((hit: any) => {
        return hit._source;
      });
      resolve(funds);
    });
  });
}

function getImage(subdomain: any) {
  return new Promise((resolve, reject) => {
    var url = `http://fundingscotland.blob.core.windows.net/${subdomain}/logo`;

    request({url: url, encoding: null}, (err, res, body) => {
      if (err) return reject(err);
      var mime = res.headers['content-type'];
      var img = Buffer.from(body, 'base64');
      var b64 = img.toString('base64');

      var uri = `data:${mime};base64,${b64}`;

      resolve(uri);
    });
  });
}
/* tslint:enable */
