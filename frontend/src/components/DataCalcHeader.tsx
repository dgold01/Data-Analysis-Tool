'use client'

import * as React from 'react'
import { useState } from 'react'
import getSparseRefFromIndexes from '../utility/getSparseRefFromIndexes'
import { parseAndEvaluateFormula } from '../utility/formulaHandler'
import aggregationHandler from '../utility/aggregationHandler'
import { getTimeIntervals, type TimeInterval } from '../utility/getTimeIntervals'
import { evaluateRateOfChange } from '../utility/rateOfChangeHandler'
import './DataCalcHeader.css'

interface DataCalcHeaderProps {
  setAggregationColumns: React.Dispatch<React.SetStateAction<Array<{ columnName: string, columnType: string, columnId: string }>>>
  setAggregatedValues: React.Dispatch<React.SetStateAction<Record<string, Array<{ type: string, value: number }>>>>
  setDummyData: React.Dispatch<React.SetStateAction<Record<string, string | number>>>
  setColumns: React.Dispatch<React.SetStateAction<Array<{ columnName: string, columnType: string, columnId: string }>>>
  setRateOfChangeValues: React.Dispatch<React.SetStateAction<Record<string, Array<{ timeInterval: string, value: number }>>>>
  setRateOfChangeColumns: React.Dispatch<React.SetStateAction<Array<{ columnName: string, columnType: string, columnId: string }>>>
  columnMapping: Record<string, number>
  rateOfChangeValues: Record<string, Array<{ timeInterval: string, value: number }>>
  dummyData: Record<string, string | number>
  aggregatedValues: Record<string, Array<{ type: string, value: number }>>
  columns: Array<{ columnName: string, columnType: string, columnId: string }>
}

const DataCalcHeader: React.FC<DataCalcHeaderProps> = (props) => {
  const {
    setAggregationColumns,
    setAggregatedValues,
    setColumns,
    setDummyData,
    setRateOfChangeValues,
    setRateOfChangeColumns,
    columnMapping,
    aggregatedValues,
    columns,
    dummyData,
    rateOfChangeValues
  } = props

  const [inputClassName, setInputClassName] = useState<string>('')
  const [intervalOptions, setIntervalOptions] = useState<TimeInterval[]>([])
  const [columnSuggestions, setColumnSuggestions] = useState<Array<{ columnName: string, columnType: string, columnId: string }>>([])
  const [isRateOfChangeOptionsVisible, setIsRateofChangeVisible] = useState(false)
  const [isFormulaInputVisible, setIsFormulaInputVisible] = useState(false)
  const [isAggregationOptionsVisible, setIsAggregationOptionsVisible] = useState(false)
  const [selectedAggregationColumn, setSelectedAggregationColumn] = useState('')
  const [selectedRateColumn, setSelectedRateColumn] = useState('')
  const [selectedInitalTime, setSelectedInitalTime] = useState('')
  const [selectedFinalTime, setSelectedFinalTime] = useState('')
  const [selectedAggregationType, setSelectedAggregationType] = useState('')
  const [columnNamesInFormula, setColumnNamesinFormula] = useState<string[]>([])
  const [formula, setFormula] = useState('')

  const aggregationOptions = [
    { label: 'Sum', value: 'sum' },
    { label: 'Average', value: 'average' },
    { label: 'Max', value: 'max' },
    { label: 'Min', value: 'min' }
  ]

  const aggregationTypeOptions = aggregationOptions.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))

  const potentialColumns = columns.filter(column => column.columnName !== 'Time')

  const columnOptions = potentialColumns.map((column) => (
    <option key={column.columnId} value={column.columnName}>
      {column.columnName}
    </option>
  ))

  // This function gets called when user confirms an aggregation calculation
  const handleConfirmAggregate = (): void => {
    const value = aggregationHandler(selectedAggregationType, columnMapping[selectedAggregationColumn], dummyData)
    if (typeof value === 'number') {
      const aggregateObject = { type: selectedAggregationType, value }
      // Check to see if aggregation calculations have been done for this column yet, if not a new array is created, if yes the arggregateObject is added to the present array
      if (aggregatedValues[selectedAggregationColumn]) {
        if (aggregatedValues[selectedAggregationColumn].every(item => item.type !== selectedAggregationType)) {
          aggregatedValues[selectedAggregationColumn].push(aggregateObject)
        }
      } else aggregatedValues[selectedAggregationColumn] = [aggregateObject]

      const newColumn = {
        columnName: `${selectedAggregationColumn} (${selectedAggregationType})`,
        columnType: `${selectedAggregationType}`,
        columnId: `${selectedAggregationColumn}`
      }

      setAggregationColumns((prevColumns) => [
        ...prevColumns,
        newColumn
      ])

      setAggregatedValues(aggregatedValues)
      setSelectedAggregationColumn('')
      setSelectedAggregationType('')
    }
  }

  // Functions to control visibility of menu buttons
  const handleAddFormula = (): void => {
    if (isAggregationOptionsVisible) setIsAggregationOptionsVisible(!isAggregationOptionsVisible)
    if (isRateOfChangeOptionsVisible) setIsRateofChangeVisible(!isRateOfChangeOptionsVisible)
    setIsFormulaInputVisible(!isFormulaInputVisible)
  }

  const handleAddAggregate = (): void => {
    if (isFormulaInputVisible) setIsFormulaInputVisible(!isFormulaInputVisible)
    if (isRateOfChangeOptionsVisible) setIsRateofChangeVisible(!isRateOfChangeOptionsVisible)
    setIsAggregationOptionsVisible(!isAggregationOptionsVisible)
  }

  const handleAddRate = (): void => {
    const timeIntervals = getTimeIntervals(dummyData)
    const intervalOptions: TimeInterval[] = []
    timeIntervals.map((time) => {
      intervalOptions.push({ index: time.index, timeString: time.timeString, timeMilliseconds: time.timeMilliseconds })
    })

    setIntervalOptions(intervalOptions)
    if (isFormulaInputVisible) setIsFormulaInputVisible(!isFormulaInputVisible)
    if (isAggregationOptionsVisible) setIsAggregationOptionsVisible(!isAggregationOptionsVisible)
    setIsRateofChangeVisible(!isRateOfChangeOptionsVisible)
  }

  // Functions to control user input
  const handleRateColumnSelection = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedRateColumn(event.target.value)
  }

  const handleInitalTimeSelect = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedInitalTime(event.target.value)
  }

  const handleFinalTimeSelect = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedFinalTime(event.target.value)
  }

  const handleFormulaInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const formulaText = event.target.value
    // Create a regular expression pattern for all column names in the table
    const columnNamesPattern = new RegExp(`\\b(${columns.map(col => col.columnName).join('|')})\\b`, 'g')
    // Stores column names found in columns, that have been written out fully in th formula input
    const columnNamesInFormula = formulaText.match(columnNamesPattern) || []
    const mathOperators = ['\\+', '-', '\\*', '/', '\\(', '\\)']
    let sanitizedFormula = formulaText

    // Remove all occurrences of column names from the formula that have already been typed out, to help with suggestioning new columns
    columnNamesInFormula.forEach((columnName) => {
      sanitizedFormula = sanitizedFormula.replace(new RegExp(`\\b${columnName}\\b`, 'g'), '')
    })

    // Remove all occurrences of mathematical operators from the formula that have already been typed out, to help with suggestioning new columns
    mathOperators.forEach((operator) => {
      sanitizedFormula = sanitizedFormula.replace(new RegExp(operator, 'g'), '')
    })

    // Remove white spaces so they can be compared with column names
    sanitizedFormula = sanitizedFormula.replace(/\s/g, '')

    // Filter the 'columns' array to find columns whose names contain the sanitized formula
    const suggestions = columns.filter((col) => col.columnName.replace(/\s/g, '').includes(sanitizedFormula))
    setColumnNamesinFormula(columnNamesInFormula)

    if (!sanitizedFormula) setColumnSuggestions([])
    else setColumnSuggestions(suggestions)

    const isFormulaValid = suggestions.length !== 0
    const inputClassName = isFormulaValid ? 'valid-input' : 'invalid-input'
    setInputClassName(inputClassName)
    setFormula(event.target.value)
  }

  const handleAggregationTypeSelection = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedAggregationType(event.target.value)
  }

  const handleColumnSelection = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedAggregationColumn(event.target.value)
  }

  const handleSuggestionClick = (suggestion: { columnName: string, columnType: string, columnId: string }): void => {
    const updatedFormula = formula.replace(/[\w_]+$/, suggestion.columnName)
    setFormula(updatedFormula)
    const updatedColumnNamesInFormula = [...columnNamesInFormula, suggestion.columnName]
    setColumnNamesinFormula(updatedColumnNamesInFormula)
  }

  // This function gets called when user confirms a new formula
  const handleConfirmFormula = (): void => {
    const updatedDummyData: Record<string, string | number> = { ...dummyData }
    let isFormulaValid = true
    for (let i = 0; i < 8; i++) {
      const newSparsePosition = getSparseRefFromIndexes(i, columns.length)
      const value = parseAndEvaluateFormula(formula, columnMapping, columnNamesInFormula, dummyData, i)
      if (value === 'Error evaluating the formula') {
        isFormulaValid = false
        break
      }
      updatedDummyData[newSparsePosition] = value
    }
    if (!isFormulaValid) { alert('Formula Incorrect'); return }
    const newColumn = {
      columnName: formula,
      columnType: 'formula',
      columnId: 'formula_col'
    }
    setColumns((prevColumns) => [
      ...prevColumns,
      newColumn
    ])
    setDummyData(updatedDummyData)
  }

  // This function gets called when user calculates rate of change
  const handleCalculateRate = (): void => {
    const columnIndex = columnMapping[selectedRateColumn]

    const value = evaluateRateOfChange(columnIndex, dummyData, selectedInitalTime, selectedFinalTime, intervalOptions)
    if (typeof value === 'number') {
      const rateOfChangeObject = { timeInterval: `${selectedInitalTime} to ${selectedFinalTime}`, value }
      // Check to see if rate calculations have been done for this column yet, if not a new array is created, if yes the rateOfChangeObject is added to the present array
      if (rateOfChangeValues[selectedRateColumn]) {
        if (rateOfChangeValues[selectedRateColumn].every(item => item.timeInterval !== `${selectedInitalTime} to ${selectedFinalTime}`)) {
          rateOfChangeValues[selectedRateColumn].push(rateOfChangeObject)
        }
      } else rateOfChangeValues[selectedRateColumn] = [rateOfChangeObject]

      const newColumn = {
        columnName: `Rate of ${selectedRateColumn} change from ${selectedInitalTime} to ${selectedFinalTime} (unit/s)`,
        columnType: `${selectedInitalTime} to ${selectedFinalTime}`,
        columnId: `${selectedRateColumn}`
      }

      setRateOfChangeColumns((prevColumns) => [
        ...prevColumns,
        newColumn
      ])

      setRateOfChangeValues(rateOfChangeValues)
      setSelectedRateColumn('')
      setSelectedInitalTime('')
      setSelectedFinalTime('')
    }
  }

  return (
    <div className='container'>
      <div className='menuButtonsContainer'>
        <button className='menuButtons' onClick={handleAddAggregate}>Aggregations</button>
        <button className='menuButtons' onClick={handleAddFormula}>Custom Formula</button>
        <button className='menuButtons' onClick={handleAddRate}>Rate of change</button>
        <></>
      </div>
      {isFormulaInputVisible && (
        <div className="autocomplete" style={{ width: '10%' }}>
          <input
            placeholder="Enter Formula"
            value={formula}
            onChange={handleFormulaInputChange}
            className={inputClassName}
          />
          {columnSuggestions.length > 0 && (
            <div className="autocomplete-items">
              {columnSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => { handleSuggestionClick(suggestion) }}
                >
                  {suggestion.columnName}
                </div>
              ))}
            </div>
          )}
          <button className='confirmButton'
            onClick={() => {
              handleConfirmFormula()
              setIsFormulaInputVisible(false)
            }}
          >
            Confirm Formula
          </button>
        </div>
      )}
      {isAggregationOptionsVisible && (
        <div className='aggregationButtonsContainer'>
          <select className='aggregationButtons' value={selectedAggregationColumn} onChange={handleColumnSelection}>
            <option value="">Select a column</option>
            {columnOptions}
          </select>
          <select value={selectedAggregationType} onChange={handleAggregationTypeSelection}>
            <option value="">Select an aggregation type</option>
            {aggregationTypeOptions}
          </select>
          <button onClick={handleConfirmAggregate}>Confirm Aggregation</button>
        </div>
      )}
      {isRateOfChangeOptionsVisible && (
        <div className='rateChangeContainer'>
          <select className='rateChangeButtons' value={selectedRateColumn} onChange={handleRateColumnSelection}>
            <option value="">Select a column</option>
            {columnOptions}
          </select>
          <select className='rateChangeInterval' onChange={handleInitalTimeSelect}>
            <option value="">Select initial time</option>
            {intervalOptions.map((option) => (
              <option key={option.timeString} value={option.timeString}>
                {option.timeString}
              </option>
            ))}
          </select>
          <select className='rateChangeInterval' onChange={handleFinalTimeSelect}>
            <option value="">Select final interval</option>
            {intervalOptions.map((option) => (
              <option key={option.timeString} value={option.timeString}>
                {option.timeString}
              </option>
            ))}
          </select>
          <button className='rateChangeButton' onClick={handleCalculateRate}>Calculate Rate of Change</button>
        </div>
      )
      }
    </div>

  )
}

export default DataCalcHeader
