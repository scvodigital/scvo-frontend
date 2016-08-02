import { Component, Input } from '@angular/core';
import { Control } from '@angular/common';

import { ROUTER_DIRECTIVES } from '@angular/router';

import { MaterializeDirective } from "angular2-materialize";

@Component({
    selector: '[menu-items]',
    templateUrl: 'app/components/shared/header/menu-items.component.html',
    directives: [ROUTER_DIRECTIVES, MaterializeDirective],
})
export class MenuItemsComponent {
    @Input('menu-items') menuType: string = '';
    public navigationMenu: Object;

    constructor() {
        this.navigationMenu = [
            {
                "title": "Home",
                "link": "/"
            },
            {
                "title": "Running your organisation",
                "link": "/running-your-organisation",
                "contents": [
                    {
                        "title": "Finance",
                        "link": "/running-your-organisation/finance"
                    },
                    {
                        "title": "Business management",
                        "link": "/running-your-organisation/business-management"
                    },
                    {
                        "title": "Governance",
                        "link": "/running-your-organisation/governance"
                    },
                    {
                        "title": "Funding",
                        "link": "/running-your-organisation/funding"
                    },
                    {
                        "title": "Legislation & regulation",
                        "link": "/running-your-organisation/legislation-regulation"
                    },
                ]
            },
            {
                "title": "Employability",
                "link": "/employability",
                "contents": [
                    {
                        "title": "Community Jobs Scotland",
                        "link": "/employability/community-jobs-scotland"
                    },
                    {
                        "title": "Disability equality internships",
                        "link": "/employability/disability-equality-internships"
                    },
                    {
                        "title": "Past employability schemes",
                        "link": "/employability/past-employability-schemes"
                    }
                ]
            },
            {
                "title": "Services",
                "link": "/services",
                "contents": [
                    {
                        "title": "SCVO membership",
                        "link": "/services/membership"
                    },
                    {
                        "title": "Good HQ",
                        "link": "/services/goodhq"
                    },
                    {
                        "title": "Office space",
                        "link": "/services/office-space"
                    },
                    {
                        "title": "Credit Union",
                        "link": "/services/credit-union"
                    },
                    {
                        "title": "Third Force News",
                        "link": "/services/third-force-news"
                    },
                    {
                        "title": "Goodmoves",
                        "link": "/services/goodmoves"
                    },
                    {
                        "title": "Funding Scotland",
                        "link": "/services/funding-scotland"
                    },
                    {
                        "title": "Payroll",
                        "link": "/services/payroll"
                    },
                    {
                        "title": "Digital participation",
                        "link": "/services/digital-participation"
                    },
                    {
                        "title": "Scottish Accessible Information Forum",
                        "link": "/services/scottish-accessible-information-forum"
                    },
                    {
                        "title": "Professional networks",
                        "link": "/services/professional-networks"
                    },
                    // {
                    //     "title": "Affiliate deals",
                    //     "link": "/services/affiliate-deals"
                    // }
                ]
            },
            {
                "title": "Events & training",
                "link": "/events-and-training",
                "contents": [
                    {
                        "title": "Scottish Charity Awards",
                        "link": "/events/scottish-charity-awards"
                    },
                    {
                        "title": "The Gathering",
                        "link": "/events/the-gathering"
                    },
                    {
                        "title": "Training courses",
                        "link": "/training/search"
                    }
                ]
            },
            {
                "title": "Policy hub",
                "link": "/policy-hub",
                "contents": [
                    {
                        "title": "Blogs",
                        "link": "/policy-hub/blogs"
                    },
                    {
                        "title": "Consultation responses",
                        "link": "/policy-hub/consultation-responses"
                    },
                    {
                        "title": "Briefings & reports",
                        "link": "/policy-hub/briefings-and-reports"
                    },
                    {
                        "title": "Research",
                        "link": "/policy-hub/research"
                    },
                    {
                        "title": "Policy committee",
                        "link": "/policy-hub/policy-committee"
                    }
                ]
            }
        ]
    }
}
