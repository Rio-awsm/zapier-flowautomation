"use client"

import { ErrorView, LoadingView } from "@/components/shared/entity-views/entity-util-components"
import { useSuspenseWorkflow } from "../workflows/hooks/use-workflows"

export const EditorLoading = () => {
    return <LoadingView message="Loading Editor..."/>
}

export const EditorError = () => {
    return <ErrorView message="Error Loading the Editor!"/>
}


export const Editor = ({workflowId}: {workflowId: string}) => {
    const {data : workflow} = useSuspenseWorkflow(workflowId)
  return (
    <div>
      {JSON.stringify(workflow,null, 2)}
    </div>
  )
}


