{{#if @root.data.auth ~}}
CALL _removeSubscriptionParameter(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape @root.context.metaData.shortlistCampaignName}}},
  'Shortlist',
  'id',
  {{{mysqlEscape @root.request.params.query.id}}}
);
{{else}}
SET @query=false;
{{/if ~}}