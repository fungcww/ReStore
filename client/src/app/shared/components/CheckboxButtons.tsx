import { Checkbox, FormControlLabel, FormGroup } from "@mui/material"
import { useEffect, useState } from "react";

type Props = {
    items: string[];
    checked : string[];
    onChange: (items: string[]) => void;//customer function to take item/ updated item from outside
}

export default function CheckboxButtons({items, checked, onChange}: Props){
    //create local state to keep track on item
    const [checkedItems, setCheckedItems] = useState(checked);
    useEffect(() => {
        setCheckedItems(checked);//update our checked box
    }, [checked]) //<- dependency
     
    const handleToggle = (value: string) => {
        const updatedChecked = checkedItems?.includes(value)
        ? checkedItems.filter(item => item !== value) //filter -> only include + conditions
        : [...checkedItems, value]; //... -> spread operator 
                                // -> creating a new array that includes all the items from an existing array and adding additional elements to it
        setCheckedItems(updatedChecked);
        onChange(updatedChecked);
    }

    return (
        <FormGroup>
        {items.map(item => (
            <FormControlLabel
                key = {item}
                control={<Checkbox
                    checked = {checkedItems.includes(item)}
                    onClick={() => handleToggle(item)}
                    color='secondary' 
                    sx={{py: 0.7, fontSize: 40}} 
                />}
                label={item}
            />
        ))}
    </FormGroup>
    )
}