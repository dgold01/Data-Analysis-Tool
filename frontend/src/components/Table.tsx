'use client'

import * as React from 'react'

import { Column, EditableCell2, Table2 } from '@blueprintjs/table'

import { useEffect } from 'react'

interface OpviaTableProps {
  aggregationColumns: Array<{ columnName: string, columnType: string, columnId: string }>
  aggregatedValues: Record<string, Array<{ type: string, value: number }>>
  columns: Array<{ columnName: string, columnType: string, columnId: string }>
  dummyData: Record<string, string | number>
  rateOfChangeValues: Record<string, Array<{ timeInterval: string, value: number }>>
  rateOfChangeColumns: Array<{ columnName: string, columnType: string, columnId: string }>
  setColumnMapping: React.Dispatch<React.SetStateAction<Record<string, number>>>
}

const OpviaTable: React.FC<OpviaTableProps> = (props) => {
  const {
    aggregationColumns,
    aggregatedValues,
    columns,
    dummyData,
    rateOfChangeValues,
    rateOfChangeColumns,
    setColumnMapping
  } = props

  useEffect(() => {
    setColumnMapping(columnMapping)
  }, [dummyData])

  const columnMapping: Record<string, number> = {}

  const getSparseRefFromIndexes = (
    rowIndex: number,
    columnIndex: number
  ): string => `${columnIndex}-${rowIndex}`

  const cellRenderer = (rowIndex: number, columnIndex: number) => {
    const sparsePosition = getSparseRefFromIndexes(rowIndex, columnIndex)

    const value = dummyData[sparsePosition]

    return <EditableCell2 value={String(value)} />
  }

  const aggregationCellRenderer = (rowIndex: number, columnIndex: number) => {
    const columnId = aggregationColumns[columnIndex].columnId
    const columnType = aggregationColumns[columnIndex].columnType

    const value = aggregatedValues[columnId].filter(obj => obj.type === columnType)[0].value

    return <EditableCell2 value={String(value)} />
  }

  const rateOfChangeCellRenderer = (rowIndex: number, columnIndex: number) => {
    const columnId = rateOfChangeColumns[columnIndex].columnId
    const columnType = rateOfChangeColumns[columnIndex].columnType

    const value = rateOfChangeValues[columnId].filter(obj => obj.timeInterval === columnType)[0].value

    return <EditableCell2 value={String(value)} />
  }

  const aggregationCols = aggregationColumns.map((column) => {
    return (
      <Column
        key={`${column.columnId}`}
        cellRenderer={aggregationCellRenderer}
        name={column.columnName}
      />
    )
  })

  const cols = columns.map((column, index) => {
    columnMapping[column.columnName] = index
    return (
      <Column
        key={`${column.columnId}`}
        cellRenderer={cellRenderer}
        name={column.columnName}
      />
    )
  })

  const rateOfChangeCols = rateOfChangeColumns.map((column) => {
    return (
      <Column
        key={`${column.columnId}`}
        cellRenderer={rateOfChangeCellRenderer}
        name={column.columnName}
      />
    )
  })

  return (
    <>
      <Table2 defaultRowHeight={30} numRows={8}>
        {cols}
      </Table2>
      {
        aggregationColumns.length > 0 && (
          <>
            <h1>Aggregation Calculations</h1>
            <Table2 defaultRowHeight={30} numRows={1}>
              {aggregationCols}
            </Table2>
          </>
        )
      }
      {
        rateOfChangeColumns.length > 0 && (
          <>
            <h1>Rate of change calculations</h1>
            <Table2 defaultRowHeight={30} numRows={1}>
              {rateOfChangeCols}
            </Table2>
          </>
        )
      }
    </>
  )
}

export default OpviaTable
