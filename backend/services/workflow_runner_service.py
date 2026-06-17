import threading

from workflows.content_workflow import (
    ContentWorkflow
)


class WorkflowRunnerService:

    @staticmethod
    def start(
        state
    ):

        workflow = (
            ContentWorkflow()
        )

        thread = threading.Thread(

            target=workflow.run,

            args=(state,),

            daemon=True
        )

        thread.start()

        return thread