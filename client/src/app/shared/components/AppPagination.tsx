import { Box, Pagination, Typography } from "@mui/material";
import { Pagination as PaginationType } from "../../models/pagination";

type Props = {
    metadata: PaginationType
    onPageChange: (page: number) => void
}

export default function AppPagination({metadata, onPageChange} : Props) {
    const {currentPage, totalPage, pageSize, totalCount} = metadata

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalCount);
    //can avoid case only 1-2 items returned and use the wrong endItem

    return (
        <Box display='flex' justifyContent={"space-between"} alignItems={"center"} marginTop={3}>
            <Typography>
                Displaying {startItem}-{endItem} of {totalCount} items
            </Typography>
            <Pagination
            color="secondary"
            size="large"
            count={totalPage}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
    />
        </Box>
    )
}