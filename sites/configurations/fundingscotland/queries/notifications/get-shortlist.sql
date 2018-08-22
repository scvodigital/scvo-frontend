{{#if @root.data.auth ~}}
CALL _getSubscriptionParameters(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape @root.context.metaData.shortlistCampaignName}}},
  'Shortlist'
);
{{else}}
SET @query=false;
{{/if ~}}