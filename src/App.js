import React, { useState, useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import TheForm from "./Form"
import Metrics from "./Metrics"

function App() {
  const [metrics, setMetrics] = useState(JSON.parse(localStorage.getItem("metrics")));
  const [editingMetric, setEditingMetric] = useState({});

  useEffect(() => {
    localStorage.setItem("metrics", JSON.stringify(metrics));
  }, [metrics]);

  return (
    <Grid columns={2} style={{margin: "50px"}}>
      <Grid.Row>
        <Grid.Column>
          <TheForm value={editingMetric} handleNewMetric={newMetric => setMetrics([...metrics, newMetric])} />
        </Grid.Column>
        <Grid.Column>
          <Metrics
            metrics={metrics}
            setMetrics={setMetrics}
            setEditingMetric={setEditingMetric} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default App;
