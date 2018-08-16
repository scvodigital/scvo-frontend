CALL _removeSubscriptionPartition(
  '{{@root.data.auth.email}}',
  '{{@root.context.metaData.emailCampaignName}}',
  '{{{@root.request.body.name}}}'
);
