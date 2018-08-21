{{#if @root.data.auth ~}}
UPDATE subscriptionPartitions
SET active = 0
WHERE
  campaign IN ({{{mysqlEscape @root.context.metaData.emailCampaignName}}}, {{{mysqlEscape @root.context.metaData.shortlistCampaignName}}}) AND
  email = {{{mysqlEscape @root.data.auth.email}}};
{{else}}
SET @query=false;
{{/if ~}}
