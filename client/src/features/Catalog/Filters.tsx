import { Box , Button, Paper, Typography } from "@mui/material";
import Search from "./Search";
import RadioButtonGroup from "../../app/shared/components/RadioButtonGroup";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { resetParam, setBrands, setOrderBy } from "./catalogSlice";
import CheckboxButtons from "../../app/shared/components/CheckboxButtons";

const sortOptions = [
    {value: 'name', label: 'Alphabetical'},
    {value: 'priceDesc', label: 'Price: High to low'},
    {value: 'price', label: 'Price: Low to high'},
]

type Props = {
    filtersData : {brands: string[]; types: string[];}
}

export default function Filters({filtersData : data} : Props) {
    //destructure the Props into filtersData and assign it as data
    //const {data} = useFetchFiltersQuery();
    const {orderBy, types, brands} = useAppSelector(state => state.catalog)
    const dispatch = useAppDispatch();

    if (!data?.brands || !data.types) return <Typography>It's just loading</Typography>
    
    return (
        <Box display='flex' flexDirection='column' gap={3}>
            <Paper>
                <Search/>
            </Paper>
            <Paper sx={{p:3}}>
                <RadioButtonGroup
                    selectedValue={orderBy}
                    sortOptions={sortOptions}
                    onChange={e => dispatch(setOrderBy(e.target.value))}
                />
            </Paper>
            <Paper sx={{p:3}}>
                <CheckboxButtons
                    items={data.brands}
                    checked={brands}
                    onChange={(items: string[]) => dispatch(setBrands(items))}//update to redux store
                />
            </Paper>
            <Paper sx={{p:3}}>
            <CheckboxButtons
                    items={data.types}
                    checked={types}
                    onChange={(items: string[]) => dispatch(setBrands(items))}//update to redux store
                />
            </Paper>
            <Button onClick={() => dispatch(resetParam())}>Reset Filters</Button>
        </Box>
    )
}