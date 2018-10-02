{{#if @root.data.auth ~}}
CALL _removeSubscriptionPartition(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape @root.context.metaData.emailCampaignName}}},
  NULL
);
{{else}}
SET @query=false;
{{/if ~}}