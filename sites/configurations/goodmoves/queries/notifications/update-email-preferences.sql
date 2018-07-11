UPDATE subscriptions
SET days = '{{#if @root.request.body.sunday}}1{{/if}}{{#if @root.request.body.monday}}2{{/if}}{{#if @root.request.body.tuesday}}3{{/if}}{{#if @root.request.body.wednesday}}4{{/if}}{{#if @root.request.body.thursday}}5{{/if}}{{#if @root.request.body.friday}}6{{/if}}{{#if @root.request.body.saturday}}7{{/if}}'
WHERE 
  email = '{{data.auth.email}}' AND 
  campaign = '{{context.metaData.emailCampaignName}}'
