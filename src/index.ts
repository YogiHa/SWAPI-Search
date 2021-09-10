#!/usr/bin/env node

import { prompt } from 'inquirer'
import axios from 'axios'

enum EApiTypes {
    planets = 'planets',
    starships = 'starships',
    vehicles = 'vehicles',
    people = 'people',
    films = 'films',
    species = 'species'
}

type TSwObj = {
    name?: string
    title?: string
    species?: string[]
    films?: string[]
    people?: string[]
    vehicles?: string[]
    starships?: string[]
    planets?: string[]
    characters?: string[]
}

type TSwSearchRes = {
    count: number
    results: TSwObj[]
}

let getNameOrTitle: (obj: TSwObj) => string = (obj) => obj['name'] || obj['title'] || ''

async function search() {
    let searchStr: string = process.argv.slice(2).join(' ')
    if (!searchStr) {
        console.log(`Can't search w/t input`)
        return
    }

    let result: TSwObj | null = null
    let apiTypes: EApiTypes[] = Object.values(EApiTypes)
    let typeIdx: number = 0

    while (!result && typeIdx < apiTypes.length) {
        let category: EApiTypes = apiTypes[typeIdx]
        let apiSearchRes: TSwSearchRes = (await axios.get(`https://swapi.dev/api/${category}/?search=${searchStr}`))
            .data
        if (!apiSearchRes.count) typeIdx++
        else {
            let categoryIdx: number = 0
            while (categoryIdx < apiSearchRes.count) {
                let tempRes = apiSearchRes.results[categoryIdx]
                if (!tempRes.people && tempRes.characters) tempRes.people = tempRes.characters
                let { userChoice }: { userChoice: number } = await prompt({
                    message: `show results for ${getNameOrTitle(tempRes)}?`,
                    name: 'userChoice',
                    type: 'list',
                    choices: [
                        { name: 'yes', value: 1 },
                        ...(categoryIdx + 1 < apiSearchRes.count
                            ? [{ name: `I'm not searching for ${getNameOrTitle(tempRes)}`, value: 0 }]
                            : []),
                        { name: `I'm not searching for kind of ${category}`, value: -1 }
                    ]
                })
                if (userChoice == 0) categoryIdx++
                else {
                    userChoice < 0 ? typeIdx++ : (result = tempRes)
                    break
                }
            }
        }
    }
    if (!result) console.log(`couldn't find anything for this input`)
    else {
        for (let i = 0; i < apiTypes.length; i++) {
            if (result[apiTypes[i]]?.length) {
                console.log(`\nAssociated ${apiTypes[i]}:`)
                // @ts-ignore
                let promises = result[apiTypes[i]].map(async (url) => {
                    let { data }: { data: TSwObj } = await axios.get(url)
                    console.log(`-- ${getNameOrTitle(data)}`)
                })
                await Promise.all(promises)
            }
        }
    }
}

search()
