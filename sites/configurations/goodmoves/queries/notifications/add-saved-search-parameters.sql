{{#*inline "insertParam"}}
  {{#if (getProperty @root.request.params.query parameter)}}
    {{#each (arrayify (getProperty @root.request.params.query parameter))}}
      ('{{@root.context.metaData.emailCampaignName}}', '{{@root.data.auth.email}}', '{{default @root.request.body.name "My Search"}}', '{{../parameter}}', '{{this}}'),
    {{/each}}
  {{/if}}
{{/inline}}

INSERT INTO subscriptionParameters (campaign, email, name, parameter, value) VALUES
{{#each (split "keywords,roles,statuses,sectors,distance,location,lat,lng,salary_min,salary_max" ",")}}
  {{>insertParam parameter=this}}
{{/each}}
('{{@root.context.metaData.emailCampaignName}}', '{{@root.data.auth.email}}', '{{default @root.request.body.name "My Search"}}', 'stopper', 'stopper');
