import React, { useState, useEffect } from 'react'
import { Accordion, List, Icon, Header, Grid, Button, Table } from 'semantic-ui-react'

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
                            <Table celled>
                                <Table.Row>
                                    <Table.Cell>Category</Table.Cell>
                                    <Table.Cell>{metric.category}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Name</Table.Cell>
                                    <Table.Cell>{metric.name}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Type</Table.Cell>
                                    <Table.Cell>{metric.type}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                        <Table.Cell>Lifetime</Table.Cell>
                                        <Table.Cell>{metric.lifetime}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Send in pings</Table.Cell>
                                    <Table.Cell>
                                        <List>
                                            {metric.sendInPings.map(ping => (
                                                <List.Item as='li' value='-' key={ping}>
                                                    {ping}
                                                </List.Item>
                                            ))}
                                        </List>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                        <Table.Cell>Description</Table.Cell>
                                        <Table.Cell>
                                            {metric.description}
                                        </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Bugs</Table.Cell>
                                    <Table.Cell>
                                        <List>
                                            {metric.bugs.map(bug => (
                                                <List.Item as='li' value='-' key={bug}>
                                                    {bug}
                                                </List.Item>
                                            ))}
                                        </List>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Data Reviews</Table.Cell>
                                    <Table.Cell>
                                        <List>
                                            {metric.dataReviews.map(review => (
                                                <List.Item as='li' value='-' key={review}>
                                                    {review}
                                                </List.Item>
                                            ))}
                                        </List>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Data Sensitivity</Table.Cell>
                                    <Table.Cell>
                                        <List>
                                            {metric.dataSensitivity.map(sensitivity => (
                                                <List.Item as='li' value='-' key={sensitivity}>
                                                    {sensitivity}
                                                </List.Item>
                                            ))}
                                        </List>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Notification Emails</Table.Cell>
                                    <Table.Cell>
                                        <List>
                                            {metric.notificationEmails.map(email => (
                                                <List.Item as='li' value='-' key={email}>
                                                    {email}
                                                </List.Item>
                                            ))}
                                        </List>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                        <Table.Cell>Expires</Table.Cell>
                                        <Table.Cell>
                                            {metric.expires}
                                        </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Extra Keys</Table.Cell>
                                    <Table.Cell>
                                        {metric.extraKeys.map(({ name, description, type }) => (
                                            <Table>
                                                <Table.Row>
                                                    <Table.Cell>Name</Table.Cell>
                                                    <Table.Cell>{name}</Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>Description</Table.Cell>
                                                    <Table.Cell>{description}</Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>Type</Table.Cell>
                                                    <Table.Cell>{type}</Table.Cell>
                                                </Table.Row>
                                            </Table>
                                        ))}
                                    </Table.Cell>
                                </Table.Row>
                            </Table>
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
