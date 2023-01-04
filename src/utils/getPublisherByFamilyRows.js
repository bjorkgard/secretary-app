import PublisherService from '@/services/publisherService'

const publisherService = new PublisherService()

const getPublisherByFamilyRows = async (contacts) => {
    const promises = contacts.map( async (publisher) => {
        let familyRow = `${publisher.lastName} ${publisher.firstName}`

        // Add family members
        await publisherService.findBy('contact.value', publisher._id).then(response => {
            if(response){
                response.map( (member) => {
                    familyRow += `, ${member.firstName}`
                })
            }
        })

        // Add children
        if(publisher.children){
            publisher.children.map((child) => {
                familyRow += `, ${child.firstName}`
            })
        }

        return [ familyRow ]
    })

    const rows = await Promise.all(promises)

    return rows
}

export default getPublisherByFamilyRows
