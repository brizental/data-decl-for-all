import React, { useState, useEffect } from 'react'
import { Accordion, List, Icon, Header, Grid, Button, Divider } from 'semantic-ui-react'

function Metrics({ metrics, setMetrics, setEditingMetric }) {
  const [activeIndex, setActiveindex] = useState(-1);
  const handleClick = (index) => {
    const newIndex = activeIndex === index ? -1 : index;
    setActiveindex(newIndex);
  }

  const generateMetricsYAML = () => {
    let yaml = `
---
$schema: moz://mozilla.org/schemas/glean/metrics/2-0-0
`;
    const sortedMetrics = metrics.sort((a, b) => a.category.localeCompare(b.category));

    let previousCategory = undefined;
    for (const metric of sortedMetrics) {
        if (previousCategory !== metric.category) {
            yaml += `\n\n${metric.category}:`
        }
        previousCategory = metric.category;

        yaml += `
    ${metric.name}:
        type: ${metric.type}
        lifetime: ${metric.lifetime}
        send_in_pings:
            ${metric.sendInPings.map(ping => (
                `- ${ping}`
            )).join("\n                ").trim()}
        description: |
            ${metric.description}
        bugs:
            ${metric.bugs.map(bug => (
                `- ${bug}`
            )).join("\n            ").trim()}
        data_reviews:
            ${metric.dataReviews.map(dataReview => (
                `- ${dataReview}`
            )).join("\n                ").trim()}
        data_sensitivity:
            ${metric.dataSensitivity.map(dataSensitivity => (
                `- ${dataSensitivity}`
            )).join("\n            ").trim()}
        notification_emails:
            ${metric.notificationEmails.map(notificaitonEmail => (
                `- ${notificaitonEmail}`
            )).join("\n            ").trim()}
        expires: ${metric.expires}`

        if (metric.extraKeys.length > 0) {
            yaml += `
        extra_keys:
            ${metric.extraKeys.map(({ name, description, type}) => (
                `${name}:
                description: |
                    ${description}
                type: ${type}`
            )).join("\n            ").trim()}
        `
        }

    }

    return yaml;
  }

  const downloadAsYAML = () => {
    const blob = new Blob([generateMetricsYAML()], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "metrics.yaml";

    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(event);

    URL.revokeObjectURL(url);
  }

  const removeMetric = (index) => {
    const metricsClone = [...metrics];
    metricsClone.splice(index, 1)
    setMetrics(metricsClone);
  }

  const duplicateMetric = (index) => {
    setEditingMetric({ ...metrics[index] });
  }

  const editMetric = (index) => {
    duplicateMetric(index);
    removeMetric(index);
  }

  useEffect(() => {
    setActiveindex(-1);
  }, [metrics]);

  return (
    <>
        <Grid.Row>
            <Header as="h1">
                Metrics
            </Header>
            <Button onClick={downloadAsYAML}>
                Download as YAML
            </Button>
            <Button onClick={() => setMetrics([])}>
                Clear all
            </Button>
        </Grid.Row>
        <Grid.Row>
            <Accordion style={{ marginTop: 30 }}>
                {metrics.map((metric, index) => (
                    <div key={`${metric.name}-${index}`}>
                        <Accordion.Title
                            active={activeIndex === index}
                            onClick={() => handleClick(index)}
                        >
                            <Icon name='dropdown' />
                            <span style={{marginRight: 10}}>{metric.category}.{metric.name}</span>
                            <Button type="button" onClick={(e) => { e.stopPropagation(); editMetric(index) }} size="mini" color="blue" icon="edit" />
                            <Button type="button" onClick={(e) => { e.stopPropagation(); duplicateMetric(index) }} size="mini" color="green" icon="plus" />
                            <Button type="button" onClick={(e) => { e.stopPropagation(); removeMetric(index) }} size="mini" color="red" icon="trash" />
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === index}>
                            <List>
                                <List.Item>
                                    <List.Content>
                                        <List.Header>Type</List.Header>
                                        <List.Description>
                                            {metric.type}
                                        </List.Description>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Content>
                                        <List.Header>Lifetime</List.Header>
                                        <List.Description>
                                            {metric.lifetime}
                                        </List.Description>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Header>Send in pings</List.Header>
                                    <List>
                                        {metric.sendInPings.map(ping => (
                                            <List.Item key={ping}>{ping}</List.Item>
                                        ))}
                                    </List>
                                </List.Item>
                                <List.Item>
                                    <List.Content>
                                        <List.Header>Description</List.Header>
                                        <List.Description>
                                            {metric.description}
                                        </List.Description>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Header>Bugs</List.Header>
                                    <List>
                                        {metric.bugs.map(bug => (
                                            <List.Item key={bug}>{bug}</List.Item>
                                        ))}
                                    </List>
                                </List.Item>
                                <List.Item>
                                    <List.Header>Data Reviews</List.Header>
                                    <List>
                                        {metric.dataReviews.map(review => (
                                            <List.Item key={review}>{review}</List.Item>
                                        ))}
                                    </List>
                                </List.Item>
                                <List.Item>
                                    <List.Header>Data Sensitivity</List.Header>
                                    <List>
                                        {metric.dataSensitivity.map(sensitivity => (
                                            <List.Item key={sensitivity}>{sensitivity}</List.Item>
                                        ))}
                                    </List>
                                </List.Item>
                                <List.Item>
                                    <List.Header>Notification Emails</List.Header>
                                    <List>
                                        {metric.notificationEmails.map(email => (
                                            <List.Item key={email}>{email}</List.Item>
                                        ))}
                                    </List>
                                </List.Item>
                                <List.Item>
                                    <List.Content>
                                        <List.Header>Expires</List.Header>
                                        <List.Description>
                                            {metric.expires}
                                        </List.Description>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Header>Extra Keys</List.Header>
                                    <List>
                                        {metric.extraKeys.map(({ name, description, type }) => (
                                            <List.Item key={name}>
                                                <List.Header>{name}</List.Header>
                                                <List>
                                                    <List.Item>
                                                        <List.Header>Description</List.Header>
                                                        <List.Description>{description}</List.Description>
                                                    </List.Item>
                                                    <List.Item>
                                                        <List.Header>Type</List.Header>
                                                        <List.Description>{type}</List.Description>
                                                    </List.Item>
                                                </List>
                                            </List.Item>
                                        ))}
                                    </List>
                                </List.Item>
                            </List>
                            <Divider horizontal />
                        </Accordion.Content>
                    </div>
                    ))
                }
            </Accordion>
        </Grid.Row>
    </>
  );
}

export default Metrics;
