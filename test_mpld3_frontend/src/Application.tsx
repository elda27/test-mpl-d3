import * as React from "react"
import axios from "axios"
import mpld3 from "mpld3"
const plotTypes = ["pairplot"]

// interface PlotResponse {
//   spec: object // eslint-disable-line @typescript-eslint/ban-types
//   process: object // eslint-disable-line @typescript-eslint/ban-types
//   clearElem: object // eslint-disable-line @typescript-eslint/ban-types
// }

export const Application: React.FC = () => {
  const [plotType, setPlotType] = React.useState<string | null>(plotTypes[0])
  const [dataType, setDataType] = React.useState<string | null>(null)
  const [dataTypes, setDataTypes] = React.useState<string[] | null>(null)

  const drawingCanvasId = "mpl-canvas"

  React.useEffect(() => {
    const fetch = async () => {
      const newDataTypes = (await axios.get<string[]>("/list")).data
      setDataTypes(newDataTypes)
      if (!dataType && newDataTypes) {
        setDataType(newDataTypes[0])
      }
    }

    fetch()
  }, [])

  React.useEffect(() => {
    if (!plotType || !dataType) {
      return
    }

    const fetch = async () => {
      const response = await axios.get<string>(`/${plotType}?dataType=${dataType}`)
      // const { spec, process, clearElem } = response.data
      mpld3.draw_figure(drawingCanvasId, response.data, undefined, true)
    }

    fetch()
  }, [plotType, dataType])

  return (
    <div>
      <div>
        <div>{mpld3.version}</div>
        {/* Data */}
        <select
          value={dataType ?? ""}
          onChange={(event) => {
            setDataType(event.currentTarget.value)
          }}
        >
          {dataTypes?.map((type) => {
            return (
              <option value={type} key={type}>
                {type}
              </option>
            )
          })}
        </select>
        {/* Plot type */}
        <select
          value={plotType ?? plotTypes[0]}
          onChange={(event) => {
            setPlotType(event.currentTarget.value)
          }}
        >
          {plotTypes.map((type) => {
            return (
              <option value={type} key={type}>
                {type}
              </option>
            )
          })}
        </select>
      </div>
      <div id={drawingCanvasId}></div>
    </div>
  )
}

export default Application
