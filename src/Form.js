import React, { useState, useEffect } from 'react'
import { Header, Button, Divider, Grid, Form, Input } from 'semantic-ui-react'

function TheForm({ handleNewMetric, value = {} }) {
    useEffect(() => {
        resetState(value)
    }, [value])


    const [category, setCategory] = useState(value.category || "");
    const [name, setName] = useState(value.name || "");
    const [type, setType] = useState(value.type || "event");
    const [lifetime, setLifetime] = useState(value.lifetime || "ping");
    const [sendInPings, setSendInPings] = useState(value.sendInPings || ["main"]);
    const [description, setDescription] = useState(value.description || "");
    const [bugs, setBugs] = useState(value.bugs || ["https://mozilla-hub.atlassian.net/browse/VPN-XXXX"]);
    const [dataReviews, setDataReviews] = useState(value.dataReviews || ["TODO"]);
    const [dataSensitivity, setDataSensitivity] = useState(value.dataSensitivity || ["interaction"]);
    const [notificationEmails, setNotificationsEmails] = useState(value.notificationEmails || ["vpn-telemetry@mozilla.com"]);
    const [expires, setExpires] = useState(value.expires || "never");
    const [extraKeys, setExtraKeys] = useState(value.extraKeys || []);

    const changeElementOnStateArray = (newValue, index, state, setState) => {
        let stateClone = [...state];
        stateClone[index] = newValue;
        setState(stateClone);
    };

    const removeElementFromStateArray = (index, state, setState) => {
        const stateClone = [...state];
        stateClone.splice(index, 1)
        setState(stateClone);
    }

    const addElementToStateArray = (state, setState, value = "") => {
        setState([...state, value]);
    }

    const changeExtraKeyProp = (newValue, index, prop) => {
        const extraKeysClone = [...extraKeys];
        extraKeysClone[index][prop] = newValue;
        setExtraKeys(extraKeysClone);
    }

    const addEmptyExtraKey = () => {
        setExtraKeys([...extraKeys, {
            name: "",
            description: "",
            type: "string",
        }]);
    }

    const resetState = (value = {}) => {
        setCategory(value.category || "");
        setName(value.name || "");
        setType(value.type || "event");
        setLifetime(value.lifetime || "ping");
        setSendInPings(value.sendInPings || ["main"]);
        setDescription(value.description || "");
        setBugs(value.bugs || ["https://mozilla-hub.atlassian.net/browse/VPN-XXXX"]);
        setDataReviews(value.dataReviews || ["TODO"]);
        setDataSensitivity(value.dataSensitivity || ["interaction"]);
        setNotificationsEmails(value.notificationEmails || ["vpn-telemetry@mozilla.com"]);
        setExpires(value.expires || ["never"]);
        setExtraKeys(value.extraKeys || []);
    }

    const submitMetricAndClearForm = () => {
        handleNewMetric({
            category,
            name,
            type,
            lifetime,
            sendInPings,
            description,
            bugs,
            dataReviews,
            dataSensitivity,
            notificationEmails,
            expires,
            extraKeys
        });

        resetState();
    }

    const prefillInteraction = () => {
        setExtraKeys([{
            name: "screen",
            type: "string",
            description: "The screen where the interaction happened"
        }])
    }

    const prefillImpression = () => {
        setExtraKeys([{
            name: "screen",
            type: "string",
            description: "The screen the user has just moved to"
        }])
    }

    return (
        <Form onSubmit={submitMetricAndClearForm}>
            <Header as='h1'>
                Add new metric
            </Header>
            <Grid.Row style={{ marginTop: 20 }}>
                <Grid columns={3} >
                    <Grid.Column>
                        <Form.Field>
                            <label>Category</label>
                            <Input value={category} onChange={({target: { value }}) => setCategory(value)} />
                        </Form.Field>
                    </Grid.Column>
                    <Grid.Column>
                        <Form.Field>
                            <label>Name</label>
                            <Input value={name} onChange={({target: { value }}) => setName(value)} />
                        </Form.Field>
                    </Grid.Column>
                    <Grid.Column>
                        <Form.Field>
                        <label>Type</label>
                        <Input value={type} onChange={({target: { value }}) => setType(value)} />
                        </Form.Field>
                    </Grid.Column>
                </Grid>
            </Grid.Row>

            <Grid.Row style={{ marginTop: 20 }}>
                <Grid columns={3}>
                    <Grid.Column>
                        <Form.Field>
                            <label>Lifetime</label>
                            <Form.Select
                                value={lifetime}
                                options={[
                                    { text: 'ping', value: 'ping' },
                                    { text: 'application', value: 'application' },
                                    { text: 'user', value: 'user' },
                                ]}
                                onChange={({target: { value }}) => setLifetime(value)}
                            />
                            </Form.Field>
                        </Grid.Column>
                    <Grid.Column>
                        <Form.Field>
                            <label>Expires</label>
                            <Input value={expires} onChange={({ target: { value } }) => setExpires(value)} />
                            </Form.Field>
                        </Grid.Column>
                </Grid>
            </Grid.Row>

            <Grid.Row style={{ marginTop: 20 }}>
                <Form.Field>
                <label>Description</label>
                <textarea value={description} onChange={({ target: { value } }) => setDescription(value)} />
                </Form.Field>
            </Grid.Row>

            <Grid.Row style={{ marginTop: 20 }}>
                <Grid columns={2}>
                    <Grid.Column>
                        <Header as="h5">
                            Send in pings
                        </Header>
                        <Form.Field>
                        {sendInPings.map((ping, index) => (
                            <Grid.Row key={`ping-${index}`}>
                                <Input
                                    action={{
                                        icon: "trash",
                                        onClick: () => removeElementFromStateArray(index, sendInPings, setSendInPings)
                                    }}
                                    value={ping}
                                    onChange={({ target: { value: newValue }})=> changeElementOnStateArray(newValue, index, sendInPings, setSendInPings)}
                                />
                            </Grid.Row>
                            ))
                        }
                        <Button
                            style={{ marginTop: 20 }}
                            type="button"

                            onClick={() => addElementToStateArray(sendInPings, setSendInPings)}>
                            Add more pings
                        </Button>
                        </Form.Field>
                    </Grid.Column>
                    <Grid.Column>
                        <Form.Field>
                            <Header as="h5">
                                Data sensitivity
                            </Header>
                            {dataSensitivity.map((sensitivity, index) => (
                                <Grid.Row style={{ display: "flex", height: 38 }} key={`sensitivity-${index}`}>
                                    <Form.Select
                                        value={sensitivity}
                                        style={{
                                            borderTopRightRadius: 0,
                                            borderBottomRightRadius: 0,
                                        }}
                                        options={[
                                            { text: 'technical', value: 'technical' },
                                            { text: 'interaction', value: 'interaction' },
                                            { text: 'stored content', value: 'stored_content' },
                                            { text: 'highly sensitive', value: 'highly_sensitive' },
                                        ]}
                                        onChange={({ target: { value: newValue }})=> changeElementOnStateArray(newValue, index, dataSensitivity, setDataSensitivity)}
                                    />
                                    <Button
                                        style={{
                                            borderTopLeftRadius: 0,
                                            borderBottomLeftRadius: 0,
                                        }}
                                        icon="trash"
                                        onClick={() => removeElementFromStateArray(index, dataSensitivity, setDataSensitivity)} />
                                </Grid.Row>
                                ))
                            }
                            <Button style={{ marginTop: 20 }} type="button" onClick={() => addElementToStateArray(dataSensitivity, setDataSensitivity)}>
                                Add more sensitivity types
                            </Button>
                        </Form.Field>
                    </Grid.Column>
                </Grid>

            </Grid.Row>
            <Grid.Row style={{ marginTop: 20 }}>
                <Form.Field>
                <Header as="h5">
                    Bugs
                </Header>
                {bugs.map((bug, index) => (
                    <Grid.Row key={`bug-${index}`}>
                        <Input
                            action={{
                                icon: "trash",
                                onClick: () => removeElementFromStateArray(index, bugs, setBugs)
                            }}
                            value={bug}
                            onChange={({ target: { value: newValue }})=> changeElementOnStateArray(newValue, index, bugs, setBugs)}
                        />
                    </Grid.Row>
                    ))
                }
                <Button style={{ marginTop: 20 }} type="button" onClick={() => addElementToStateArray(bugs, setBugs)}>
                    Add more bugs
                </Button>
                </Form.Field>
            </Grid.Row>
            <Grid.Row style={{ marginTop: 20 }}>
                <Form.Field>
                <Header as="h5">
                    Data reviews
                </Header>
                {dataReviews.map((dataReview, index) => (
                    <Grid.Row key={`data-review-${index}`}>
                        <Input
                            action={{
                                icon: "trash",
                                onClick: () => removeElementFromStateArray(index, dataReviews, setDataReviews)
                            }}
                            value={dataReview}
                            onChange={({ target: { value: newValue }})=> changeElementOnStateArray(newValue, index, dataReviews, setDataReviews)}
                        />
                    </Grid.Row>
                    ))
                }
                <Button style={{ marginTop: 20 }} type="button" onClick={() => addElementToStateArray(dataReviews, setDataReviews)}>
                    Add more data reviews
                </Button>
                </Form.Field>
            </Grid.Row>
            <Grid.Row style={{ marginTop: 20 }}>
                <Form.Field>
                <Header as="h5">
                    Notification Emails
                </Header>
                {notificationEmails.map((email, index) => (
                    <Grid.Row key={`notification-email-${index}`}>
                        <Input
                            action={{
                                icon: "trash",
                                onClick: () => removeElementFromStateArray(index, notificationEmails, setNotificationsEmails)
                            }}
                            value={email}
                            onChange={({ target: { value: newValue }})=> changeElementOnStateArray(newValue, index, notificationEmails, setNotificationsEmails)}
                        />
                    </Grid.Row>
                    ))
                }
                <Button style={{ marginTop: 20 }} type="button" onClick={() => addElementToStateArray(notificationEmails, setNotificationsEmails)}>
                    Add more emails
                </Button>
                </Form.Field>
            </Grid.Row>
            <Divider horizontal />
            <Grid.Row style={{ marginTop: 20 }}>
                <Header as="h5">
                    Extra Keys
                </Header>
                {extraKeys.length === 0 && (
                    <div style={{ width: "100%" }}>
                        <Button style={{ marginTop: 20 }} type="button" onClick={prefillInteraction}>
                            Pre-fill for interaction
                        </Button>
                        <Button style={{ marginTop: 20 }} type="button" onClick={prefillImpression}>
                            Pre-fill for impression
                        </Button>
                    </div>
                )}
                {extraKeys.map(({ name, description, type }, index) => (
                    <Grid.Row key={`extra-key-${index}`}>
                    <Grid.Row style={{ marginTop: 20 }}>
                        <Form.Field>
                        <label>Name</label>
                        <Input
                            value={name}
                            onChange={({ target: { value: newValue }})=> changeExtraKeyProp(newValue, index, "name")}
                        />
                        </Form.Field>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: 20 }}>
                        <Form.Field>
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={({ target: { value: newValue }})=> changeExtraKeyProp(newValue, index, "description")}
                        />
                        </Form.Field>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: 20 }}>
                        <Form.Select
                            fluid
                            label='Type'
                            value={type}
                            options={[
                                { text: 'string', value: 'string' },
                                { text: 'quantity', value: 'quantity' },
                                { text: 'boolean', value: 'boolean' },
                              ]}
                              onChange={({ target: { value: newValue }})=> changeExtraKeyProp(newValue, index, "type")}
                        />
                    </Grid.Row>
                    <Button style={{ marginTop: 20 }} color="red" type="button" onClick={() => removeElementFromStateArray(index, extraKeys, setExtraKeys)}>
                        Remove this extra key
                    </Button>
                    </Grid.Row>
                ))}
                <Button style={{ marginTop: 20 }} type="button" onClick={addEmptyExtraKey}>
                    Add more extra keys
                </Button>
            </Grid.Row>
            <Grid.Row>
                <Button style={{ marginTop: 40, width: "100%" }} color="green" type="submit">Add metric</Button>
            </Grid.Row>
        </Form>
    )
}

export default TheForm;
