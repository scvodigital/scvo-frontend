import { Injectable } from '@angular/core';

import { BreadcrumbService } from 'ng2-breadcrumb/ng2-breadcrumb';

import { DrupalService } from './drupal.service';

@Injectable()
export class AppService {
    private settings: Object = {};
    private navigation: Array<any> = [];
    private categories: Object = {};
    private tags: Object = {};

    constructor(private _drupalService: DrupalService, private breadcrumbService: BreadcrumbService) {}

    setGlobals() {
        this.setSettings();
        this.setNavigation();
        this.setCategories();
        this.setTags();
    }

    setSettings() {
        this.settings['cmsAddress'] = 'https://cms.scvo.org.uk/';
        //
        // // Get authentication status
        // this._drupalService.request(this.settings['cmsAddress']+'auth').subscribe(auth => {
        //     console.log(auth);
        // });
    }
    getSettings() {
        return this.settings;
    }

    setNavigation() {
        this.navigation = [
            {
                'title': 'Home',
                'path': '/'
            },
            {
                'title': 'Running your organisation',
                'path': '/running-your-organisation',
                'contents': [
                    {
                        'title': 'Finance',
                        'path': '/running-your-organisation/finance',
                        'term_id': 13
                    },
                    {
                        'title': 'Managing your organisation',
                        'path': '/running-your-organisation/managing-your-organisation',
                        'term_id': 14
                    },
                    {
                        'title': 'Governance',
                        'path': '/running-your-organisation/governance',
                        'term_id': 15
                    },
                    {
                        'title': 'Funding',
                        'path': '/running-your-organisation/funding',
                        'term_id': 16
                    },
                    {
                        'title': 'Legislation & regulation',
                        'path': '/running-your-organisation/legislation-regulation',
                        'term_id': 17
                    },
                ]
            },
            {
                'title': 'Employability',
                'path': '/employability',
                'contents': [
                    {
                        'title': 'Community Jobs Scotland',
                        'path': '/employability/community-jobs-scotland',
                        'term_id': 19
                    },
                    {
                        'title': 'Disability equality internships',
                        'path': '/employability/disability-equality-internships',
                        'term_id': 20
                    },
                    {
                        'title': 'Past employability schemes',
                        'path': '/employability/past-employability-schemes',
                        'term_id': 21
                    }
                ]
            },
            {
                'title': 'Services',
                'path': '/services',
                'term_id': 43,
                'contents': [
                    {
                        'title': 'SCVO membership',
                        'path': '/services/scvo-membership'
                    },
                    {
                        'title': 'Good HQ',
                        'path': '/services/good-hq'
                    },
                    {
                        'title': 'Office space',
                        'path': '/services/office-space'
                    },
                    {
                        'title': 'Credit Union',
                        'path': '/services/credit-union'
                    },
                    {
                        'title': 'Third Force News',
                        'path': '/services/third-force-news'
                    },
                    {
                        'title': 'Goodmoves',
                        'path': '/services/goodmoves'
                    },
                    {
                        'title': 'Funding Scotland',
                        'path': '/services/funding-scotland'
                    },
                    {
                        'title': 'Payroll',
                        'path': '/services/payroll'
                    },
                    {
                        'title': 'Digital participation',
                        'path': '/services/digital-participation'
                    },
                    {
                        'title': 'Scottish Accessible Information Forum',
                        'path': '/services/scottish-accessible-information-forum'
                    },
                    {
                        'title': 'Professional networks',
                        'path': '/services/professional-networks'
                    },
                    // {
                    //     'title': 'Affiliate deals',
                    //     'path': '/services/affiliate-deals'
                    // }
                ]
            },
            {
                'title': 'Events & training',
                'path': '/events',
                'contents': [
                    {
                        'title': 'Scottish Charity Awards',
                        'path': '/events/scottish-charity-awards'
                    },
                    {
                        'title': 'The Gathering',
                        'path': '/events/the-gathering'
                    },
                    {
                        'title': 'Training courses',
                        'path': '/training/search'
                    }
                ]
            },
            {
                'title': 'Policy',
                'path': '/policy',
                'contents': [
                    {
                        'title': 'Blogs',
                        'path': '/policy/blogs',
                        'term_id': 38
                    },
                    {
                        'title': 'Consultation responses',
                        'path': '/policy/consultation-responses',
                        'term_id': 39
                    },
                    {
                        'title': 'Briefings & reports',
                        'path': '/policy/briefings-reports',
                        'term_id': 41
                    },
                    {
                        'title': 'Policy committee',
                        'path': '/policy/policy-committee',
                        'term_id': 42
                    }
                ]
            },
            {
                'title': 'About',
                'path': '/about-us',
                'term_id': 50,
                'position': 'right'
            },
            {
                'title': 'Contact',
                'path': '/contact-us',
                'position': 'right'
            },
            {
                'title': 'Media',
                'path': '/media-centre',
                'position': 'right'
            },
            {
                'title': 'Join',
                'path': '/join-scvo',
                'position': 'right'
            }
        ];

        // Set breadcrumb titles
        for (var level1 in this.navigation) {
            this.breadcrumbService.addFriendlyNameForRoute(this.navigation[level1].path, this.navigation[level1].title);
            for (var level2 in this.navigation[level1].contents) {
                this.breadcrumbService.addFriendlyNameForRoute(this.navigation[level1].contents[level2].path, this.navigation[level1].contents[level2].title);
                // for (var level3 in this.navigation[level1].contents[level2]) {
                //     // breadcrumbService.addFriendlyNameForRoute(this.navigation[level1].contents[level2].contents[level3].path, this.navigation[level1].contents[level2].contents[level3].title);
                // }
            }
        }
    }
    getNavigation() {
        return this.navigation;
    }

    setCategories() {
        // Get categories from Drupal
        this._drupalService.request(this.settings['cmsAddress']+'all-categories').subscribe(categories => {
            for (var key in categories) {
                var tid = categories[key].tid[0].value;
                var name = categories[key].name[0].value;
                this.categories[tid] = name;
            }
        });
    }
    getCategories() {
        return this.categories;
    }

    setTags() {
        // Get tags from Drupal
        this._drupalService.request(this.settings['cmsAddress']+'all-tags').subscribe(tags => {
            for (var key in tags) {
                var tid = tags[key].tid[0].value;
                var name = tags[key].name[0].value;
                this.tags[tid] = name;
            }
        });
    }
    getTags() {
        return this.tags;
    }
}
