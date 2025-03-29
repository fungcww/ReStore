import { PaymentSummary, ShippingAddress } from "../app/models/order";


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
export const formatAddressString = (address: ShippingAddress) => {
    return `${address?.line1}, ${address?.city}, ${address?.state},
        ${address?.postal_code}, ${address?.country} `
}

export const formatPaymentString = (card: PaymentSummary) => {
    // if (!confirmationToken?.payment_method_preview.card) return '';
    // const {card} = confirmationToken.payment_method_preview;
    return `${card.brand.toUpperCase()}, **** **** **** ${card.last4}, 
    Exp: ${card.exp_month}/${card.exp_year}`
}
