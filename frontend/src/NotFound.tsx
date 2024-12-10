import {EmptyState} from "@/components/ui/empty-state"
import {TbError404} from "react-icons/tb";
import {Code} from "@chakra-ui/react";

function NotFound() {
    return (
        <EmptyState
            icon={<TbError404/>}
            title="I think your lost"
            description="The page that your trying to access does not exist"
            size="lg"
        >
            <Code>404 Not Found</Code>
        </EmptyState>
    )
}

export default NotFound;