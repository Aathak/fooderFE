export const dateFormat = (dateString: string) => {
    let date = new Date(dateString);

    let monthNames = [
        'January', 'February', 'March', 'April', 'Mei', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let convertedDate = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();

    return convertedDate
}

export const priceFormat = (price: number) => {
    return `Rp.${price.toLocaleString('id-ID')},-`;
}