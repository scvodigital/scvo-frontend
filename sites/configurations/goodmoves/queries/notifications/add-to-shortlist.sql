INSERT INTO subscriptionParameters (campaign, email, name, parameter, value) 
VALUES
('{{@root.context.metaData.shortlistCampaignName}}', '{{@root.data.auth.email}}', '{{@root.context.metaData.shortlistCampaignName}}', 'id', '{{@root.request.params.query.id}}');

