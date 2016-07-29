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
                        "title": "Running your organisation",
                        "link": "/running-your-organisation"
                    },
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
                        "link": "/running-your-organisation/legislation-and-regulation"
                    },
                ]
            },
            {
                "title": "Employability",
                "link": "/employability",
                "contents": [
                    {
                        "title": "Employability",
                        "link": "/employability"
                    },
                    {
                        "title": "Community Jobs Scotland",
                        "link": "/employability/cjs"
                    },
                    {
                        "title": "Disability equality internships",
                        "link": "/employability/internships"
                    },
                    {
                        "title": "Past employability schemes",
                        "link": "/employability/past-schemes"
                    }
                ]
            },
            {
                "title": "Products & services",
                "link": "/products-and-services",
                "contents": [
                    {
                        "title": "Products & services",
                        "link": "/products-and-services"
                    },
                    {
                        "title": "SCVO membership",
                        "link": "/products-and-services/membership"
                    },
                    {
                        "title": "Good HQ",
                        "link": "/products-and-services/goodhq"
                    },
                    {
                        "title": "Office space",
                        "link": "/products-and-services/office-space"
                    },
                    {
                        "title": "Credit Union",
                        "link": "/products-and-services/credit-union"
                    },
                    {
                        "title": "Third Force News",
                        "link": "/products-and-services/tfn"
                    },
                    {
                        "title": "Goodmoves",
                        "link": "/products-and-services/goodmoves"
                    },
                    {
                        "title": "Funding Scotland",
                        "link": "/products-and-services/funding-scotland"
                    },
                    {
                        "title": "Payroll",
                        "link": "/products-and-services/payroll"
                    },
                    {
                        "title": "Digital participation",
                        "link": "/products-and-services/digital-participation"
                    },
                    {
                        "title": "Scottish Accessible Information Forum",
                        "link": "/products-and-services/saif"
                    },
                    {
                        "title": "Professional networks",
                        "link": "/products-and-services/professional-networks"
                    },
                    {
                        "title": "Affiliate deals",
                        "link": "/products-and-services/affiliate-deals"
                    }
                ]
            },
            {
                "title": "Events & training",
                "link": "/events-and-training",
                "contents": [
                    {
                        "title": "Events & training",
                        "link": "/events-and-training"
                    },
                    {
                        "title": "Scottish Charity Awards",
                        "link": "/events-and-training/scottish-charity-awards"
                    },
                    {
                        "title": "The Gathering",
                        "link": "/events-and-training/the-gathering"
                    },
                    {
                        "title": "Training courses",
                        "link": "/events-and-training/training-courses"
                    }
                ]
            },
            {
                "title": "Policy hub",
                "link": "/policy-hub",
                "contents": [
                    {
                        "title": "Policy hub",
                        "link": "/policy-hub"
                    },
                    {
                        "title": "Research",
                        "link": "/policy-hub/research"
                    },
                    {
                        "title": "Briefings & reports",
                        "link": "/policy-hub/briefings-and-reports"
                    },
                    {
                        "title": "Consultation responses",
                        "link": "/policy-hub/consultation-responses"
                    },
                    {
                        "title": "Blogs",
                        "link": "/policy-hub/blogs"
                    },
                    {
                        "title": "Campaigns",
                        "link": "/policy-hub/campaigns"
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
