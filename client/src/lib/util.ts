export function currencyFormat(amount: number){
    return '$' + (amount / 100).toFixed(2)
}

export function filterEmptyValues(value: object){
    return Object.fromEntries(
        Object.entries(value).filter(
            ([,value]) => value !== '' && value !== null 
            && value !== undefined && value.length !== 0
        )
    )
}