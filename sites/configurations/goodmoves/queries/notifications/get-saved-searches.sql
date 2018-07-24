SELECT
	s.*,
	GROUP_CONCAT(p.`parameter`, '=', p.value ORDER BY p.`parameter`ASC, p.`value` ASC SEPARATOR '&') AS 'querystring'
FROM subscriptions s
	JOIN subscriptionParameters p ON 
		s.campaign = p.campaign AND
		s.email = p.email AND
		s.name = p.name
WHERE 
  s.email = '{{data.auth.email}}' AND
  s.campaign = '{{context.metaData.emailCampaignName}}' AND
  p.`parameter` <> 'stopper'
GROUP BY p.campaign, p.email, p.name
