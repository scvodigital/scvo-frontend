INSERT INTO subscriptions (
  campaign, email, name, days
) VALUES (
  '{{@root.context.metaData.emailCampaignName}}', 
  '{{@root.data.auth.email}}', 
  '{{default @root.request.params.query.name "My Search"}}',
  IFNULL(
    (
      SELECT days 
      FROM (
        SELECT days 
        FROM subscriptions 
        WHERE 
          campaign = '{{@root.context.metaData.emailCampaignName}}' AND 
          email = '{{@root.data.auth.email}}' AND
          IFNULL(days, '') <> ''
        ORDER BY updatedAt DESC
        LIMIT 1
      ) AS daysInner
    ), 
    ''
  )
) 
ON DUPLICATE KEY UPDATE name = '{{default @root.request.params.query.name "My Search"}}';
