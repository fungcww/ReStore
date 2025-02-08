import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { ChangeEvent } from "react";

type Props = {
    sortOptions: {value: string, label: string}[]
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    selectedValue: string
}

export default function RadioButtonGroup({sortOptions, onChange, selectedValue} : Props){
    return (
        <FormControl>
            <RadioGroup
                onChange={onChange}
                value={selectedValue}
                sx={{my: 0}}
            >
                {sortOptions.map(({value, label}) => (
                    <FormControlLabel
                        key={label}
                        control={<Radio color='secondary' sx={{py: 0.7}}/>}
                        label={label}
                        value={value}
            />
                ))}
            </RadioGroup>
    </FormControl>
    )
}