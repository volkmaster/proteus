import { Translate } from '@google-cloud/translate'

const projectId = 'project-id-5593195159403283543'

const translate = new Translate({
    projectId: projectId,
})

async function sloveneToEnglish(text) {
    const results = await translate.translate(text, 'en')
    return results[0]
}

module.exports = { sloveneToEnglish }
