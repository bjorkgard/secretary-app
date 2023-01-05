const getPublisherRows = (publishers) => {
    const rows = []

    publishers.map(publisher => {
        let address = publisher.address1
        if(publisher.address2){
            address += `\n${publisher.address2}`
        }
        address += `\n${publisher.zip} ${publisher.city}`

        let other = ''

        if(publisher.appointments.length){
            publisher.appointments.map(appointment => {
                other += `${appointment.type.name}, `
            })

            other = other.slice(0, -2) + '\n'
        }

        // Children
        if(publisher.children.length){
            other += 'Barn: '
            publisher.children.map((child, index) => {
                other += (index > 0 ? ', ' : '') + child.firstName
            })
        }

        rows.push([
            publisher.serviceGroup.name,
            `${publisher.lastName}, ${publisher.firstName}`,
            address,
            publisher.phone ? publisher.phone.formatted : '',
            publisher.cell ? publisher.cell.formatted : '',
            publisher.email,
            other,
        ])
    })

    return rows
}

export default getPublisherRows
