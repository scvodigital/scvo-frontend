{{#if @root.data.auth ~}}
CALL _toggleSubscriptionActiveState(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape @root.context.metaData.emailCampaignName}}},
  {{{mysqlEscape @root.request.body.name}}}
);
{{else}}
SET @query=false;
{{/if ~}}