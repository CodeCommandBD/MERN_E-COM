'use client'

import { ThemeProvider } from "@mui/material"
import DataTable from "./DataTable"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { darkTheme, lightTheme } from "@/lib/materialTheme"

const DataTableWrapper = ({
  queryKey,
  fetchUrl,
  columnsConfig,
  initialPageSize = 10,
  exportEndpoint,
  deleteType,
  deleteEndpoint,
  trashView,
  createAction
}) => {
  
  const {resolvedTheme} = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(()=>{
    setMounted(true)
  },[])

  if(!mounted) return null
  return (
    <ThemeProvider theme={resolvedTheme === 'dark' ? darkTheme:lightTheme}>
      <DataTable 
          queryKey={queryKey}
          fetchUrl={fetchUrl}
          columnsConfig={columnsConfig}
          initialPageSize = {initialPageSize}
          exportEndpoint={exportEndpoint}
          deleteType={deleteType}
          deleteEndpoint={deleteEndpoint}
          trashView={trashView}
          createAction={createAction}
      ></DataTable>
    </ThemeProvider>
  )
}

export default DataTableWrapper
