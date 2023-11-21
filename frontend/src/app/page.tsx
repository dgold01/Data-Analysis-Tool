'use client'

import React, { useState } from 'react'
import OpviaTable from '../components/Table'
import DataCalcHeader from '../components/DataCalcHeader'
import { dummyTableData } from '../data/dummyData'

const App: React.FC = () => {
  const [columnMapping, setColumnMapping] = useState<Record<string, number>>({})
  const [aggregationColumns, setAggregationColumns] = useState<Array<{ columnName: string, columnType: string, columnId: string }>>([])
  const [aggregatedValues, setAggregatedValues] = useState<Record<string, Array<{ type: string, value: number }>>>({})
  const [rateOfChangeValues, setRateOfChangeValues] = useState<Record<string, Array<{ timeInterval: string, value: number }>>>({})
  const [rateOfChangeColumns, setRateOfChangeColumns] = useState<Array<{ columnName: string, columnType: string, columnId: string }>>([])
  const [dummyData, setDummyData] = useState<Record<string, string | number>>(dummyTableData)
  const [columns, setColumns] = useState([
    { columnName: 'Time', columnType: 'time', columnId: 'time_col' },
    { columnName: 'Cell Density', columnType: 'data', columnId: 'var_col_1' },
    { columnName: 'Volume', columnType: 'data', columnId: 'var_col_2' }
  ])

  return (
    <div className="App">
      <DataCalcHeader
        setAggregationColumns={setAggregationColumns}
        setAggregatedValues={setAggregatedValues}
        setRateOfChangeValues={setRateOfChangeValues}
        setRateOfChangeColumns={setRateOfChangeColumns}
        setDummyData={setDummyData}
        setColumns={setColumns}
        rateOfChangeValues={rateOfChangeValues}
        columns={columns}
        dummyData={dummyData}
        columnMapping={columnMapping}
        aggregatedValues={aggregatedValues}
      />
      <OpviaTable
        setColumnMapping={setColumnMapping}
        dummyData={dummyData}
        aggregationColumns={aggregationColumns}
        aggregatedValues={aggregatedValues}
        columns={columns}
        rateOfChangeValues={rateOfChangeValues}
        rateOfChangeColumns={rateOfChangeColumns}
      />
    </div>
  )
}

export default App
